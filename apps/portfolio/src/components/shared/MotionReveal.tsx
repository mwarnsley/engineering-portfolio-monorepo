import { useRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useMotionPreference } from '@/hooks/useMotionPreference/useMotionPreference';

interface MotionRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'none';
}

export const revealEase = [0.16, 1, 0.3, 1] as const;

export function MotionReveal({
  children,
  delay = 0,
  className,
  direction = 'up',
}: MotionRevealProps) {
  const reducedMotion = useMotionPreference();
  // A stable host preserves child state and keyboard focus during live preference changes.
  // Content mounted with reduced motion stays static for its lifetime.
  const startedReduced = useRef(reducedMotion).current;
  if (startedReduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: direction === 'up' ? 8 : 0 }}
      animate={reducedMotion ? { opacity: 1, y: 0 } : undefined}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{
        duration: reducedMotion ? 0 : 0.2,
        delay: reducedMotion ? 0 : delay,
        ease: revealEase,
      }}
    >
      {children}
    </motion.div>
  );
}
