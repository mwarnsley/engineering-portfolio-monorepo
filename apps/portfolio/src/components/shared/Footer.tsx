import { Terminal } from 'lucide-react';
import { useLocation } from 'react-router-dom';

/**
 * The footer component of the portfolio.
 */
export const Footer = () => {
  const location = useLocation();
  const isSubpageRoute = location.pathname !== '/';
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="border-t border-border px-8 w-full h-20 flex items-center justify-between">
      <a
        href={isSubpageRoute ? '/' : '#hero'}
        className="flex items-center gap-2 cursor-pointer"
        onClick={isSubpageRoute ? undefined : scrollToTop}
      >
        <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center rotate-45">
          <Terminal className="w-4 h-4 text-primary-foreground -rotate-45" />
        </div>
        <span className="font-black text-base tracking-tighter ml-2">MARCUS WARNSLEY</span>
      </a>

      <div className="flex items-center gap-8">
        <div className="hidden md:flex gap-8 text-[10px] font-mono text-foreground/20 uppercase tracking-widest">
          <a
            href="https://github.com/mwarnsley"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors cursor-pointer"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/marcus-warnsley-a7b42574"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors cursor-pointer"
          >
            LinkedIn
          </a>
        </div>

        <div className="text-[10px] font-mono text-accent/20 uppercase tracking-widest">
          © 2026 Marcus Warnsley. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
