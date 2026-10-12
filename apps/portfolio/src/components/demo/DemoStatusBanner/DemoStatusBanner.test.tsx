import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders, screen } from '@/test';
import type { DemoFrameErrorReason } from '@/utils/demoFrame';
import { DemoStatusBanner, type DemoStatusBannerProps } from './DemoStatusBanner';

const project: DemoStatusBannerProps['project'] = {
  title: 'Meeting Application',
  appPath: 'apps/meeting-application',
  runtimeRequirements: ['Next.js server runtime', 'MongoDB connection'],
  hasBackend: true,
};

const DEMO_URL = 'https://meeting.example.com';

const renderBanner = (overrides: Partial<DemoStatusBannerProps> = {}) =>
  renderWithProviders(
    <DemoStatusBanner
      reason="unreachable"
      project={project}
      demoUrl={DEMO_URL}
      isLocalDev={false}
      onRetry={vi.fn()}
      {...overrides}
    />
  );

describe('DemoStatusBanner', () => {
  it('should render as an alert', () => {
    renderBanner();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it.each<[DemoFrameErrorReason, string]>([
    ['mixed-content', 'Embed blocked by the browser'],
    ['unreachable', 'Demo server unavailable'],
    ['timeout', 'Demo is still starting'],
  ])('should title the %s state', (reason, title) => {
    renderBanner({ reason });
    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
  });

  it('should link to the demo in a new tab', () => {
    renderBanner();
    const link = screen.getByRole('link', { name: /launch in new tab/i });
    expect(link).toHaveAttribute('href', DEMO_URL);
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('should list every runtime requirement', () => {
    renderBanner();
    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual(
      project.runtimeRequirements
    );
  });

  it('should show the local start command when running locally', () => {
    renderBanner({ isLocalDev: true });
    expect(screen.getByText(/pnpm --filter \.\/apps\/meeting-application dev/)).toBeInTheDocument();
  });

  it('should mention a cold start for backend timeouts', () => {
    renderBanner({ reason: 'timeout' });
    expect(screen.getByText(/cold-starting/)).toBeInTheDocument();
  });

  it('should call onRetry when Try again is pressed', async () => {
    const onRetry = vi.fn();
    const { user } = renderBanner({ onRetry });
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('should hide Try again for mixed content', () => {
    renderBanner({ reason: 'mixed-content' });
    expect(screen.queryByRole('button', { name: 'Try again' })).not.toBeInTheDocument();
  });
});
