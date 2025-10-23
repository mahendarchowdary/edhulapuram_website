import { Card, CardContent } from "@/components/ui/card";
import { quickStatsData } from "@/app/content/data";
import * as Lucide from "lucide-react";
import { Lightbulb } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/animated-counter";

type Stat = { id?: string; label: string; value: number; icon?: string };
type QuickStatsProps = { stats?: Stat[] };

// Resolve an icon component by name from lucide-react
function resolveIcon(name?: string) {
  if (!name) return Lightbulb;
  const key = name in Lucide ? (name as keyof typeof Lucide) : undefined;
  return key ? (Lucide[key] as any) : Lightbulb;
}

export function QuickStats(props: QuickStatsProps) {
  const stats = props.stats ?? quickStatsData.stats;
  return (
    <section className="pt-6 pb-8 md:pt-8 md:pb-10">
      <div className="container">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-8">
          {stats.map((stat, index) => {
            const Icon = resolveIcon(stat.icon);
            return (
              <Card key={`${stat.label}-${index}`} className="text-center">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <Icon className="h-10 w-10 text-primary mb-3" />
                  <p className="text-3xl font-bold md:text-4xl">
                    <AnimatedCounter value={stat.value} decimals={stat.value % 1 !== 0 ? 2 : 0} />
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
