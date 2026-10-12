import type { ReactNode } from 'react';
import { ArrowLeft, Mail } from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TerritoryTrapPageLayoutProps {
  /** Page title, rendered as the page's `h1`. */
  title: string;
  /** Supporting sentence under the title. */
  subtitle: string;
  /** Page body content. */
  children: ReactNode;
}

export const TERRITORY_TRAP_SUPPORT_EMAIL = 'marcus.warnsley@gmail.com';
export const TERRITORY_TRAP_EFFECTIVE_DATE = 'April 17, 2026';

const actionClassName = cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'px-4');

export const TerritoryTrapPageLayout = ({
  title,
  subtitle,
  children,
}: TerritoryTrapPageLayoutProps) => (
  <div className="mx-auto max-w-4xl space-y-10 px-4 py-16 sm:px-8">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <SectionHeader as="h1" title={title} subtitle={subtitle} spacing="none" />

      <div className="flex flex-wrap gap-2">
        <a href="/" className={actionClassName}>
          <ArrowLeft aria-hidden="true" />
          Back home
        </a>
        <a href={`mailto:${TERRITORY_TRAP_SUPPORT_EMAIL}`} className={actionClassName}>
          <Mail aria-hidden="true" />
          Contact
        </a>
      </div>
    </div>

    <div className="rounded-xl border border-border bg-card p-6 md:p-8">{children}</div>
  </div>
);
