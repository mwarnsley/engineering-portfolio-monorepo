import { ExternalLink, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

/**
 * Props for the ManifestOverlay component.
 */
interface ManifestOverlayProps {
  /** Whether the manifest is currently open. */
  isOpen: boolean;
  /** Function to close the manifest. */
  onClose: () => void;
  /** Whether the decryption sequence is active. */
  isDecrypting: boolean;
}

const RESUME_PATH = '/resume.pdf';

const downloadResume = () => {
  const link = document.createElement('a');
  link.href = RESUME_PATH;
  link.download = 'Marcus Warnsley - Senior Front End Engineer.pdf';
  document.body.appendChild(link);
  link.click();
  link.remove();
};

/**
 * A slide-out manifest drawer with a decryption animation.
 */
export const ManifestOverlay = ({ isOpen, onClose, isDecrypting }: ManifestOverlayProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex justify-end bg-background/60 backdrop-blur-sm"
          onClick={onClose}
        >
          {isDecrypting ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex items-center justify-center bg-background font-mono text-primary overflow-hidden"
            >
              <div className="grid grid-cols-10 md:grid-cols-20 gap-2 opacity-20">
                {Array.from({ length: 200 }).map((_, i) => (
                  <motion.span
                    key={i}
                    animate={{
                      opacity: [0.2, 1, 0.2],
                      color: ['#00F2FF', '#BC13FE', '#00F2FF'],
                    }}
                    transition={{
                      duration: Math.random() * 0.5 + 0.2,
                      repeat: Infinity,
                    }}
                  >
                    {String.fromCharCode(Math.floor(Math.random() * 93) + 33)}
                  </motion.span>
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="text-4xl font-black italic uppercase tracking-[0.5em] animate-pulse">
                    Decrypting
                  </div>
                  <div className="h-1 w-64 bg-secondary relative overflow-hidden mx-auto">
                    <motion.div
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-card border-l border-border h-full flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter">
                    System Manifest
                  </h2>
                  <p className="text-[10px] font-mono text-foreground/60 uppercase tracking-widest mt-1">
                    Core Identity & Mission Parameters
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground/40 hover:text-foreground cursor-pointer"
                  onClick={onClose}
                >
                  <ExternalLink className="w-4 h-4 rotate-45" />
                </Button>
              </div>

              <ScrollArea className="flex-1 overflow-y-auto">
                <div className="p-8 space-y-12">
                  <div className="space-y-4">
                    <div className="text-[10px] font-mono text-primary uppercase tracking-[0.2em] font-bold">
                      01 // IDENTITY
                    </div>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16 rounded-none border border-primary/20">
                        <AvatarImage src="https://github.com/mwarnsley.png" />
                        <AvatarFallback className="bg-background text-primary font-black">
                          MW
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-xl font-bold italic uppercase">Marcus Warnsley</div>
                        <div className="text-xs text-foreground/40 font-mono">
                          Senior Front-End Engineer
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-foreground/60 leading-relaxed font-mono">
                      A systems-driven architect with a decade of field experience in the
                      React/TypeScript ecosystem. Specializing in the construction of
                      high-performance, secure, and scalable digital infrastructures.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="text-[10px] font-mono text-primary uppercase tracking-[0.2em] font-bold">
                      02 // DIRECTIVES
                    </div>
                    <ul className="space-y-3 font-mono text-xs text-foreground/40">
                      <li className="flex gap-3">
                        <span className="text-accent">{'>>'}</span>
                        <span>Optimize for maximum throughput and minimal latency.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-accent">{'>>'}</span>
                        <span>Ensure structural integrity through rigorous testing protocols.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-accent">{'>>'}</span>
                        <span>Architect for long-term scalability and maintainability.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <div className="text-[10px] font-mono text-primary uppercase tracking-[0.2em] font-bold">
                      03 // CERTIFICATIONS
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        'React Expert',
                        'TypeScript Architect',
                        'UI/UX Specialist',
                        'Performance Auditor',
                      ].map((cert) => (
                        <div
                          key={cert}
                          className="bg-secondary border border-border p-3 text-[10px] font-mono uppercase tracking-widest flex justify-between items-center"
                        >
                          <span>{cert}</span>
                          <Badge className="bg-tertiary/20 text-tertiary border-none text-[8px]">
                            VERIFIED
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <div className="p-8 border-t border-border bg-secondary space-y-3">
                <Button
                  className="w-full bg-primary text-primary-foreground font-bold uppercase tracking-widest rounded-none h-12 cursor-pointer"
                  onClick={() => window.open('mailto:marcus.warnsley@gmail.com')}
                >
                  Initiate Contact
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-accent/30 text-accent hover:bg-accent hover:text-accent-foreground font-bold uppercase tracking-widest rounded-none h-12 cursor-pointer"
                  onClick={downloadResume}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume (PDF)
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
