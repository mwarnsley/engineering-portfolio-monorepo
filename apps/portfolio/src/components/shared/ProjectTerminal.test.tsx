import { afterEach, describe, expect, it, vi } from 'vitest';
import { useReducedMotion } from 'framer-motion';
import { act, renderWithProviders, screen, waitFor, within } from '@/test/test-utils';
import { ProjectTerminal } from '@/components/shared/ProjectTerminal';

vi.mock('framer-motion', async (importOriginal) => ({
  ...(await importOriginal<typeof import('framer-motion')>()),
  useReducedMotion: vi.fn(() => false),
}));

afterEach(() => {
  vi.mocked(useReducedMotion).mockReturnValue(false);
  vi.unstubAllGlobals();
});

describe('ProjectTerminal', () => {
  it.each([
    ['Featured Architecture Systems', ['Meeting Application', 'Stock Trader', 'Chat Application']],
    [
      'Interactive Sandboxes & Experiments',
      ['React MASH', 'Restaurant Finder', 'Gamespot', 'Movies'],
    ],
  ])('groups the correct projects under %s', (name, titles) => {
    renderWithProviders(<ProjectTerminal />);
    const section = within(screen.getByRole('region', { name }));
    expect(
      section.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)
    ).toEqual(titles);
  });

  it('shows architecture and engineering challenges on each flagship card', () => {
    renderWithProviders(<ProjectTerminal />);
    const section = within(screen.getByRole('region', { name: 'Featured Architecture Systems' }));
    expect(section.getAllByRole('heading', { name: 'Architecture' })).toHaveLength(3);
    expect(section.getAllByRole('heading', { name: 'Challenges solved' })).toHaveLength(3);
  });

  it.each([
    ['Meeting Application', 'meeting-application'],
    ['Chat Application', 'chat-application'],
    ['Stock Trader', 'stock-trader'],
    ['React MASH', 'react-mash'],
    ['Restaurant Finder', 'restaurant-finder'],
    ['Gamespot', 'gamespot'],
    ['Movies', 'movies'],
  ])('preserves the demo route for %s', (title, slug) => {
    renderWithProviders(<ProjectTerminal />);
    expect(screen.getByRole('link', { name: `Preview Demo of ${title}` })).toHaveAttribute(
      'href',
      `/demo/${slug}`
    );
  });

  it('filters both tiers without mixing their projects', async () => {
    const { user } = renderWithProviders(<ProjectTerminal />);
    await user.click(screen.getByRole('button', { name: 'Vue' }));
    expect(screen.getByRole('button', { name: 'Vue' })).toHaveAttribute('aria-pressed', 'true');
    expect(
      within(screen.getByRole('region', { name: 'Featured Architecture Systems' }))
        .getAllByRole('heading', { level: 3 })
        .map((h) => h.textContent)
    ).toEqual(['Stock Trader']);
    expect(
      within(screen.getByRole('region', { name: 'Interactive Sandboxes & Experiments' }))
        .getAllByRole('heading', { level: 3 })
        .map((h) => h.textContent)
    ).toEqual(['Gamespot', 'Movies']);
  });

  it('explains an empty tier and allows resetting the filter', async () => {
    const { user } = renderWithProviders(<ProjectTerminal />);
    await user.click(screen.getByRole('button', { name: 'React' }));
    expect(
      screen.getByText('No flagship systems in this category. Choose All to see every system.')
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'All' }));
    expect(screen.getAllByRole('link', { name: /Preview Demo of/ })).toHaveLength(7);
  });
  it('preserves the focused demo link when the OS enables reduced motion', async () => {
    const listeners = new Set<(event: { matches: boolean }) => void>();
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        matches: false,
        addEventListener: (_event: string, listener: (event: { matches: boolean }) => void) =>
          listeners.add(listener),
        removeEventListener: (_event: string, listener: (event: { matches: boolean }) => void) =>
          listeners.delete(listener),
      }))
    );
    renderWithProviders(<ProjectTerminal />);
    const link = screen.getByRole('link', { name: 'Preview Demo of Meeting Application' });
    const card = link.closest('li');
    link.focus();

    act(() => listeners.forEach((listener) => listener({ matches: true })));

    expect(screen.getByRole('link', { name: 'Preview Demo of Meeting Application' })).toBe(link);
    expect(link).toHaveFocus();
    await waitFor(() => expect(card).toHaveStyle({ opacity: '1', transform: 'none' }));
  });

  it('restores an empty flagship tier visibly without intersection observer callbacks', async () => {
    // The shared observer stub never invokes its callback: filtering must reveal the grid itself.
    const { user } = renderWithProviders(<ProjectTerminal />);
    await user.click(screen.getByRole('button', { name: 'React' }));
    await user.click(screen.getByRole('button', { name: 'All' }));

    const section = within(screen.getByRole('region', { name: 'Featured Architecture Systems' }));
    const cards = section
      .getAllByRole('heading', { level: 3 })
      .map((heading) => heading.closest('li'));
    expect(cards).toHaveLength(3);
    expect(cards[0]?.parentElement).toHaveStyle({ opacity: '1' });
    expect(
      cards.map((card) => ({ opacity: card?.style.opacity, transform: card?.style.transform }))
    ).toEqual(Array.from({ length: 3 }, () => ({ opacity: '1', transform: 'none' })));
  });
});
