import { useState } from 'react';
import { projects } from '@engineering-portfolio/project-registry';
import { describe, expect, it } from 'vitest';
import { renderWithProviders, screen, waitFor, within } from '@/test/test-utils';
import { TestMatrixModal } from '@/components/shared/TestMatrixModal';
import { Navigation } from '@/components/shared/Navigation';

const Harness = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Navigation theme="dark" toggleTheme={() => {}} onOpenTestMatrix={() => setOpen(true)} />
      <TestMatrixModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
};
const openMatrix = async () => {
  const utils = renderWithProviders(<Harness />);
  const trigger = screen.getByRole('button', { name: 'Open test verification matrix' });
  await utils.user.click(trigger);
  return {
    ...utils,
    trigger,
    dialog: screen.getByRole('dialog', { name: 'Test Verification Matrix' }),
  };
};

describe('TestMatrixModal', () => {
  it('opens from navigation with a dated recorded-run summary', async () => {
    const { dialog } = await openMatrix();
    const evidence = projects.flatMap((project) => (project.testSuite ? [project.testSuite] : []));
    const passed = evidence.reduce((sum, suite) => sum + suite.passedCount, 0);
    const total = evidence.reduce((sum, suite) => sum + suite.testCount, 0);
    expect(within(dialog).getByRole('status')).toHaveTextContent(`${passed}/${total} Passing`);
    expect(within(dialog).getByText(/Recorded run/)).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });
  it('shows measured coverage and actual API suite files', async () => {
    const { dialog } = await openMatrix();
    const evidence = projects.find((project) => project.slug === 'meeting-application')!.testSuite!;
    expect(within(dialog).getAllByText(`${evidence.coverage.statements}%`).length).toBeGreaterThan(
      0
    );
    expect(
      within(dialog).getByText('apps/meeting-application/tests/api/comments-route.test.js')
    ).toBeInTheDocument();
    expect(within(dialog).getAllByText('[API]')).toHaveLength(
      evidence.suites.filter(
        (suite) => suite.file.includes('/tests/api/') && suite.type === 'integration'
      ).length
    );
  });
  it('switches projects without keeping the previous suite list', async () => {
    const { user, dialog } = await openMatrix();
    await user.click(within(dialog).getByRole('button', { name: 'Stock Trader' }));
    expect(
      within(dialog).getByText('apps/stock-trader/tests/unit/stores/portfolio.spec.ts')
    ).toBeInTheDocument();
    expect(
      within(dialog).queryByText('apps/meeting-application/tests/api/comments-route.test.js')
    ).not.toBeInTheDocument();
  });
  it('shows missing evidence instead of zero-test success', async () => {
    const { user, dialog } = await openMatrix();
    await user.click(within(dialog).getByRole('button', { name: 'React MASH' }));
    expect(
      within(dialog).getByText(/No recorded test snapshot for this application/)
    ).toBeInTheDocument();
  });
  it('expands captured Turbo output', async () => {
    const { user, dialog } = await openMatrix();
    const summary = within(dialog).getByText('Turborepo Test Output');
    await user.click(summary);
    expect(summary.parentElement).toHaveAttribute('open');
    expect(within(dialog).getByText(/Tasks:/)).toBeVisible();
  });
  it('traps focus and returns it to the nav trigger on Escape', async () => {
    const { user, trigger, dialog } = await openMatrix();
    const close = within(dialog).getByRole('button', { name: 'Close test verification matrix' });
    await waitFor(() => expect(close).toHaveFocus());
    await user.tab({ shift: true });
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
    await user.keyboard('{Escape}');
    expect(trigger).toHaveFocus();
  });
});
