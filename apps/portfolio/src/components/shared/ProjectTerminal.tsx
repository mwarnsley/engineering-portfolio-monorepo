import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, ExternalLink, Monitor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { featuredProjects } from '@engineering-portfolio/project-registry';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SectionHeader } from './SectionHeader';

/**
 * A section showcasing various projects with links to source code and demos.
 */
export const ProjectTerminal = () => {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const projects = featuredProjects;
  const navigate = useNavigate();

  // Extract unique categories from projects
  const categories = ['ALL', ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects =
    activeCategory === 'ALL' ? projects : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="terminal">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <SectionHeader
          title="Project Terminal"
          subtitle="Curated demos served from the local registry"
        />
        <div className="flex items-center gap-2 text-[10px] font-mono text-primary/60 uppercase tracking-widest mb-8 md:mb-12">
          <Monitor className="w-3 h-3" />
          <span>Registry Source: Local Workspace Metadata</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1 font-mono text-[10px] uppercase tracking-widest border transition-all duration-300 cursor-pointer ${
              activeCategory === cat
                ? 'border-primary text-primary bg-primary/10 shadow-[0_0_15px_rgba(0,242,255,0.2)]'
                : 'border-border text-foreground/40 hover:border-foreground/40'
            }`}
          >
            [ {cat} ]
          </button>
        ))}
      </div>

      <div className="relative min-h-[400px]">
        <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="bg-card border-accent/20 rounded-none group hover:bg-secondary/50 transition-all duration-500 h-full">
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-primary">
                        <Github className="w-4 h-4" />
                        <span className="text-[10px] font-mono uppercase tracking-widest">
                          {project.sourcePath}
                        </span>
                      </div>
                      <CardTitle className="text-2xl font-black italic uppercase group-hover:text-accent transition-colors">
                        {project.title}
                      </CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-foreground/40 hover:text-foreground cursor-pointer"
                      onClick={() => navigate(`/demo/${project.slug}`)}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-sm text-foreground/60 leading-relaxed font-mono">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-secondary text-foreground/60 text-[10px] rounded-none border-none"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground text-[10px] uppercase tracking-widest rounded-none h-8 cursor-pointer"
                        onClick={() =>
                          window.open(project.sourceUrl, '_blank', 'noopener,noreferrer')
                        }
                      >
                        <Github className="w-3 h-3 mr-2" />
                        View Source
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-accent/30 text-accent hover:bg-accent hover:text-accent-foreground text-[10px] uppercase tracking-widest rounded-none h-8 cursor-pointer"
                        onClick={() => navigate(`/demo/${project.slug}`)}
                      >
                        <ExternalLink className="w-3 h-3 mr-2" />
                        Preview Demo
                      </Button>
                    </div>

                    <Separator className="bg-border" />
                    <div className="flex items-center gap-6 text-[10px] font-mono text-accent/60 uppercase tracking-widest">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span>{project.framework}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
