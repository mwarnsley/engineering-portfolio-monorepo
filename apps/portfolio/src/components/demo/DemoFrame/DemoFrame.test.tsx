import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, renderWithProviders, screen } from '@/test';
import { DEMO_SLOW_AFTER_MS, DEMO_TIMEOUT_MS } from '@/hooks/useIframeStatus';
import { DemoFrame, type DemoFrameProps } from './DemoFrame';

const project: DemoFrameProps['project'] = {
  slug: 'movies',
  title: 'Movies',
  appPath: 'apps/movies',
  runtimeRequirements: ['TMDB API key'],
  hasBackend: false,
};

const DEMO_URL = 'https://movies.example.com';

const renderFrame = (overrides: Partial<DemoFrameProps> = {}) =>
  renderWithProviders(
    <DemoFrame project={project} demoUrl={DEMO_URL} isLocalDev={false} {...overrides} />
  );

const getFrame = () => screen.getByTitle('Movies live demo');

describe('DemoFrame', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise<Response>(() => {}))
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('should render the iframe with the demo URL', () => {
    renderFrame();
    expect(getFrame()).toHaveAttribute('src', DEMO_URL);
  });

  it('should mark the preview busy and announce loading initially', () => {
    renderFrame();
    expect(screen.getByRole('status')).toHaveTextContent('Loading demo preview.');
    expect(getFrame().parentElement).toHaveAttribute('aria-busy', 'true');
  });

  it('should announce when the demo has loaded', () => {
    renderFrame();
    fireEvent.load(getFrame());
    expect(screen.getByRole('status')).toHaveTextContent('Demo preview loaded.');
  });

  it('should show a still-loading notice after the slow threshold', () => {
    renderFrame();
    act(() => vi.advanceTimersByTime(DEMO_SLOW_AFTER_MS));
    expect(screen.getByText('Still loading…')).toBeInTheDocument();
  });

  it('should show the fallback banner after the timeout', () => {
    renderFrame();
    act(() => vi.advanceTimersByTime(DEMO_TIMEOUT_MS));
    expect(screen.getByRole('alert')).toHaveTextContent('Demo is still starting');
  });

  it('should recover from a timeout if the iframe eventually loads', () => {
    renderFrame();
    act(() => vi.advanceTimersByTime(DEMO_TIMEOUT_MS));
    fireEvent.load(getFrame());
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it.each([
    ['desktop', 'max-w-full'],
    ['tablet', 'max-w-3xl'],
    ['mobile', 'max-w-sm'],
  ] as const)('should constrain the %s viewport with %s', (viewport, className) => {
    renderFrame({ viewport });
    expect(getFrame().parentElement).toHaveClass(className);
  });
});
