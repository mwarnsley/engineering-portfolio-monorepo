import { useRef } from 'react';
import { Download, Mail, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { YEARS_OF_EXPERIENCE_LABEL } from '@/data';
import { useMotionPreference } from '@/hooks/useMotionPreference/useMotionPreference';
import { useModalBehavior } from '@/hooks';
import { cn } from '@/lib/utils';

/**
 * Props for the ManifestOverlay component.
 */
interface ManifestOverlayProps {
  /** Whether the profile drawer is open. */
  isOpen: boolean;
  /** Closes the drawer. Triggered by the close button, the backdrop, or the Escape key. */
  onClose: () => void;
}

const RESUME_PATH = '/resume.pdf';
const RESUME_FILENAME = 'Marcus Warnsley - Senior Front End Engineer.pdf';
const CONTACT_EMAIL = 'marcus.warnsley@gmail.com';

const ENGINEERING_PRINCIPLES = [
  'Optimize for throughput and minimal latency.',
  'Protect quality through rigorous automated testing.',
  'Architect for long-term scalability and maintainability.',
] as const;

const FOCUS_AREAS = [
  'React Architecture',
  'TypeScript',
  'UI/UX Engineering',
  'Performance Auditing',
] as const;

export const ManifestOverlay = ({ isOpen, onClose }: ManifestOverlayProps) => {
  const reducedMotion = useMotionPreference();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useModalBehavior({ isOpen, onClose, containerRef: panelRef, initialFocusRef: closeButtonRef });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: reducedMotion ? 1 : 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.15 }}
          className="fixed inset-0 z-100 flex justify-end bg-background/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-drawer-title"
            initial={reducedMotion ? false : { x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: reducedMotion ? 0 : '100%' }}
            transition={
              reducedMotion ? { duration: 0 } : { type: 'spring', damping: 30, stiffness: 260 }
            }
            className="flex h-full w-full max-w-md flex-col border-l border-border bg-card shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border p-6">
              <div>
                <h2 id="profile-drawer-title" className="text-xl font-semibold">
                  Profile & Résumé
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">Background, focus, and résumé</p>
              </div>
              <Button
                ref={closeButtonRef}
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={onClose}
                aria-label="Close profile"
              >
                <X aria-hidden="true" />
              </Button>
            </div>

            <ScrollArea className="flex-1 overflow-y-auto">
              <div className="space-y-10 p-6">
                <section aria-labelledby="profile-about" className="space-y-4">
                  <h3 id="profile-about" className="text-sm font-medium text-muted-foreground">
                    About
                  </h3>
                  <div className="flex items-center gap-4">
                    <Avatar className="size-14 border border-border">
                      <AvatarImage src="https://github.com/mwarnsley.png" alt="" />
                      <AvatarFallback className="bg-secondary font-semibold">MW</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-lg font-semibold">Marcus Warnsley</p>
                      <p className="text-sm text-muted-foreground">Senior Front-End Engineer</p>
                    </div>
                  </div>
                  <p className="leading-relaxed text-muted-foreground">
                    A systems-driven engineer with {YEARS_OF_EXPERIENCE_LABEL} in the
                    React/TypeScript ecosystem, focused on high-performance, secure, and scalable
                    frontend platforms.
                  </p>
                </section>

                <section aria-labelledby="profile-principles" className="space-y-4">
                  <h3 id="profile-principles" className="text-sm font-medium text-muted-foreground">
                    Engineering principles
                  </h3>
                  <ul className="list-disc space-y-2 pl-5 text-sm text-foreground marker:text-muted-foreground">
                    {ENGINEERING_PRINCIPLES.map((principle) => (
                      <li key={principle}>{principle}</li>
                    ))}
                  </ul>
                </section>

                <section aria-labelledby="profile-focus" className="space-y-4">
                  <h3 id="profile-focus" className="text-sm font-medium text-muted-foreground">
                    Focus areas
                  </h3>
                  <ul className="flex flex-wrap gap-2">
                    {FOCUS_AREAS.map((area) => (
                      <li key={area}>
                        <Badge variant="chip">{area}</Badge>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </ScrollArea>

            <div className="space-y-3 border-t border-border p-6">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className={cn(buttonVariants({ size: 'lg' }), 'h-10 w-full')}
              >
                <Mail aria-hidden="true" />
                Get in touch
              </a>
              <a
                href={RESUME_PATH}
                download={RESUME_FILENAME}
                className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'h-10 w-full')}
              >
                <Download aria-hidden="true" />
                Download résumé (PDF)
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
