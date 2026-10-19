import { describe, expect, it, vi } from 'vitest';
import { projects } from '@engineering-portfolio/project-registry';
import { renderWithProviders, screen, within } from '@/test';
import { QUICKSTART_COMMAND, SystemBlueprintCard } from './SystemBlueprintCard';

const getRowValue = (label: string) => {
  const term = screen.getByText(label, { selector: 'dt' });
  return term.nextElementSibling as HTMLElement;
};

describe('SystemBlueprintCard', () => {
  // user-event installs its own clipboard stub during setup, so spy after rendering.
  const renderWithClipboard = () => {
    const utils = renderWithProviders(<SystemBlueprintCard onOpenArchitecture={vi.fn()} />);
    const writeText = vi.spyOn(navigator.clipboard, 'writeText');
    return { ...utils, writeText };
  };

  it('should render a labelled region', () => {
    renderWithProviders(<SystemBlueprintCard onOpenArchitecture={vi.fn()} />);
    expect(screen.getByRole('region', { name: /System Blueprint/ })).toBeInTheDocument();
  });

  it.each([
    ['Platform Host', 'React 19 + Vite (apps/portfolio)'],
    ['Primary Focus', 'Enterprise Design Systems & Real-Time Streaming'],
    ['Active Client', 'Understood.org (Next.js 16 / Turbopack)'],
    ['Accessibility', 'WCAG AAA & Section 508 design targets'],
  ])('should show %s as "%s"', (label, value) => {
    renderWithProviders(<SystemBlueprintCard onOpenArchitecture={vi.fn()} />);
    expect(getRowValue(label)).toHaveTextContent(value);
  });

  it('should count hosted sub-apps from the project registry', () => {
    renderWithProviders(<SystemBlueprintCard onOpenArchitecture={vi.fn()} />);
    expect(getRowValue('Sub-Apps Hosted')).toHaveTextContent(`${projects.length} Polyglot Apps`);
  });

  it.each(['React', 'Next.js', 'Vue 3', 'Express'])('should list the %s framework chip', (name) => {
    renderWithProviders(<SystemBlueprintCard onOpenArchitecture={vi.fn()} />);
    expect(within(getRowValue('Sub-Apps Hosted')).getByText(name)).toBeInTheDocument();
  });

  it('should display the quickstart command', () => {
    renderWithProviders(<SystemBlueprintCard onOpenArchitecture={vi.fn()} />);
    expect(screen.getByText(QUICKSTART_COMMAND)).toBeInTheDocument();
  });

  it('should copy the quickstart command and announce success', async () => {
    const { user, writeText } = renderWithClipboard();
    await user.click(screen.getByRole('button', { name: 'Copy install command' }));
    expect(writeText).toHaveBeenCalledWith(QUICKSTART_COMMAND);
    expect(screen.getByRole('status')).toHaveTextContent('Install command copied to clipboard.');
  });

  it('should announce a failure when the clipboard is unavailable', async () => {
    const { user, writeText } = renderWithClipboard();
    writeText.mockRejectedValueOnce(new Error('denied'));
    await user.click(screen.getByRole('button', { name: 'Copy install command' }));
    expect(screen.getByRole('status')).toHaveTextContent(/Copy failed/);
  });
});
