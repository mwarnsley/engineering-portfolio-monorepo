/**
 * Props for the BrandMark component.
 */
interface BrandMarkProps {
  /**
   * When true the mark links back to the home route instead of scrolling to the hero.
   */
  isSubpageRoute: boolean;
}

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

export const BrandMark = ({ isSubpageRoute }: BrandMarkProps) => (
  <a
    href={isSubpageRoute ? '/' : '#hero'}
    onClick={isSubpageRoute ? undefined : scrollToTop}
    className="flex items-center gap-3 rounded-md"
    aria-label="Marcus Warnsley, home"
  >
    <span
      aria-hidden="true"
      className="flex size-7 items-center justify-center rounded-md bg-primary font-mono text-xs font-semibold text-primary-foreground"
    >
      MW
    </span>
    <span className="text-sm font-semibold tracking-tight">Marcus Warnsley</span>
  </a>
);
