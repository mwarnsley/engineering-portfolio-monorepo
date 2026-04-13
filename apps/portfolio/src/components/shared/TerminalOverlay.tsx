import React from 'react';
import { Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * Props for the TerminalOverlay component.
 */
interface TerminalOverlayProps {
  /** Whether the terminal is currently open. */
  isOpen: boolean;
  /** Function to close the terminal. */
  onClose: () => void;
  /** The current text being typed in the terminal. */
  terminalText: string;
  /** The current value of the terminal input. */
  inputValue: string;
  /** Function to handle input changes. */
  onInputChange: (value: string) => void;
  /** The history of commands and responses. */
  history: string[];
  /** Function to handle command submission. */
  onCommand: (e: React.FormEvent) => void;
}

/**
 * An interactive terminal overlay component.
 */
export const TerminalOverlay = ({
  isOpen,
  onClose,
  terminalText,
  inputValue,
  onInputChange,
  history,
  onCommand,
}: TerminalOverlayProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-background/90 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-4xl bg-card border border-border rounded-xl overflow-hidden shadow-2xl relative flex flex-col max-h-[80vh]"
          >
            <div className="absolute top-12 right-4 z-20 hidden md:block">
              <div className="bg-background/80 border border-primary/20 backdrop-blur-md p-3 font-mono text-[9px] text-primary/60 uppercase tracking-widest space-y-1">
                <div className="text-primary font-bold border-b border-primary/20 pb-1 mb-1">
                  COMMAND_LIST
                </div>
                <div>{'>'} whoami</div>
                <div>{'>'} skills</div>
                <div>{'>'} contact</div>
                <div>{'>'} matrix</div>
                <div>{'>'} clear</div>
              </div>
            </div>

            <div className="h-10 bg-secondary border-b border-border flex items-center px-4 justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                <span className="text-[10px] text-accent/40 font-mono ml-2 uppercase tracking-widest">
                  system_terminal.exe
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-foreground/40 hover:text-foreground cursor-pointer"
                onClick={onClose}
              >
                <Zap className="w-3 h-3 rotate-45" />
              </Button>
            </div>

            <ScrollArea className="flex-1 p-6 font-mono text-xs text-tertiary">
              <div className="whitespace-pre-wrap mb-4 opacity-70">{terminalText}</div>

              <div className="space-y-2">
                {history.map((line, idx) => (
                  <div
                    key={idx}
                    className={
                      line.startsWith('>') ? 'text-primary' : 'text-tertiary/80 whitespace-pre-wrap'
                    }
                  >
                    {line}
                  </div>
                ))}
              </div>

              <form onSubmit={onCommand} className="flex items-center mt-2">
                <span className="text-primary mr-2">{'>'}</span>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => onInputChange(e.target.value)}
                  className="bg-transparent border-none outline-none text-tertiary w-full"
                  autoFocus
                />
              </form>
            </ScrollArea>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
