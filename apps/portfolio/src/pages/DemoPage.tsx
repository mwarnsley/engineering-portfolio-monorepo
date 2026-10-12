import { useState } from 'react';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { getProjectBySlug } from '@engineering-portfolio/project-registry';
import { DemoFrame, ViewportToggle, type DemoViewport } from '@/components/demo';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { isLocalHostname, resolveDemoUrl } from '@/utils/demoFrame';

const BACK_TO_PROJECTS_HREF = '/#projects';
const actionClassName = cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'px-4');

export const DemoPage = () => {
  const { slug = '' } = useParams();
  const [viewport, setViewport] = useState<DemoViewport>('desktop');
  const project = getProjectBySlug(slug);

  if (!project) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-8">
        <SectionHeader
          as="h1"
          eyebrow="404"
          title="Demo not found"
          subtitle={`No project in the registry uses the slug "${slug}".`}
        />
        <a href={BACK_TO_PROJECTS_HREF} className={actionClassName}>
          <ArrowLeft aria-hidden="true" />
          Back to projects
        </a>
      </div>
    );
  }

  const isLocalDev = isLocalHostname(window.location.hostname);
  const demoUrl = resolveDemoUrl(project, window.location.hostname);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-8">
      <a
        href={BACK_TO_PROJECTS_HREF}
        className="inline-flex items-center gap-2 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        All projects
      </a>

      <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <SectionHeader
            as="h1"
            eyebrow={project.framework}
            title={project.title}
            subtitle={project.description}
            spacing="none"
          />
          <ul aria-label="Technologies" className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li key={tag}>
                <Badge variant="chip">{tag}</Badge>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-2">
          <a href={demoUrl} target="_blank" rel="noopener noreferrer" className={actionClassName}>
            <ExternalLink aria-hidden="true" />
            Launch in New Tab
            <span className="sr-only"> (opens {project.title} in a new tab)</span>
          </a>
          <a
            href={project.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={actionClassName}
          >
            <Github aria-hidden="true" />
            View Source
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </header>

      <section aria-label={`${project.title} live preview`} className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ViewportToggle value={viewport} onChange={setViewport} />
          <p className="font-mono text-xs text-muted-foreground">{demoUrl}</p>
        </div>
        <DemoFrame
          key={project.slug}
          project={project}
          demoUrl={demoUrl}
          isLocalDev={isLocalDev}
          viewport={viewport}
        />
        <p className="text-sm text-muted-foreground">
          {isLocalDev
            ? `Running locally. Start the demo from ${project.appPath} if the preview does not load.`
            : 'The demo runs inside an embedded preview. Scroll inside the frame to explore it.'}
        </p>
      </section>
    </div>
  );
};
