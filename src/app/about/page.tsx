"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { aboutPageData } from "@/app/content/about-data";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import {
  AreaChart,
  Calendar,
  Contact,
  LandPlot,
  Ruler,
  Users,
  Building,
  Car,
  Wind,
  Trash2,
  Droplets,
  Lightbulb,
  DollarSign,
  University,
  Heart,
  TreePine,
  Home,
  CheckCircle,
  Map,
} from "lucide-react";

const iconMap = {
  AreaChart,
  Calendar,
  Contact,
  LandPlot,
  Ruler,
  Users,
  Building,
  Car,
  Wind,
  Trash2,
  Droplets,
  Lightbulb,
  DollarSign,
  University,
  Heart,
  TreePine,
  Home,
  CheckCircle,
  Map
};

const Section = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <section className={`py-12 md:py-16 ${className}`}>{children}</section>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-10 text-center">
    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
      {children}
    </h2>
  </div>
);

const InfoCard = ({
  item,
}: {
  item: { label: string; value: any; icon: string };
}) => {
  const Icon = iconMap[item.icon as keyof typeof iconMap] || Users;
  return (
    <Card className="fade-in-up flex flex-col items-center justify-center p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <Icon className="mb-3 h-10 w-10 text-primary" />
      <p className="text-3xl font-bold md:text-4xl">
        {typeof item.value === "number" ? (
          <AnimatedCounter
            value={item.value}
            decimals={item.value % 1 !== 0 ? 2 : 0}
          />
        ) : (
          item.value
        )}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
    </Card>
  );
};

export default function AboutPage() {
  return (
    <div className="bg-background">
      <header className="bg-secondary/50 py-16">
        <div className="container text-center">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
            About Edulapuram Municipality
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            A comprehensive overview of our municipality's structure,
            services, and commitment to citizen well-being.
          </p>
        </div>
      </header>

      <main>
        <Section>
          <div className="container">
            <SectionTitle>Basic Information</SectionTitle>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
              {aboutPageData.basicInfo.map((item) => (
                <InfoCard key={item.label} item={item} />
              ))}
            </div>
             <Card className="mt-8">
              <CardHeader>
                <CardTitle>Merged Villages</CardTitle>
                <CardDescription>The following villages have been merged into the municipality.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {aboutPageData.mergedVillages.map((village, index) => (
                    <div key={index} className="bg-muted text-muted-foreground text-sm font-medium px-3 py-1 rounded-full">{village}</div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section className="bg-muted/30">
          <div className="container">
            <SectionTitle>Infrastructure</SectionTitle>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {Object.entries(aboutPageData.infrastructure).map(
                ([key, value]) => {
                  const Icon =
                    iconMap[value.icon as keyof typeof iconMap] || Building;
                  return (
                    <Card key={key} className="fade-in-up">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          {value.title}
                        </CardTitle>
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        {Object.entries(value.details).map(([k, v]) => (
                          <div
                            key={k}
                            className="flex justify-between border-b py-2 last:border-none"
                          >
                            <span className="text-sm text-muted-foreground">
                              {k}
                            </span>
                            <span className="text-sm font-semibold">{v}</span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  );
                }
              )}
            </div>
          </div>
        </Section>

        <Section>
          <div className="container">
            <SectionTitle>Sanitation & Solid Waste</SectionTitle>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="grid grid-cols-2 gap-4">
                {aboutPageData.sanitation.stats.map((item) => (
                  <InfoCard key={item.label} item={item} />
                ))}
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Vehicles & Machinery</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      {Object.entries(aboutPageData.sanitation.vehicles).map(
                        ([key, value]) => (
                          <TableRow key={key}>
                            <TableCell className="font-medium capitalize">
                              {key.replace(/_/g, " ")}
                            </TableCell>
                            <TableCell className="text-right">
                              {value}
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </Section>

        <Section className="bg-muted/30">
          <div className="container">
            <SectionTitle>Financials (2024-25)</SectionTitle>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Collection</CardTitle>
                    <CardDescription>
                      Amount in Lakhs (₹) for the year 2024-25.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={aboutPageData.financials.revenue.data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="Demand"
                          fill="hsl(var(--secondary))"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="Collection"
                          fill="hsl(var(--primary))"
                          radius={[4, 4, 0, 0]}
                        />
                         <Bar
                          dataKey="Balance"
                          fill="hsl(var(--destructive))"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Account Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(aboutPageData.financials.account).map(
                      ([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-sm capitalize text-muted-foreground">
                            {key.replace(/_/g, " ")}
                          </span>
                          <span className="text-sm font-bold">
                            ₹{value} Lakhs
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Section>
        
        <Section>
          <div className="container">
            <SectionTitle>Community Assets & Facilities</SectionTitle>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {aboutPageData.communityAssets.map((asset) => {
                    const Icon = iconMap[asset.icon as keyof typeof iconMap] || Building;
                    return (
                        <Card key={asset.label} className="text-center p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                            <Icon className="mx-auto h-8 w-8 text-primary mb-2" />
                            <p className="text-xl font-bold">{asset.value}</p>
                            <p className="text-xs text-muted-foreground">{asset.label}</p>
                        </Card>
                    )
                })}
            </div>
          </div>
        </Section>

      </main>
    </div>
  );
}
