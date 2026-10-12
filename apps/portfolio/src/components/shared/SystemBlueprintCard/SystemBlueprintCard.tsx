import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Check, Copy, ShieldCheck } from 'lucide-react';
import { projects } from '@engineering-portfolio/project-registry';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { careerExperience } from '@/data';

export const QUICKSTART_COMMAND = 'pnpm install && pnpm dev:all';
const COPY_RESET_MS = 2_000;
const HOSTED_FRAMEWORKS = ['React', 'Next.js', 'Vue 3', 'Express'] as const;

const activeClient = careerExperience.find((entry) => entry.isCurrent)?.company;

interface BlueprintRow {
  label: string;
  value: ReactNode;
}

const BLUEPRINT_ROWS: BlueprintRow[] = [
  { label: 'Platform Host', value: 'React 19 + Vite (apps/portfolio)' },
  { label: 'Primary Focus', value: 'Enterprise Design Systems & Real-Time Streaming' },
  ...(activeClient
    ? [{ label: 'Active Client', value: `${activeClient} (Next.js 16 / Turbopack)` }]
    : []),
  {
    label: 'Accessibility',
    value: (
      <span className="inline-flex items-center gap-1.5">
        <ShieldCheck aria-hidden="true" className="size-3.5 text-success" />
        Strict WCAG AAA & Section 508 Verified
      </span>
    ),
  },
  {
    label: 'Sub-Apps Hosted',
    value: (
      <span className="flex flex-col gap-2.5 @md:items-end">
        <span>{projects.length} Polyglot Apps</span>
        <span className="flex flex-wrap gap-2 @md:justify-end">
          {HOSTED_FRAMEWORKS.map((framework) => (
            <Badge key={framework} variant="chip" className="font-mono">
              {framework}
            </Badge>
          ))}
        </span>
      </span>
    ),
  },
];

type CopyStatus = 'idle' | 'copied' | 'failed';

const COPY_ANNOUNCEMENTS: Readonly<Record<CopyStatus, string>> = {
  idle: '',
  copied: 'Install command copied to clipboard.',
  failed: 'Copy failed. Select the command to copy it manually.',
};

export const SystemBlueprintCard = () => {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');
  const resetTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(QUICKSTART_COMMAND);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('failed');
    }
    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setCopyStatus('idle'), COPY_RESET_MS);
  };

  return (
    <section
      aria-labelledby="system-blueprint-title"
      className="@container w-full rounded-xl border border-border bg-card/90 p-6 font-mono lg:p-5 xl:p-6 text-xs shadow-2xl backdrop-blur-md"
    >
      <header className="flex items-center gap-2 border-b border-border pb-4">
        <span aria-hidden="true" className="size-2 rounded-full bg-success" />
        <h2 id="system-blueprint-title" className="font-mono text-xs font-medium text-foreground">
          System Blueprint
          <span className="text-muted-foreground"> · Turborepo Monorepo</span>
        </h2>
      </header>

      <dl className="divide-y divide-border">
        {BLUEPRINT_ROWS.map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col gap-1.5 py-4 @md:flex-row @md:items-start @md:justify-between @md:gap-6"
          >
            <dt className="shrink-0 text-muted-foreground">{label}</dt>
            <dd className="text-foreground @md:text-right">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-border bg-secondary py-2 pl-4 pr-2">
        <code className="min-w-0 truncate text-secondary-foreground">
          <span aria-hidden="true" className="text-brand">
            ${' '}
          </span>
          {QUICKSTART_COMMAND}
        </code>
        <Button
          variant="ghost"
          size="icon-sm"
          className="shrink-0 text-muted-foreground hover:text-foreground"
          onClick={copyCommand}
          aria-label="Copy install command"
        >
          {copyStatus === 'copied' ? (
            <Check aria-hidden="true" className="text-success" />
          ) : (
            <Copy aria-hidden="true" />
          )}
        </Button>
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {COPY_ANNOUNCEMENTS[copyStatus]}
      </p>
    </section>
  );
};
