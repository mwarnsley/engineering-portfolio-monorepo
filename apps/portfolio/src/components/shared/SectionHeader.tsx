import { cn } from '@/lib/utils';

/**
 * Props for the SectionHeader component.
 */
interface SectionHeaderProps {
  /** The main title of the section, rendered as an `h2` (or `h1` when `as="h1"`). */
  title: string;
  /** Optional supporting sentence rendered under the title. */
  subtitle?: string;
  /** Optional short label rendered above the title, e.g. "Experience". */
  eyebrow?: string;
  /**
   * Id applied to the heading so a parent `section` can reference it via `aria-labelledby`.
   */
  headingId?: string;
  /**
   * Heading level. Use `h1` for standalone pages.
   * @default 'h2'
   */
  as?: 'h1' | 'h2';
  /**
   * Bottom spacing. Use `none` when the header sits inside a row with sibling controls.
   * @default 'default'
   */
  spacing?: 'default' | 'none';
}

export const SectionHeader = ({
  title,
  subtitle,
  eyebrow,
  headingId,
  as: Heading = 'h2',
  spacing = 'default',
}: SectionHeaderProps) => (
  <div className={cn('max-w-3xl space-y-3', spacing === 'default' && 'mb-10')}>
    {eyebrow && (
      <p className="font-mono text-xs font-medium uppercase tracking-widest text-brand">
        {eyebrow}
      </p>
    )}
    <Heading id={headingId} className="text-3xl font-semibold text-foreground sm:text-4xl">
      {title}
    </Heading>
    {subtitle && <p className="text-base leading-relaxed text-muted-foreground">{subtitle}</p>}
  </div>
);
