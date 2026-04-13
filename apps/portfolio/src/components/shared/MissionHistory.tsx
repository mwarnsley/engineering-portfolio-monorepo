import { motion } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from './SectionHeader';
import { missionHistory } from '@/data';

/**
 * A chronological timeline of professional work experience.
 */
export const MissionHistory = () => {
  return (
    <section id="history">
      <SectionHeader
        title="Mission History"
        subtitle="Chronological record of high-stakes operations"
      />
      <div className="relative pl-8 md:pl-0">
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

        <div className="space-y-24">
          {missionHistory.map((mission, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`relative flex flex-col md:flex-row items-center gap-8 ${
                i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              <div className="absolute left-0 md:left-1/2 top-0 w-4 h-4 bg-background border-2 border-accent rounded-full -translate-x-1/2 z-20 shadow-[0_0_10px_rgba(188,19,254,0.5)]" />

              <div className={`w-full md:w-1/2 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                <div className="text-tertiary font-mono text-lg font-bold mb-2">{mission.date}</div>
                <h3 className="text-2xl font-black italic uppercase mb-4">{mission.title}</h3>
                <p className="text-sm text-accent/60 leading-relaxed max-w-md mx-auto md:mx-0 inline-block">
                  {mission.description}
                </p>
              </div>

              <div className="w-full md:w-1/2 flex justify-start md:justify-center">
                <Badge
                  variant="outline"
                  className="border-accent/20 text-accent/60 uppercase tracking-widest text-[10px] rounded-none px-4 py-1"
                >
                  {mission.type} // {mission.status}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
