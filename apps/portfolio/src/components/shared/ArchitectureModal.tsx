import { AnimatePresence, motion, useIsPresent } from 'framer-motion';
import { useMotionPreference } from '@/hooks/useMotionPreference/useMotionPreference';
import { revealEase } from '@/components/shared/MotionReveal';
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects } from '@engineering-portfolio/project-registry';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { useModalBehavior } from '@/hooks';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const flagshipCount = projects.filter((project) => project.tier === 'flagship').length;
const sandboxCount = projects.filter((project) => project.tier === 'sandbox').length;

const workspaceDiagram = [
  'ROOT WORKSPACE',
  'turbo.json + pnpm-workspace.yaml',
  '  | task orchestration + workspace dependencies',
  '  +-- packages/project-registry',
  '  |     | typed metadata, tiers, demo contracts',
  '  |     v',
  '  +-- apps/portfolio',
  '  |     | shell-owned theme tokens + demo routing',
  '  |     | iframe boundary (independent runtimes)',
  '  |     v',
  '  +-- POLYGLOT DEMO APPS',
  ...projects.map((project) => `        +-- ${project.appPath}`),
].join('\n');

export const ArchitectureModal = ({ isOpen, onClose }: ArchitectureModalProps) =>
  createPortal(
    <AnimatePresence>
      {isOpen && <ArchitectureDialog key="architecture" onClose={onClose} />}
    </AnimatePresence>,
    document.body
  );

const ArchitectureDialog = ({ onClose }: Pick<ArchitectureModalProps, 'onClose'>) => {
  const isPresent = useIsPresent();
  const reducedMotion = useMotionPreference();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [selectedSlug, setSelectedSlug] = useState(
    projects.find((project) => project.tier === 'flagship')?.slug
  );
  const selectedProject = projects.find((project) => project.slug === selectedSlug);

  useModalBehavior({
    isOpen: isPresent,
    onClose,
    containerRef: panelRef,
    initialFocusRef: closeButtonRef,
  });

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: reducedMotion ? 1 : 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.15 }}
      aria-hidden={!isPresent || undefined}
      inert={!isPresent}
      style={{ pointerEvents: isPresent ? undefined : 'none' }}
      className="fixed inset-0 z-100 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm sm:p-8"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
        transition={{ duration: reducedMotion ? 0 : 0.18, ease: revealEase }}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="architecture-title"
        aria-describedby="architecture-description"
        className="max-h-full w-full max-w-5xl overflow-y-auto rounded-xl border border-border bg-card shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-border p-6">
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-brand">
              Workspace architecture
            </p>
            <h2 id="architecture-title" className="text-2xl font-semibold text-foreground">
              Monorepo Architecture Blueprint
            </h2>
            <p
              id="architecture-description"
              className="mt-2 text-sm leading-relaxed text-muted-foreground"
            >
              One typed showcase registry. Independent application runtimes. Select an application
              to inspect its boundaries.
            </p>
          </div>
          <Button
            ref={closeButtonRef}
            variant="ghost"
            size="icon-lg"
            onClick={onClose}
            aria-label="Close architecture blueprint"
          >
            <X aria-hidden="true" />
          </Button>
        </header>

        <div className="space-y-8 p-6">
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 sm:text-center">
            {[
              [projects.length, 'Demo applications'],
              [flagshipCount, 'Flagship systems'],
              [sandboxCount, 'Sandboxes'],
            ].map(([count, label]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 sm:block"
              >
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="text-2xl font-semibold text-foreground sm:mt-2">{count}</dd>
              </div>
            ))}
          </dl>

          <section aria-labelledby="workspace-dependencies">
            <h3 id="workspace-dependencies" className="mb-3 text-lg font-semibold">
              Workspace dependencies
            </h3>
            <figure className="rounded-lg border border-border bg-background p-4">
              <pre
                role="img"
                aria-label="Workspace dependency diagram"
                aria-describedby="dependency-caption"
                tabIndex={0}
                className="overflow-x-auto font-mono text-xs leading-relaxed text-foreground"
              >
                {workspaceDiagram}
              </pre>
              <figcaption
                id="dependency-caption"
                className="mt-4 text-sm leading-relaxed text-muted-foreground"
              >
                Turborepo orchestrates workspace tasks. The registry supplies metadata and demo
                contracts to the portfolio shell. The shell owns its theme tokens and embeds
                independently deployed React, Next.js, and Vue apps through iframes; demo apps
                retain their own styling and do not import the registry.
              </figcaption>
            </figure>
          </section>

          <section aria-labelledby="application-inspector">
            <h3 id="application-inspector" className="mb-3 text-lg font-semibold">
              Inspect an application
            </h3>
            <div
              role="group"
              aria-label="Select an application"
              className="mb-4 flex flex-wrap gap-2"
            >
              {projects.map((project) => (
                <Button
                  key={project.slug}
                  variant={selectedSlug === project.slug ? 'default' : 'outline'}
                  aria-pressed={selectedSlug === project.slug}
                  onClick={() => setSelectedSlug(project.slug)}
                >
                  {project.title}
                </Button>
              ))}
            </div>
            {selectedProject && (
              <section
                aria-label={`${selectedProject.title} architecture`}
                className="rounded-lg border border-border bg-background p-5"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <h4 className="font-semibold text-foreground">{selectedProject.title}</h4>
                  <Badge variant="chip">
                    {selectedProject.tier === 'flagship'
                      ? 'Flagship system'
                      : 'Sandbox / prototype'}
                  </Badge>
                </div>
                <p className="mt-2 font-mono text-xs text-muted-foreground">
                  {selectedProject.appPath} · {selectedProject.framework}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {selectedProject.description}
                </p>
                {selectedProject.architectureHighlights && (
                  <ul className="mt-4 list-disc space-y-2 pl-4 text-sm text-muted-foreground">
                    {selectedProject.architectureHighlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                )}
                <h5 className="mb-2 mt-5 text-sm font-medium">Runtime requirements</h5>
                <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                  {selectedProject.runtimeRequirements.map((requirement) => (
                    <li key={requirement}>{requirement}</li>
                  ))}
                </ul>
                <Link
                  to={`/demo/${selectedProject.slug}`}
                  onClick={onClose}
                  className={buttonVariants({
                    variant: 'outline',
                    size: 'lg',
                    className: 'mt-5 h-auto max-w-full whitespace-normal py-2',
                  })}
                >
                  Preview {selectedProject.title}
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              </section>
            )}
            <p role="status" aria-live="polite" className="sr-only">
              Inspecting {selectedProject?.title}.
            </p>
          </section>

          <section aria-labelledby="workspace-quality">
            <h3 id="workspace-quality" className="mb-3 text-lg font-semibold">
              Build & quality strategy
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-border p-4">
                <h4 className="font-medium">Turborepo caching</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Local task caching with dependency-aware execution and declared build outputs.
                  Remote caching is a next step; no remote-cache configuration is checked into this
                  repository.
                </p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <h4 className="font-medium">TypeScript & ESLint</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Typed registry contracts and package-owned checks run through Turbo. A shared
                  strict TypeScript configuration and shared ESLint policy are not yet configured.
                </p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <h4 className="font-medium">Accessibility verification</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  WCAG AAA and Section 508 are design targets. Vitest and Testing Library cover
                  keyboard, focus, and accessible state behavior. An automated accessibility audit
                  pipeline is not yet configured; full conformance also requires manual evaluation.
                </p>
              </div>
            </div>
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
};
