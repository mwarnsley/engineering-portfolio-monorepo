import { Terminal, Sun, Moon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

/**
 * Props for the Navigation component.
 */
interface NavigationProps {
  /** The current theme of the application. */
  theme: 'dark' | 'light';
  /** Function to toggle between dark and light themes. */
  toggleTheme: () => void;
}

/**
 * The main navigation bar component.
 */
export const Navigation = ({ theme, toggleTheme }: NavigationProps) => {
  const location = useLocation();
  const isDemoRoute = location.pathname.startsWith('/demo/');
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <nav className="fixed top-0 w-full border-b border-border bg-background/80 backdrop-blur-xl z-50 px-8 flex items-center justify-between">
      <a
        href={isDemoRoute ? '/' : '#hero'}
        className="flex items-center gap-2 cursor-pointer"
        onClick={isDemoRoute ? undefined : scrollToTop}
      >
        <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center rotate-45 group hover:rotate-90 transition-transform duration-500">
          <Terminal className="w-4 h-4 text-primary-foreground -rotate-45 group-hover:-rotate-90 transition-transform duration-500" />
        </div>
        <span className="font-black text-base tracking-tighter ml-2">MARCUS WARNSLEY</span>
      </a>

      <div className="hidden md:flex items-center gap-8 text-xs font-bold tracking-widest uppercase text-foreground/40">
        {isDemoRoute ? (
          <>
            <a href="/" className="hover:text-accent transition-colors cursor-pointer">
              Home
            </a>
            <a href="/#terminal" className="hover:text-accent transition-colors cursor-pointer">
              Projects
            </a>
          </>
        ) : (
          <>
            <a href="#hero" className="hover:text-accent transition-colors cursor-pointer">
              Home
            </a>
            <a href="#arsenal" className="hover:text-accent transition-colors cursor-pointer">
              Arsenal
            </a>
            <a href="#terminal" className="hover:text-accent transition-colors cursor-pointer">
              Projects
            </a>
            <a href="#history" className="hover:text-accent transition-colors cursor-pointer">
              History
            </a>
          </>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="text-foreground/40 hover:text-accent cursor-pointer"
          onClick={toggleTheme}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </div>
    </nav>
  );
};
