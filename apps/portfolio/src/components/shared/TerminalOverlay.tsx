import { useEffect, useRef, useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { useModalBehavior } from '@/hooks';
import { CLI_WELCOME_MESSAGE, runCliCommand } from '@/utils/cliCommands';

/**
 * Props for the TerminalOverlay component.
 */
interface TerminalOverlayProps {
  /** Whether the CLI dialog is open. Session history resets each time it opens. */
  isOpen: boolean;
  /** Closes the dialog. Triggered by the close button, the backdrop, or the Escape key. */
  onClose: () => void;
}

interface CliLine {
  id: number;
  kind: 'input' | 'output';
  text: string;
}

export const TerminalOverlay = ({ isOpen, onClose }: TerminalOverlayProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputEndRef = useRef<HTMLDivElement>(null);
  const nextLineId = useRef(0);
  const [inputValue, setInputValue] = useState('');
  const [lines, setLines] = useState<CliLine[]>([]);

  useModalBehavior({ isOpen, onClose, containerRef: panelRef, initialFocusRef: inputRef });

  useEffect(() => {
    if (!isOpen) {
      setLines([]);
      setInputValue('');
    }
  }, [isOpen]);

  useEffect(() => {
    outputEndRef.current?.scrollIntoView?.({ block: 'nearest' });
  }, [lines]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { output, clearHistory } = runCliCommand(inputValue);
    setInputValue('');

    if (clearHistory) {
      setLines([]);
      return;
    }
    if (output === null) return;

    setLines((current) => [
      ...current,
      { id: nextLineId.current++, kind: 'input', text: inputValue.trim() },
      { id: nextLineId.current++, kind: 'output', text: output },
    ]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm md:p-8"
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cli-dialog-title"
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.2 }}
            className="flex max-h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex h-11 items-center justify-between border-b border-border bg-secondary px-4">
              <h2 id="cli-dialog-title" className="font-mono text-sm text-muted-foreground">
                portfolio-cli
              </h2>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground hover:text-foreground"
                onClick={onClose}
                aria-label="Close CLI"
              >
                <X aria-hidden="true" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 font-mono text-sm">
              <p className="mb-4 whitespace-pre-wrap text-muted-foreground">
                {CLI_WELCOME_MESSAGE}
              </p>

              <div role="log" aria-live="polite" aria-label="CLI output" className="space-y-2">
                {lines.map((line) =>
                  line.kind === 'input' ? (
                    <p key={line.id} className="text-brand">
                      <span aria-hidden="true">$ </span>
                      {line.text}
                    </p>
                  ) : (
                    <p key={line.id} className="whitespace-pre-wrap text-foreground">
                      {line.text}
                    </p>
                  )
                )}
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-3 flex items-center gap-2 rounded-md px-2 py-1 -mx-2 focus-within:ring-2 focus-within:ring-ring"
              >
                <span aria-hidden="true" className="text-brand">
                  $
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  aria-label="Command"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground focus-visible:outline-none"
                  placeholder="help"
                />
              </form>
              <div ref={outputEndRef} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
