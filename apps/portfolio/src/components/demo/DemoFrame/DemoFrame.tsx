import type { ProjectRecord } from '@engineering-portfolio/project-registry';
import { useIframeStatus } from '@/hooks/useIframeStatus';
import { cn } from '@/lib/utils';
import type { DemoFrameStatus } from '@/utils/demoFrame';
import { DemoStatusBanner } from '../DemoStatusBanner';
import { VIEWPORT_PRESETS, type DemoViewport } from '../ViewportToggle';

export interface DemoFrameProps {
  /** Registry record for the embedded demo. */
  project: Pick<ProjectRecord, 'slug' | 'title' | 'appPath' | 'runtimeRequirements' | 'hasBackend'>;
  /** Absolute URL loaded in the iframe. */
  demoUrl: string;
  /** Whether the shell runs on a local dev host. Switches fallback copy to local troubleshooting. */
  isLocalDev: boolean;
  /**
   * Preview width preset.
   * @default 'desktop'
   */
  viewport?: DemoViewport;
}

const STATUS_ANNOUNCEMENTS: Readonly<Record<DemoFrameStatus, string>> = {
  loading: 'Loading demo preview.',
  slow: 'The demo is still loading.',
  ready: 'Demo preview loaded.',
  error: 'The demo preview could not be displayed.',
};

const DemoSkeleton = ({ isSlow, hasBackend }: { isSlow: boolean; hasBackend: boolean }) => (
  <div aria-hidden="true" className="absolute inset-0 flex flex-col gap-4 bg-background p-6">
    <div className="h-8 w-1/3 animate-pulse rounded-md bg-muted" />
    <div className="h-4 w-2/3 animate-pulse rounded-md bg-muted" />
    <div className="grid flex-1 grid-cols-3 gap-4">
      <div className="animate-pulse rounded-lg bg-muted" />
      <div className="col-span-2 animate-pulse rounded-lg bg-muted" />
    </div>
    {isSlow && (
      <p className="text-center text-sm text-muted-foreground">
        {hasBackend
          ? 'Waking up the server. Cold starts can take several seconds.'
          : 'Still loading…'}
      </p>
    )}
  </div>
);

export const DemoFrame = ({
  project,
  demoUrl,
  isLocalDev,
  viewport = 'desktop',
}: DemoFrameProps) => {
  const { status, reason, handleLoad, retry, frameKey } = useIframeStatus(demoUrl);
  const isPending = status === 'loading' || status === 'slow';

  return (
    <div className="flex justify-center rounded-xl border border-border bg-muted p-2 sm:p-4">
      <div
        aria-busy={isPending}
        className={cn(
          'relative h-[70vh] min-h-96 w-full overflow-hidden rounded-lg border border-border bg-background transition-[max-width] duration-300',
          VIEWPORT_PRESETS[viewport].frameClassName
        )}
      >
        {reason !== 'mixed-content' && (
          <iframe
            key={frameKey}
            src={demoUrl}
            title={`${project.title} live demo`}
            onLoad={handleLoad}
            className={cn('size-full bg-white', status !== 'ready' && 'invisible')}
          />
        )}

        {isPending && <DemoSkeleton isSlow={status === 'slow'} hasBackend={project.hasBackend} />}

        {status === 'error' && reason && (
          <div className="absolute inset-0 flex items-center justify-center overflow-y-auto bg-background/95 p-4">
            <DemoStatusBanner
              reason={reason}
              project={project}
              demoUrl={demoUrl}
              isLocalDev={isLocalDev}
              onRetry={retry}
            />
          </div>
        )}
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {STATUS_ANNOUNCEMENTS[status]}
      </p>
    </div>
  );
};
