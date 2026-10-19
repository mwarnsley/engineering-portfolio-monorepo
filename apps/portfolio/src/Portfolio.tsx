import { useCallback, useState } from 'react';
import { ArchitectureModal } from '@/components/shared/ArchitectureModal';
import { Hero } from '@/components/shared/Hero';
import { ManifestOverlay } from '@/components/shared/ManifestOverlay';
import { MissionHistory } from '@/components/shared/MissionHistory';
import { ProjectTerminal } from '@/components/shared/ProjectTerminal';
import { TechnicalArsenal } from '@/components/shared/TechnicalArsenal';
import { TerminalOverlay } from '@/components/shared/TerminalOverlay';

export default function Portfolio() {
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const openArchitecture = useCallback(() => setIsArchitectureOpen(true), []);
  const closeArchitecture = useCallback(() => setIsArchitectureOpen(false), []);
  const openTerminal = useCallback(() => setIsTerminalOpen(true), []);
  const closeTerminal = useCallback(() => setIsTerminalOpen(false), []);
  const openProfile = useCallback(() => setIsProfileOpen(true), []);
  const closeProfile = useCallback(() => setIsProfileOpen(false), []);

  return (
    <>
      <Hero
        onOpenTerminal={openTerminal}
        onOpenProfile={openProfile}
        onOpenArchitecture={openArchitecture}
      />

      <div className="mx-auto max-w-portfolio space-y-24 px-4 py-16 sm:px-8 md:space-y-32">
        <TechnicalArsenal />
        <ProjectTerminal />
        <MissionHistory />
      </div>

      <ArchitectureModal isOpen={isArchitectureOpen} onClose={closeArchitecture} />
      <TerminalOverlay isOpen={isTerminalOpen} onClose={closeTerminal} />
      <ManifestOverlay isOpen={isProfileOpen} onClose={closeProfile} />
    </>
  );
}
