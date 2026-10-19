import { useState } from 'react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { useReducedMotion } from 'framer-motion';
import { fireEvent, renderWithProviders, screen, within, waitFor } from '@/test/test-utils';
import { ArchitectureModal } from '@/components/shared/ArchitectureModal';

vi.mock('framer-motion', async (importOriginal) => ({
  ...(await importOriginal<typeof import('framer-motion')>()),
  useReducedMotion: vi.fn(() => false),
}));
afterEach(() => vi.mocked(useReducedMotion).mockReturnValue(false));

const Harness = () => {
  const [isOpen, setIsOpen] = useState(true);
  return <ArchitectureModal isOpen={isOpen} onClose={() => setIsOpen(false)} />;
};

describe('ArchitectureModal', () => {
  it('traps focus and makes the exiting dialog inert while restoring the trigger', async () => {
    const Trigger = () => {
      const [isOpen, setIsOpen] = useState(false);
      return (
        <>
          <button onClick={() => setIsOpen(true)}>Architecture</button>
          <ArchitectureModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
      );
    };
    const { user } = renderWithProviders(<Trigger />);
    const trigger = screen.getByRole('button', { name: 'Architecture' });
    await user.click(trigger);
    const dialog = screen.getByRole('dialog');
    const close = screen.getByRole('button', { name: 'Close architecture blueprint' });
    await waitFor(() => expect(close).toHaveFocus());
    await user.tab({ shift: true });
    expect(screen.getByRole('link', { name: 'Preview Meeting Application' })).toHaveFocus();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(dialog.parentElement).toHaveAttribute('inert');
    expect(trigger).toHaveFocus();
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
  });

  it('opens without scale or opacity animation when reduced motion is requested', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    renderWithProviders(<Harness />);
    expect(screen.getByRole('dialog')).toHaveStyle({ opacity: '1', transform: 'none' });
  });

  it('dismisses on the backdrop but keeps content clicks inside the dialog', async () => {
    const { user } = renderWithProviders(<Harness />);
    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('heading', { name: 'Workspace dependencies' }));
    expect(dialog).toBeInTheDocument();
    await user.click(dialog.parentElement!);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('inspects a sandbox without requiring architecture metadata', async () => {
    const { user } = renderWithProviders(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Restaurant Finder' }));
    const inspector = within(
      screen.getByRole('region', { name: 'Restaurant Finder architecture' })
    );
    expect(inspector.getByText('Geoapify API key (GEOAPIFY_API_KEY)')).toBeInTheDocument();
    expect(inspector.getByRole('link', { name: 'Preview Restaurant Finder' })).toHaveAttribute(
      'href',
      '/demo/restaurant-finder'
    );
    expect(screen.getByRole('status')).toHaveTextContent('Inspecting Restaurant Finder.');
  });

  it('dismisses when launching the selected demo', async () => {
    const { user } = renderWithProviders(<Harness />);
    await user.click(screen.getByRole('link', { name: 'Preview Meeting Application' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe('');
  });
});
