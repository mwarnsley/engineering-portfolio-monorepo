import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FlaskConical, X } from 'lucide-react';
import {
  projects,
  testMatrixRun,
  type ProjectTestSuite,
} from '@engineering-portfolio/project-registry';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useModalBehavior } from '@/hooks';
import { cn } from '@/lib/utils';
import { summarizeTestSuites } from '@/utils/testMatrix/testMatrix';

interface TestMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const recordedSuites = projects.flatMap((project) =>
  project.testSuite ? [project.testSuite] : []
);
const summary = summarizeTestSuites(recordedSuites);
const coverageLabels = ['statements', 'branches', 'functions', 'lines'] as const;
const suiteLabel = (suite: ProjectTestSuite['suites'][number]) =>
  suite.type === 'integration' && suite.file.includes('/tests/api/')
    ? 'API'
    : suite.type.toUpperCase();

export const TestMatrixModal = ({ isOpen, onClose }: TestMatrixModalProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [selectedSlug, setSelectedSlug] = useState(
    projects.find((project) => project.testSuite)?.slug
  );
  const project = projects.find((entry) => entry.slug === selectedSlug);
  const suite = project?.testSuite;
  useModalBehavior({ isOpen, onClose, containerRef: panelRef, initialFocusRef: closeButtonRef });

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm sm:p-8"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="test-matrix-title"
        aria-describedby="test-matrix-description"
        className="max-h-full w-full max-w-5xl overflow-y-auto rounded-xl border border-border bg-card shadow-2xl"
      >
        <header className="flex items-start justify-between gap-3 border-b border-border p-5 sm:p-6">
          <div className="min-w-0">
            <p className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-brand">
              <FlaskConical aria-hidden="true" className="size-4 shrink-0" /> Quality inspector
            </p>
            <h2 id="test-matrix-title" className="text-2xl font-semibold">
              Test Verification Matrix
            </h2>
            <p
              id="test-matrix-description"
              className="mt-2 text-sm leading-relaxed text-muted-foreground"
            >
              Measured test results and coverage from the repository. This is a recorded snapshot,
              not a live test service.
            </p>
          </div>
          <Button
            ref={closeButtonRef}
            variant="ghost"
            size="icon-lg"
            aria-label="Close test verification matrix"
            onClick={onClose}
          >
            <X aria-hidden="true" />
          </Button>
        </header>
        <div className="space-y-6 p-5 sm:p-6">
          <section aria-label="Recorded test summary" className="space-y-3">
            <p
              role="status"
              aria-live="polite"
              className={cn(
                'inline-flex flex-wrap gap-x-2 rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm',
                summary.success && testMatrixRun.success && summary.skipped === 0
                  ? 'text-success'
                  : 'text-warning'
              )}
            >
              <span>
                {summary.passed}/{summary.total} Passing
              </span>
              <span>• {summary.failed} Failures</span>
              <span>• {summary.skipped} Skipped</span>
            </p>
            {(!summary.success || !testMatrixRun.success) && (
              <p className="text-sm text-warning">
                Run incomplete or failed. Inspect the recorded output for details.
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Recorded run:{' '}
              <time dateTime={testMatrixRun.recentRunDate}>
                {new Date(testMatrixRun.recentRunDate).toLocaleString('en-US', { timeZone: 'UTC' })}{' '}
                UTC
              </time>
              {' · '}
              {recordedSuites.length} of {projects.length} demo applications · {summary.files} suite
              files
            </p>
            <p className="text-sm text-muted-foreground">
              Counts cover the applications with recorded evidence below, not the entire workspace.
            </p>
          </section>

          <div role="group" aria-label="Select test application" className="flex flex-wrap gap-2">
            {projects.map((entry) => (
              <Button
                key={entry.slug}
                variant={entry.slug === selectedSlug ? 'default' : 'outline'}
                aria-pressed={entry.slug === selectedSlug}
                onClick={() => setSelectedSlug(entry.slug)}
              >
                {entry.title}
              </Button>
            ))}
          </div>

          <section aria-label={`${project?.title} test evidence`} className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-lg font-semibold">{project?.title}</h3>
              {suite && (
                <Badge variant="chip">
                  {suite.framework} · {suite.passedCount}/{suite.testCount} passing
                </Badge>
              )}
            </div>
            {suite ? (
              <>
                <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {coverageLabels.map((key) => (
                    <div key={key} className="rounded-lg border border-border bg-background p-3">
                      <dt className="text-xs capitalize text-muted-foreground">{key}</dt>
                      <dd className="mt-2 font-mono text-xl text-foreground">
                        {suite.coverage[key]}%
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="space-y-1 text-xs leading-relaxed text-muted-foreground">
                  <p className="font-medium">Coverage scope</p>
                  {suite.coverageScope.map((scope) => (
                    <p key={scope} className="break-words">
                      {scope}
                    </p>
                  ))}
                </div>
                <div>
                  <h4 className="mb-3 font-medium">Workspace test suites</h4>
                  <ul
                    aria-label={`${project.title} test suites`}
                    className="divide-y divide-border rounded-lg border border-border"
                  >
                    {suite.suites.map((entry) => (
                      <li
                        key={entry.file}
                        className="flex flex-col gap-2 p-3 sm:flex-row sm:items-start"
                      >
                        <Badge variant="outline" className="w-fit shrink-0 font-mono">
                          [{suiteLabel(entry)}]
                        </Badge>
                        <div className="min-w-0">
                          <p className="break-words text-sm text-foreground">{entry.name}</p>
                          <p className="mt-1 break-all font-mono text-xs text-muted-foreground">
                            {entry.file}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    API badges identify integration suites for route handlers. Dedicated E2E:{' '}
                    {suite.suites.filter((entry) => entry.type === 'e2e').length}. Dedicated A11Y:{' '}
                    {suite.suites.filter((entry) => entry.type === 'a11y').length}. Passing unit and
                    integration tests do not establish accessibility conformance.
                  </p>
                </div>
              </>
            ) : (
              <p className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
                No recorded test snapshot for this application. This does not mean it has no tests.
              </p>
            )}
          </section>

          <details className="rounded-lg border border-border bg-background">
            <summary
              tabIndex={0}
              className="cursor-pointer rounded-lg p-4 font-mono text-sm text-foreground"
            >
              Turborepo Test Output
            </summary>
            <div className="space-y-3 border-t border-border p-4">
              <p className="text-xs leading-relaxed text-muted-foreground">
                Captured Turbo summary with diagnostics retained for any failed run or coverage
                collection. ANSI codes and local absolute paths are removed.
              </p>
              <code className="block break-all font-mono text-xs text-brand">
                {testMatrixRun.command}
              </code>
              <pre className="whitespace-pre-wrap break-all font-mono text-xs leading-relaxed text-foreground">
                {testMatrixRun.output}
              </pre>
            </div>
          </details>
        </div>
      </div>
    </div>,
    document.body
  );
};
