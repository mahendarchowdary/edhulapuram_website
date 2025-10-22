import { Card, CardContent } from "@/components/ui/card";
import { quickStatsData } from "@/app/content/data";
import { Users, Map as MapIcon, Waypoints, Lightbulb } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/animated-counter";

const iconMap = {
  Users: Users,
  Map: MapIcon,
  Waypoints: Waypoints,
  Lightbulb: Lightbulb,
};

export function QuickStats() {
  return (
    <section>
      <div className="container">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-8">
          {quickStatsData.stats.map((stat) => {
            const Icon = iconMap[stat.icon as keyof typeof iconMap];
            return (
              <Card key={stat.label} className="text-center">
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
