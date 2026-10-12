import { useLocation } from 'react-router-dom';
import { BrandMark } from './BrandMark';

const COPYRIGHT_YEAR = new Date().getFullYear();

const FOOTER_LINKS = [
  { href: 'https://github.com/mwarnsley', label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/marcus-warnsley-a7b42574', label: 'LinkedIn' },
] as const;

export const Footer = () => {
  const location = useLocation();
  const isSubpageRoute = location.pathname !== '/';

  return (
    <footer className="w-full justify-between border-t border-border px-4 sm:px-8">
      <BrandMark isSubpageRoute={isSubpageRoute} />

      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <div className="hidden gap-6 md:flex">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm transition-colors hover:text-foreground"
            >
              {link.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ))}
        </div>
        <p>© {COPYRIGHT_YEAR} Marcus Warnsley</p>
      </div>
    </footer>
  );
};
