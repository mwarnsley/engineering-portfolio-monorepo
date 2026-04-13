import { motion } from 'motion/react';

/**
 * Props for the SectionHeader component.
 */
interface SectionHeaderProps {
  /** The main title of the section. */
  title: string;
  /** An optional subtitle for the section. */
  subtitle?: string;
}

/**
 * A reusable header component for portfolio sections.
 */
export const SectionHeader = ({ title, subtitle }: SectionHeaderProps) => (
  <div className="mb-12">
    <motion.div
      initial={{ width: 0 }}
      whileInView={{ width: '60px' }}
      className="h-1 bg-gradient-to-r from-accent to-primary mb-4"
    />
    <h2 className="text-4xl font-black tracking-tighter uppercase italic headline-glow">{title}</h2>
    {subtitle && (
      <p className="text-foreground/60 mt-2 font-mono text-sm tracking-widest uppercase">
        {subtitle}
      </p>
    )}
  </div>
);
