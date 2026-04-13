import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from './SectionHeader';
import { technicalArsenal } from '@/data';

/**
 * A section displaying the technical skills and proficiency levels.
 */
export const TechnicalArsenal = () => {
  return (
    <section id="arsenal">
      <SectionHeader
        title="Technical Arsenal"
        subtitle="Core competencies & specialized skillsets"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {technicalArsenal.map((skill, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="bg-card border-accent/20 group hover:border-primary/50 transition-all duration-500 rounded-none relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <skill.icon className="w-12 h-12" />
              </div>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Badge
                    variant="outline"
                    className="border-accent/30 text-accent text-[10px] uppercase tracking-tighter rounded-none"
                  >
                    {skill.category}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold italic uppercase">{skill.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-mono text-accent/60 uppercase tracking-widest">
                    <span>Proficiency</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="h-1 w-full bg-secondary">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-primary to-accent shadow-[0_0_10px_rgba(188,19,254,0.3)]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
