import { FlaskConical, Moon, Sun } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BrandMark } from '@/components/shared/BrandMark';

/**
 * Props for the Navigation component.
 */
interface NavigationProps {
  /** The current theme of the application. */
  theme: 'dark' | 'light';
  /** Function to toggle between dark and light themes. */
  toggleTheme: () => void;
  onOpenTestMatrix: () => void;
}

const HOME_SECTIONS = [
  { href: '#stack', label: 'Stack' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
] as const;

const SUBPAGE_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/#projects', label: 'Projects' },
] as const;

const navLinkClassName =
  'rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground';

export const Navigation = ({ theme, toggleTheme, onOpenTestMatrix }: NavigationProps) => {
  const location = useLocation();
  const isSubpageRoute = location.pathname !== '/';
  const links = isSubpageRoute ? SUBPAGE_LINKS : HOME_SECTIONS;
  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <nav
      aria-label="Primary"
      className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-8"
    >
      <BrandMark isSubpageRoute={isSubpageRoute} />

      <div className="flex items-center gap-1">
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className={navLinkClassName}>
              {link.label}
            </a>
          ))}
        </div>
        <Button
          variant="ghost"
          onClick={onOpenTestMatrix}
          aria-haspopup="dialog"
          aria-label="Open test verification matrix"
        >
          <FlaskConical aria-hidden="true" />
          <span className="hidden sm:inline">Tests</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          onClick={toggleTheme}
          aria-label={`Switch to ${nextTheme} theme`}
        >
          {theme === 'dark' ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
        </Button>
      </div>
    </nav>
  );
};
