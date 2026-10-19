import { describe, expect, it } from 'vitest';
import { renderWithProviders, screen, waitFor, within } from '@/test/test-utils';
import Portfolio from '@/Portfolio';

const openBlueprint = async (trigger = 'Explore Architecture') => {
  const utils = renderWithProviders(<Portfolio />);
  const opener = screen.getByRole('button', { name: trigger });
  await utils.user.click(opener);
  const dialog = await screen.findByRole('dialog', { name: 'Monorepo Architecture Blueprint' });
  return { ...utils, opener, dialog };
};

describe('Portfolio architecture blueprint', () => {
  it.each(['Explore Architecture', 'Open architecture blueprint'])(
    'opens from %s',
    async (trigger) => {
      const { dialog } = await openBlueprint(trigger);
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(
        within(dialog).getByRole('img', { name: 'Workspace dependency diagram' })
      ).toBeInTheDocument();
    }
  );

  it('closes with Escape and restores focus to the opener', async () => {
    const { user, opener } = await openBlueprint();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
    expect(document.body.style.overflow).toBe('');
  });

  it('closes with the close button', async () => {
    const { user } = await openBlueprint();
    await user.click(screen.getByRole('button', { name: 'Close architecture blueprint' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('focuses the close button and traps keyboard focus', async () => {
    const { user, dialog } = await openBlueprint();
    const close = within(dialog).getByRole('button', { name: 'Close architecture blueprint' });
    await waitFor(() => expect(close).toHaveFocus());
    await user.tab({ shift: true });
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
    await user.tab();
    expect(close).toHaveFocus();
  });

  it('inspects another application without closing the modal', async () => {
    const { user, dialog } = await openBlueprint();
    await user.click(within(dialog).getByRole('button', { name: 'Stock Trader' }));
    expect(within(dialog).getByRole('button', { name: 'Stock Trader' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(
      within(dialog).getByRole('region', { name: 'Stock Trader architecture' })
    ).toHaveTextContent('Pinia');
  });
});
