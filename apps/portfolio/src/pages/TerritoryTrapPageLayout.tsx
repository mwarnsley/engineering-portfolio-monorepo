import { ArrowLeft, Mail } from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface TerritoryTrapPageLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const TERRITORY_TRAP_SUPPORT_EMAIL = 'marcus.warnsley@gmail.com';
export const TERRITORY_TRAP_EFFECTIVE_DATE = 'April 17, 2026';

export const TerritoryTrapPageLayout = ({
  title,
  subtitle,
  children,
}: TerritoryTrapPageLayoutProps) => (
  <div className="max-w-4xl mx-auto px-8 py-16 space-y-10">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="max-w-3xl">
        <SectionHeader title={title} subtitle={subtitle} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          className="rounded-none uppercase tracking-widest text-xs"
          onClick={() => window.location.assign('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back Home
        </Button>
        <Button
          variant="outline"
          className="rounded-none uppercase tracking-widest text-xs"
          onClick={() => window.location.assign(`mailto:${TERRITORY_TRAP_SUPPORT_EMAIL}`)}
        >
          <Mail className="w-4 h-4 mr-2" />
          Contact
        </Button>
      </div>
    </div>

    <Card className="bg-card border-accent/20 rounded-none">
      <CardContent className="p-6 md:p-8">{children}</CardContent>
    </Card>
  </div>
);
