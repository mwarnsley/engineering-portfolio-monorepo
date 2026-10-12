import { AlertTriangle, ExternalLink, RotateCw } from 'lucide-react';
import type { ProjectRecord } from '@engineering-portfolio/project-registry';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { DemoFrameErrorReason } from '@/utils/demoFrame';

export interface DemoStatusBannerProps {
  /** Why the embedded demo failed. Determines the explanation copy. */
  reason: DemoFrameErrorReason;
  /** Registry record for the demo. Supplies the app path and runtime requirements. */
  project: Pick<ProjectRecord, 'title' | 'appPath' | 'runtimeRequirements' | 'hasBackend'>;
  /** The URL the iframe attempted to load. Used for the "Launch in New Tab" link. */
  demoUrl: string;
  /** Whether the shell is running on a local dev host. Switches to local troubleshooting copy. */
  isLocalDev: boolean;
  /** Retries the embed. The retry action is hidden for mixed content, where retrying cannot help. */
  onRetry: () => void;
}

const getExplanation = (
  reason: DemoFrameErrorReason,
  { appPath, hasBackend }: DemoStatusBannerProps['project'],
  demoUrl: string,
  isLocalDev: boolean
) => {
  switch (reason) {
    case 'mixed-content':
      return 'Your browser blocked this embed because this page is served over HTTPS and the demo over HTTP. Open it in a new tab to view it directly.';
    case 'unreachable':
      return isLocalDev
        ? `No dev server is responding at ${demoUrl}. Start it with "pnpm --filter ./${appPath} dev", then try again.`
        : 'The demo server could not be reached. It may be offline or mid-deployment.';
    case 'timeout':
      return hasBackend
        ? 'The demo is taking longer than expected. Its backend may be cold-starting or waiting on a database connection.'
        : 'The demo is taking longer than expected to respond.';
  }
};

const TITLES: Readonly<Record<DemoFrameErrorReason, string>> = {
  'mixed-content': 'Embed blocked by the browser',
  unreachable: 'Demo server unavailable',
  timeout: 'Demo is still starting',
};

export const DemoStatusBanner = ({
  reason,
  project,
  demoUrl,
  isLocalDev,
  onRetry,
}: DemoStatusBannerProps) => (
  <div
    role="alert"
    className="w-full max-w-xl space-y-5 rounded-xl border border-border bg-card p-6 text-left shadow-lg"
  >
    <div className="flex items-start gap-3">
      <AlertTriangle aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-warning" />
      <div className="space-y-2">
        <h2 className="text-base font-semibold text-foreground">{TITLES[reason]}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {getExplanation(reason, project, demoUrl, isLocalDev)}
        </p>
      </div>
    </div>

    <div className="space-y-2 border-t border-border pt-4">
      <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Runtime requirements
      </h3>
      <ul className="list-disc space-y-1 pl-5 text-sm text-foreground marker:text-muted-foreground">
        {project.runtimeRequirements.map((requirement) => (
          <li key={requirement}>{requirement}</li>
        ))}
      </ul>
    </div>

    <div className="flex flex-wrap gap-2">
      <a
        href={demoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(buttonVariants({ size: 'lg' }), 'px-4')}
      >
        <ExternalLink aria-hidden="true" />
        Launch in New Tab
        <span className="sr-only"> (opens {project.title} in a new tab)</span>
      </a>
      {reason !== 'mixed-content' && (
        <Button variant="outline" size="lg" className="px-4" onClick={onRetry}>
          <RotateCw aria-hidden="true" />
          Try again
        </Button>
      )}
    </div>
  </div>
);
