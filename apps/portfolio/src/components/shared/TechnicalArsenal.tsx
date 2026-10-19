import { MotionReveal } from '@/components/shared/MotionReveal';
import { Badge } from '@/components/ui/badge';
import { coreStack } from '@/data';
import { SectionHeader } from '@/components/shared/SectionHeader';

export const TechnicalArsenal = () => {
  return (
    <section id="stack" aria-labelledby="stack-heading">
      <SectionHeader
        eyebrow="Capabilities"
        title="Core Stack & Systems"
        subtitle="The languages, frameworks, and engineering disciplines I build production systems with."
        headingId="stack-heading"
      />
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {coreStack.map((capability, index) => (
          <li key={capability.name}>
            <MotionReveal
              delay={(index % 3) * 0.05}
              className="h-full surface-card surface-card-interactive flex flex-col items-start gap-3 p-5"
            >
              <Badge variant="chip" className="font-mono uppercase tracking-wider">
                {capability.category}
              </Badge>
              <h3 className="text-base font-medium text-foreground">{capability.name}</h3>
            </MotionReveal>
          </li>
        ))}
      </ul>
    </section>
  );
};
