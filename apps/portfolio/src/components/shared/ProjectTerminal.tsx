import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { featuredProjects, type ProjectRecord } from '@engineering-portfolio/project-registry';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SectionHeader } from './SectionHeader';

const ALL_CATEGORIES = 'All';

const projectsByCategory = featuredProjects.reduce<Map<string, ProjectRecord[]>>(
  (index, project) => {
    index.get(ALL_CATEGORIES)!.push(project);
    const bucket = index.get(project.category);
    if (bucket) bucket.push(project);
    else index.set(project.category, [project]);
    return index;
  },
  new Map([[ALL_CATEGORIES, []]])
);

const categories = Array.from(projectsByCategory.keys());

export const ProjectTerminal = () => {
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);
  const visibleProjects = projectsByCategory.get(activeCategory) ?? [];

  return (
    <section id="projects" aria-labelledby="projects-heading">
      <SectionHeader
        eyebrow="Projects"
        title="Featured Applications & Sandboxes"
        subtitle="Production-style apps across React, Vue, and Next.js. Each one runs live inside the portfolio shell."
        headingId="projects-heading"
      />

      <div
        role="group"
        aria-label="Filter projects by category"
        className="mb-8 flex flex-wrap gap-2"
      >
        {categories.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveCategory(category)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm transition-colors',
                isActive
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground'
              )}
            >
              {category}
            </button>
          );
        })}
      </div>

      <motion.ul layout className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {visibleProjects.map((project) => (
            <motion.li
              key={project.slug}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="surface-card surface-card-interactive group flex flex-col p-6"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-mono text-xs text-muted-foreground">{project.framework}</p>
                  <h3 className="text-xl font-semibold text-foreground">{project.title}</h3>
                </div>
                {project.hasBackend && (
                  <Badge variant="outline" className="text-muted-foreground">
                    Full stack
                  </Badge>
                )}
              </div>

              <p className="mb-5 leading-relaxed text-muted-foreground">{project.description}</p>

              <ul
                aria-label={`${project.title} technologies`}
                className="mb-6 flex flex-wrap gap-2"
              >
                {project.tags.map((tag) => (
                  <li key={tag}>
                    <Badge variant="chip">{tag}</Badge>
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-wrap gap-2">
                <Link
                  to={`/demo/${project.slug}`}
                  className={cn(buttonVariants({ size: 'lg' }), 'px-4')}
                >
                  Preview Demo
                  <span className="sr-only"> of {project.title}</span>
                  <ArrowUpRight aria-hidden="true" />
                </Link>
                <a
                  href={project.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'px-4')}
                >
                  <Github aria-hidden="true" />
                  View Source
                  <span className="sr-only"> for {project.title} (opens in a new tab)</span>
                </a>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </section>
  );
};
