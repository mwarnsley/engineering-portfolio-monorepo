import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import { Hero } from '@/components/shared/Hero';
import { TerminalOverlay } from '@/components/shared/TerminalOverlay';
import { ManifestOverlay } from '@/components/shared/ManifestOverlay';
import { TechnicalArsenal } from '@/components/shared/TechnicalArsenal';
import { ProjectTerminal } from '@/components/shared/ProjectTerminal';
import { MissionHistory } from '@/components/shared/MissionHistory';
/**
 * The main Portfolio component that orchestrates the entire application.
 */
export default function Portfolio() {
  const [terminalText, setTerminalText] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [isMatrix, setIsMatrix] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isManifestOpen, setIsManifestOpen] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);

  const fullText =
    '> Initializing MARCUS WARNSLEY Protocol...\n> Accessing Professional History...\n> Loading Technical Arsenal...\n> System Ready.\n> Type "help" for available commands.';

  /**
   * Resets the terminal state and re-triggers the welcome animation.
   */
  const resetTerminal = useCallback(() => {
    setHistory([]);
    setInputValue('');
    setIsMatrix(false);
    let i = 0;
    const interval = setInterval(() => {
      setTerminalText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, [fullText]);

  useEffect(() => {
    resetTerminal();
  }, [resetTerminal]);

  useEffect(() => {
    if (isTerminalOpen || isManifestOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isTerminalOpen, isManifestOpen]);

  const closeTerminal = () => {
    setIsTerminalOpen(false);
    resetTerminal();
  };

  const startDecryption = () => {
    setIsManifestOpen(true);
    setIsDecrypting(true);
    setTimeout(() => {
      setIsDecrypting(false);
    }, 2000);
  };

  /**
   * Processes terminal commands and updates history.
   */
  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputValue.toLowerCase().trim();
    if (!cmd) return;

    let response = '';
    switch (cmd) {
      case 'help':
        response =
          'AVAILABLE COMMANDS:\n- whoami: Professional bio\n- skills: Categorized skill list\n- contact: Reveal secure channels\n- matrix: Toggle neural visualizer\n- clear: Reset terminal buffer';
        break;
      case 'whoami':
        response =
          'MARCUS WARNSLEY: Senior Front-End Engineer.\n10 years experience building scalable React/TS architectures.\nSpecializing in high-performance UI and distributed systems.';
        break;
      case 'skills':
        response =
          'TECHNICAL ARSENAL:\n[FRONTEND]: React, Next.js, Redux, Tailwind\n[LANGUAGE]: TypeScript, ES6+, Rust\n[MOBILE]: React Native (iOS/Android)\n[DATA]: GraphQL, REST, PostgreSQL';
        break;
      case 'contact':
        response =
          'SECURE CHANNELS:\nEMAIL: marcus.warnsley@gmail.com\nPHONE: (317) 605-4309\nLINKEDIN: linkedin.com/in/marcus-warnsley-a7b42574\nGITHUB: github.com/mwarnsley';
        break;
      case 'matrix':
        setIsMatrix((prev) => !prev);
        response = !isMatrix ? 'Neural visualizer: ONLINE' : 'Neural visualizer: OFFLINE';
        break;
      case 'clear':
        setHistory([]);
        setInputValue('');
        setIsMatrix(false);
        return;
      default:
        response = `Command not found: ${cmd}. Type "help" for assistance.`;
    }

    setHistory([...history, `> ${cmd}`, response]);
    setInputValue('');
  };

  return (
    <>
      <Hero onOpenTerminal={() => setIsTerminalOpen(true)} onStartDecryption={startDecryption} />

      <TerminalOverlay
        isOpen={isTerminalOpen}
        onClose={closeTerminal}
        terminalText={terminalText}
        inputValue={inputValue}
        onInputChange={setInputValue}
        history={history}
        onCommand={handleCommand}
      />

      <ManifestOverlay
        isOpen={isManifestOpen}
        onClose={() => setIsManifestOpen(false)}
        isDecrypting={isDecrypting}
      />

      <div className="max-w-7xl mx-auto px-8 py-16 space-y-24">
        <TechnicalArsenal />
        <ProjectTerminal />
        <MissionHistory />
      </div>

      <AnimatePresence>
        {isMatrix && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden"
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <div className="matrix-rain h-full w-full opacity-20" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
