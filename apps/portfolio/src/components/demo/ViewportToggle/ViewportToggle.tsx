import { Monitor, Smartphone, Tablet, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type DemoViewport = 'desktop' | 'tablet' | 'mobile';

interface ViewportPreset {
  label: string;
  /** Approximate rendered width, shown to users and screen readers. */
  widthLabel: string;
  /** Tailwind max-width token applied to the frame container. */
  frameClassName: string;
  icon: LucideIcon;
}

export const VIEWPORT_PRESETS: Readonly<Record<DemoViewport, ViewportPreset>> = {
  desktop: {
    label: 'Desktop',
    widthLabel: 'Full width',
    frameClassName: 'max-w-full',
    icon: Monitor,
  },
  tablet: { label: 'Tablet', widthLabel: '768px', frameClassName: 'max-w-3xl', icon: Tablet },
  mobile: { label: 'Mobile', widthLabel: '384px', frameClassName: 'max-w-sm', icon: Smartphone },
};

const VIEWPORT_ORDER: readonly DemoViewport[] = ['desktop', 'tablet', 'mobile'];

export interface ViewportToggleProps {
  /** The currently selected viewport. */
  value: DemoViewport;
  /** Called with the newly selected viewport. */
  onChange: (viewport: DemoViewport) => void;
}

export const ViewportToggle = ({ value, onChange }: ViewportToggleProps) => (
  <div
    role="group"
    aria-label="Preview viewport"
    className="inline-flex items-center gap-1 rounded-lg border border-border bg-secondary p-1"
  >
    {VIEWPORT_ORDER.map((viewport) => {
      const { label, widthLabel, icon: Icon } = VIEWPORT_PRESETS[viewport];
      const isActive = viewport === value;
      return (
        <button
          key={viewport}
          type="button"
          aria-pressed={isActive}
          title={`${label} (${widthLabel})`}
          onClick={() => onChange(viewport)}
          className={cn(
            'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors',
            isActive
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Icon aria-hidden="true" className="size-4" />
          <span className="sr-only sm:not-sr-only">{label}</span>
        </button>
      );
    })}
  </div>
);
