import { vi, describe, it, expect, afterEach } from 'vitest';
import { useReducedMotion } from 'framer-motion';
import { MotionReveal } from '@/components/shared/MotionReveal';
import { act, renderWithProviders, screen, waitFor } from '@/test/test-utils';

vi.mock('framer-motion', async (importOriginal) => ({
  ...(await importOriginal<typeof import('framer-motion')>()),
  useReducedMotion: vi.fn(() => false),
}));

afterEach(() => {
  vi.mocked(useReducedMotion).mockReturnValue(false);
  vi.unstubAllGlobals();
});

describe('MotionReveal', () => {
  it('preserves content and layout classes', () => {
    renderWithProviders(
      <MotionReveal className="space-y-4">
        <button>Explore</button>
      </MotionReveal>
    );
    expect(screen.getByRole('button', { name: 'Explore' }).parentElement).toHaveClass('space-y-4');
  });

  it('renders a plain visible div for reduced motion', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    renderWithProviders(
      <MotionReveal>
        <span>Content</span>
      </MotionReveal>
    );
    expect(screen.getByText('Content').parentElement).not.toHaveAttribute('style');
  });

  it('uses only opacity when direction is none', () => {
    renderWithProviders(
      <MotionReveal direction="none">
        <span>Content</span>
      </MotionReveal>
    );
    expect(screen.getByText('Content').parentElement?.style.transform).toBe('none');
  });

  it('removes active animation when the OS preference changes and unsubscribes', async () => {
    const listeners = new Set<(event: { matches: boolean }) => void>();
    const removeEventListener = vi.fn(
      (_event: string, listener: (event: { matches: boolean }) => void) =>
        listeners.delete(listener)
    );
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        matches: false,
        addEventListener: (_event: string, listener: (event: { matches: boolean }) => void) =>
          listeners.add(listener),
        removeEventListener,
      }))
    );
    const { unmount } = renderWithProviders(
      <MotionReveal>
        <button>Content</button>
      </MotionReveal>
    );
    const content = screen.getByRole('button', { name: 'Content' });
    content.focus();
    act(() => listeners.forEach((listener) => listener({ matches: true })));
    expect(content).toHaveFocus();
    await waitFor(() =>
      expect(content.parentElement).toHaveStyle({ opacity: '1', transform: 'none' })
    );
    unmount();
    expect(removeEventListener).toHaveBeenCalled();
  });
});
