import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';

/**
 * Props for the Hero component.
 */
interface HeroProps {
  /** Function to open the terminal overlay. */
  onOpenTerminal: () => void;
  /** Function to start the manifest decryption sequence. */
  onStartDecryption: () => void;
}

/**
 * The hero section of the portfolio.
 */
export const Hero = ({ onOpenTerminal, onStartDecryption }: HeroProps) => {
  return (
    <section
      id="hero"
      className="min-h-[70vh] flex flex-col items-center justify-center px-12 text-center relative"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-5xl mx-auto"
      >
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-black leading-tight tracking-tight uppercase italic mb-8 headline-glow px-12 overflow-visible">
          <span className="inline-block text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/20 pr-4">
            Engineering
          </span>
          <br />
          <span className="inline-block text-gradient-cyan-purple drop-shadow-[0_0_15px_rgba(0,242,255,0.3)] pr-4">
            Scalable Reality
          </span>
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-2xl text-foreground/40 font-mono text-sm md:text-base tracking-wide leading-relaxed mb-12"
      >
        Senior Front-End Engineer with 10 years of experience building scalable React and TypeScript
        applications across web and mobile. Architecting maintainable, user-focused interfaces in
        complex environments.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-wrap justify-center gap-4"
      >
        <Button
          size="lg"
          className="bg-accent text-accent-foreground hover:opacity-90 px-8 h-14 text-sm font-bold uppercase tracking-widest rounded-none cursor-pointer"
          onClick={onOpenTerminal}
        >
          Initialize Protocol
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-border bg-secondary hover:bg-secondary/80 px-8 h-14 text-sm font-bold uppercase tracking-widest rounded-none cursor-pointer"
          onClick={onStartDecryption}
        >
          View Manifest
        </Button>
      </motion.div>
    </section>
  );
};
