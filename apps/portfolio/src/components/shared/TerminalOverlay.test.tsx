import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders, screen } from '@/test';
import { TerminalOverlay } from './TerminalOverlay';

const renderOpen = (onClose = vi.fn()) =>
  renderWithProviders(<TerminalOverlay isOpen onClose={onClose} />);

describe('TerminalOverlay', () => {
  it('should render nothing when closed', () => {
    renderWithProviders(<TerminalOverlay isOpen={false} onClose={vi.fn()} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render a labelled modal dialog when open', () => {
    renderOpen();
    const dialog = screen.getByRole('dialog', { name: 'portfolio-cli' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('should focus the command input on open', async () => {
    renderOpen();
    expect(await screen.findByRole('textbox', { name: 'Command' })).toHaveFocus();
  });

  it('should print command output to the log', async () => {
    const { user } = renderOpen();
    await user.type(screen.getByRole('textbox', { name: 'Command' }), 'whoami{Enter}');
    expect(screen.getByRole('log')).toHaveTextContent('10+ years');
  });

  it('should clear the log on "clear"', async () => {
    const { user } = renderOpen();
    const input = screen.getByRole('textbox', { name: 'Command' });
    await user.type(input, 'help{Enter}');
    await user.type(input, 'clear{Enter}');
    expect(screen.getByRole('log')).toBeEmptyDOMElement();
  });

  it('should close on Escape', async () => {
    const onClose = vi.fn();
    const { user } = renderOpen(onClose);
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should close from the labelled close button', async () => {
    const onClose = vi.fn();
    const { user } = renderOpen(onClose);
    await user.click(screen.getByRole('button', { name: 'Close CLI' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
