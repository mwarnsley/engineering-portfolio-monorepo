import { motion } from 'motion/react';
import { ArrowRight, FileText, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { YEARS_OF_EXPERIENCE_LABEL } from '@/data';
import { SystemBlueprintCard } from './SystemBlueprintCard';

/**
 * Props for the Hero component.
 */
interface HeroProps {
  /** Opens the interactive CLI overlay. */
  onOpenTerminal: () => void;
  /** Opens the profile and résumé drawer. */
  onOpenProfile: () => void;
}

const scrollToProjects = () =>
  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

export const Hero = ({ onOpenTerminal, onOpenProfile }: HeroProps) => {
  return (
    <section id="hero" aria-labelledby="hero-heading" className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="hero-glow absolute inset-0 -z-10" />

      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-20 sm:px-8 lg:min-h-[70vh] lg:flex-row lg:items-center lg:gap-10 lg:py-28 xl:gap-16">
        <div className="min-w-0 flex-1">
          <motion.p
            {...fadeUp(0)}
            className="mb-5 font-mono text-sm font-medium uppercase tracking-widest text-brand"
          >
            Senior Frontend Engineer
          </motion.p>

          <motion.h1
            id="hero-heading"
            {...fadeUp(0.05)}
            className="text-4xl font-semibold leading-tight text-balance text-foreground sm:text-5xl lg:text-4xl xl:text-5xl"
          >
            Engineering scalable, accessible frontend systems.
          </motion.h1>

          <motion.p
            {...fadeUp(0.15)}
            className="mt-6 max-w-2xl text-base leading-relaxed text-pretty text-secondary-foreground md:text-lg"
          >
            Senior Front-End Engineer with {YEARS_OF_EXPERIENCE_LABEL} of enterprise experience
            specializing in React, Next.js, TypeScript, and high-scale design systems. Delivering
            resilient, WCAG AAA-compliant interfaces across complex web and mobile ecosystems.
          </motion.p>

          <motion.div {...fadeUp(0.25)} className="mt-10 space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="h-11 px-5 sm:min-w-48" onClick={scrollToProjects}>
                Explore Architecture
                <ArrowRight aria-hidden="true" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 px-5 sm:min-w-48"
                onClick={onOpenProfile}
              >
                <FileText aria-hidden="true" />
                View Résumé
              </Button>
            </div>
            <button
              type="button"
              onClick={onOpenTerminal}
              className="-mx-2 inline-flex items-center gap-2 rounded-md px-2 py-1 font-mono text-sm text-secondary-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              <Terminal aria-hidden="true" className="size-4" />
              or explore via the interactive CLI
            </button>
          </motion.div>
        </div>

        <motion.div
          {...fadeUp(0.3)}
          className="w-full max-w-xl lg:w-sm lg:max-w-none lg:shrink-0 xl:w-md"
        >
          <SystemBlueprintCard />
        </motion.div>
      </div>
    </section>
  );
};
