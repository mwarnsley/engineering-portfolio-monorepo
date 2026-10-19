import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders, screen, within } from '@/test/test-utils';
import { ArchitectureModal } from '@/components/shared/ArchitectureModal';

const Harness = () => {
  const [isOpen, setIsOpen] = useState(true);
  return <ArchitectureModal isOpen={isOpen} onClose={() => setIsOpen(false)} />;
};

describe('ArchitectureModal', () => {
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
