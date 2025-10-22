import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { servicesData } from "@/app/content/data";
import { 
  Home, 
  Droplets, 
  Store, 
  Building, 
  FileText, 
  MessageSquareWarning,
  LandPlot,
  RefreshCw,
  Megaphone,
  Signal,
  Copy,
  Scissors,
  Phone,
  ShieldCheck,
  Users,
} from "lucide-react";

const iconMap = {
  Home,
  Droplets,
  Store,
  Building,
  FileText,
  MessageSquareWarning,
  LandPlot,
  RefreshCw,
  Megaphone,
  Signal,
  Copy,
  Scissors,
  Phone,
  ShieldCheck,
  Users,
};

export function ServicesSection() {
  return (
    <section className="bg-muted/50" id="services">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {servicesData.title}
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            {servicesData.subtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {servicesData.services.map((service) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap];
            return (
              <a href={service.href} target="_blank" rel="noreferrer" key={service.title} className="group">
                <Card className="h-full transform transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
                  <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="mb-4 rounded-full bg-primary/20 p-4 transition-colors duration-300 group-hover:bg-primary">
                      <Icon className="h-10 w-10 text-primary transition-colors duration-300 group-hover:text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold">{service.title}</h3>
                  </CardContent>
                </Card>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
