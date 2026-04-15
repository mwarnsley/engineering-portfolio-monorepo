import { ArrowLeft, ExternalLink, FolderCode } from 'lucide-react';
import { getProjectBySlug } from '@engineering-portfolio/project-registry';
import { useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionHeader } from '@/components/shared/SectionHeader';

export const DemoPage = () => {
  const { slug = '' } = useParams();
  const project = getProjectBySlug(slug);
  const hostname = window.location.hostname;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

  if (!project) {
    return (
      <div className="max-w-5xl mx-auto px-8 py-16">
        <Card className="bg-card border-accent/20 rounded-none">
          <CardHeader>
            <CardTitle className="text-3xl font-black italic uppercase">Demo Not Found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 font-mono text-sm text-foreground/60">
            <p>No registry entry exists for the slug "{slug}".</p>
            <Button
              variant="outline"
              className="rounded-none uppercase tracking-widest text-xs"
              onClick={() => window.location.assign('/#terminal')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back To Projects
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const demoUrl = isLocalhost ? project.localDevUrl : project.productionUrl ?? project.localDevUrl;

  return (
    <div className="max-w-7xl mx-auto px-8 py-16 space-y-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <SectionHeader
            title={project.title}
            subtitle="Shell preview with the demo app embedded in an iframe"
          />
          <p className="max-w-3xl text-sm font-mono text-foreground/60 leading-relaxed">
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
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="rounded-none uppercase tracking-widest text-xs"
            onClick={() => window.location.assign('/#terminal')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back To Projects
          </Button>
          <Button
            variant="outline"
            className="rounded-none uppercase tracking-widest text-xs"
            onClick={() => window.open(demoUrl, '_blank', 'noopener,noreferrer')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Full Demo
          </Button>
          <Button
            variant="outline"
            className="rounded-none uppercase tracking-widest text-xs"
            onClick={() => window.open(project.sourceUrl, '_blank', 'noopener,noreferrer')}
          >
            <FolderCode className="w-4 h-4 mr-2" />
            View Source
          </Button>
        </div>
      </div>

      <Card className="bg-card border-accent/20 rounded-none overflow-hidden">
        <CardHeader className="border-b border-border bg-secondary/40">
          <div className="text-[10px] font-mono uppercase tracking-widest text-foreground/50">
            {project.framework}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="bg-background">
            <iframe
              key={project.slug}
              src={demoUrl}
              title={`${project.title} demo preview`}
              className="h-[70vh] w-full bg-white"
            />
          </div>
        </CardContent>
      </Card>

      <p className="text-xs font-mono uppercase tracking-widest text-foreground/40">
        If the iframe is blank, start the demo locally from {project.appPath}.
      </p>
    </div>
  );
};
