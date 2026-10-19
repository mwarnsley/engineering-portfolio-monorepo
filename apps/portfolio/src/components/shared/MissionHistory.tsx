import { MotionReveal } from '@/components/shared/MotionReveal';
import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { careerExperience } from '@/data';
import { cn } from '@/lib/utils';
import { SectionHeader } from '@/components/shared/SectionHeader';

const DATE_RANGE_SEPARATOR = ' – ';

/** Splits "Start – End" so the range can only wrap at the dash, never mid-date. */
const DateRange = ({ dates }: { dates: string }) => {
  const [start, end] = dates.split(DATE_RANGE_SEPARATOR);
  if (!end) return <>{dates}</>;
  return (
    <>
      <span className="whitespace-nowrap">{start} –</span>{' '}
      <span className="whitespace-nowrap">{end}</span>
    </>
  );
};

export const MissionHistory = () => {
  return (
    <section id="experience" aria-labelledby="experience-heading">
      <SectionHeader
        eyebrow="Experience"
        title="Career Experience"
        subtitle="Senior frontend and full-stack roles across e‑commerce, security, fintech, cloud data, and enterprise platforms."
        headingId="experience-heading"
      />

      <ol>
        {careerExperience.map((entry) => (
          <li key={`${entry.company}-${entry.dates}`} className="group">
            <MotionReveal className="grid grid-cols-[--spacing(6)_1fr] gap-x-4 md:grid-cols-[--spacing(44)_--spacing(6)_1fr] md:gap-x-6">
              <div className="col-start-2 row-start-1 space-y-1.5 pt-1 md:col-start-1 md:flex md:flex-col md:items-end md:pr-2 md:text-right">
                <p className="font-mono text-sm text-muted-foreground">
                  <DateRange dates={entry.dates} />
                </p>
                {entry.location && (
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin aria-hidden="true" className="size-3.5" />
                    {entry.location}
                  </p>
                )}
                {entry.isCurrent && <Badge variant="success">Current</Badge>}
              </div>

              <div
                aria-hidden="true"
                className="relative col-start-1 row-span-2 row-start-1 flex justify-center md:col-start-2 md:row-span-1"
              >
                <span className="absolute inset-y-0 w-px bg-border group-first:top-3.5 group-last:bottom-auto group-last:h-3.5" />
                <span
                  className={cn(
                    'relative mt-2 size-3 rounded-full border-2 ring-4 ring-background',
                    entry.isCurrent ? 'border-brand bg-brand' : 'border-border bg-background'
                  )}
                />
              </div>

              <div className="col-start-2 row-start-2 min-w-0 space-y-3 pb-12 pt-3 md:col-start-3 md:row-start-1 md:pt-0">
                <h3 className="text-lg font-semibold text-foreground">
                  {entry.role}
                  <span className="text-muted-foreground"> · {entry.company}</span>
                </h3>
                <p className="max-w-2xl leading-relaxed text-pretty text-muted-foreground">
                  {entry.summary}
                </p>
                {entry.highlights.length > 0 && (
                  <ul aria-label={`${entry.company} highlights`} className="flex flex-wrap gap-2">
                    {entry.highlights.map((highlight) => (
                      <li key={highlight}>
                        <Badge variant="chip">{highlight}</Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </MotionReveal>
          </li>
        ))}
      </ol>
    </section>
  );
};
