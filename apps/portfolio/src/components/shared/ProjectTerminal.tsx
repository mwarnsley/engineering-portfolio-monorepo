import { useRef, useState, type ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useMotionPreference } from '@/hooks/useMotionPreference/useMotionPreference';
import { revealEase } from '@/components/shared/MotionReveal';
import { ArrowUpRight, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { featuredProjects, type ProjectRecord } from '@engineering-portfolio/project-registry';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SectionHeader } from '@/components/shared/SectionHeader';

const ALL_CATEGORIES = 'All';
const categories = [
  ALL_CATEGORIES,
  ...new Set(featuredProjects.map((project) => project.category)),
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: revealEase } },
};

const ProjectGrid = ({
  children,
  className,
  filtered,
}: {
  children: ReactNode;
  className: string;
  filtered: boolean;
}) => {
  const reducedMotion = useMotionPreference();
  const startedReduced = useRef(reducedMotion).current;
  if (startedReduced) return <ul className={className}>{children}</ul>;
  return (
    <motion.ul
      className={className}
      variants={containerVariants}
      initial={filtered ? false : 'hidden'}
      animate={reducedMotion ? { opacity: 1 } : filtered ? 'visible' : undefined}
      transition={reducedMotion ? { duration: 0 } : undefined}
      whileInView={reducedMotion ? undefined : 'visible'}
      viewport={{ once: true, margin: '-30px' }}
    >
      {children}
    </motion.ul>
  );
};

const ProjectCard = ({ project, filtered }: { project: ProjectRecord; filtered: boolean }) => {
  const reducedMotion = useMotionPreference();
  const startedReduced = useRef(reducedMotion).current;
  const Card = startedReduced ? 'li' : motion.li;
  const isFlagship = project.tier === 'flagship';

  return (
    <Card
      {...(startedReduced
        ? {}
        : {
            variants: cardVariants,
            initial: filtered ? false : undefined,
            animate: reducedMotion ? { opacity: 1, y: 0 } : undefined,
            transition: reducedMotion ? { duration: 0 } : undefined,
          })}
      className={cn(
        'surface-card surface-card-interactive flex flex-col',
        isFlagship ? 'p-6' : 'p-5'
      )}
    >
      <div className="mb-4 space-y-2">
        <p className="font-mono text-xs text-muted-foreground">{project.framework}</p>
        <h3 className={cn('font-semibold text-foreground', isFlagship ? 'text-xl' : 'text-lg')}>
          {project.title}
        </h3>
        {project.hasBackend && <Badge variant="outline">Full stack</Badge>}
      </div>
      <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{project.description}</p>
      <ul aria-label={`${project.title} technologies`} className="mb-6 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <li key={tag}>
            <Badge variant="chip">{tag}</Badge>
          </li>
        ))}
      </ul>

      {isFlagship && (
        <div className="mb-6 space-y-5 border-t border-border pt-5 text-sm">
          <div>
            <h4 className="mb-2 font-medium text-foreground">Architecture</h4>
            <ul className="list-disc space-y-2 pl-4 leading-relaxed text-muted-foreground marker:text-brand">
              {project.architectureHighlights?.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-medium text-foreground">Challenges solved</h4>
            <ul className="list-disc space-y-2 pl-4 leading-relaxed text-muted-foreground marker:text-brand">
              {project.challengesSolved?.map((challenge) => (
                <li key={challenge}>{challenge}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="mt-auto flex flex-wrap gap-2">
        <Link to={`/demo/${project.slug}`} className={cn(buttonVariants({ size: 'lg' }), 'px-3')}>
          Preview Demo<span className="sr-only"> of {project.title}</span>
          <ArrowUpRight aria-hidden="true" />
        </Link>
        <a
          href={project.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'px-3')}
        >
          <Github aria-hidden="true" />
          View Source<span className="sr-only"> for {project.title} (opens in a new tab)</span>
        </a>
      </div>
    </Card>
  );
};

export const ProjectTerminal = () => {
  const [hasFiltered, setHasFiltered] = useState(false);
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);
  const visibleProjects = featuredProjects.filter(
    (project) => activeCategory === ALL_CATEGORIES || project.category === activeCategory
  );
  const flagships = visibleProjects.filter((project) => project.tier === 'flagship');
  const sandboxes = visibleProjects.filter((project) => project.tier === 'sandbox');

  return (
    <div id="projects" className="space-y-12">
      <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            aria-pressed={activeCategory === category}
            onClick={() => {
              setHasFiltered(true);
              setActiveCategory(category);
            }}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm transition-colors',
              activeCategory === category
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border text-muted-foreground hover:border-brand hover:text-foreground'
            )}
          >
            {category}
          </button>
        ))}
      </div>
      <p role="status" aria-live="polite" className="sr-only">
        {flagships.length} flagship systems and {sandboxes.length} sandboxes shown.
      </p>
      <section aria-labelledby="projects-heading">
        <SectionHeader
          eyebrow="Flagship systems"
          title="Featured Architecture Systems"
          subtitle="Explore the data flows, state boundaries, and engineering decisions behind three complete application systems."
          headingId="projects-heading"
        />
        {flagships.length ? (
          <ProjectGrid filtered={hasFiltered} className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            {flagships.map((project) => (
              <ProjectCard key={project.slug} project={project} filtered={hasFiltered} />
            ))}
          </ProjectGrid>
        ) : (
          <p className="text-muted-foreground">
            No flagship systems in this category. Choose All to see every system.
          </p>
        )}
      </section>
      <section aria-labelledby="sandboxes-heading" className="border-t border-border pt-12">
        <SectionHeader
          eyebrow="Sandboxes & prototypes"
          title="Interactive Sandboxes & Experiments"
          subtitle="Focused explorations of interaction, discovery, and API integration. Open any demo to try it."
          headingId="sandboxes-heading"
        />
        {sandboxes.length ? (
          <ProjectGrid
            filtered={hasFiltered}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
          >
            {sandboxes.map((project) => (
              <ProjectCard key={project.slug} project={project} filtered={hasFiltered} />
            ))}
          </ProjectGrid>
        ) : (
          <p className="text-muted-foreground">
            No sandboxes in this category. Choose All to see every experiment.
          </p>
        )}
      </section>
    </div>
  );
};
