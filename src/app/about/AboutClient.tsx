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
  TableRow,
} from "@/components/ui/table";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import * as Lucide from "lucide-react";
import type React from "react";

const FallbackUsers = (Lucide as any).Users;
const FallbackBuilding = (Lucide as any).Building;

const Section = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <section className={`py-12 md:py-16 ${className}`}>{children}</section>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-10 text-center">
    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{children}</h2>
  </div>
);

function InfoCard({ item }: { item: { label: string; value: number | string; icon: string | null } }) {
  const Icon = (item.icon && (Lucide as any)[item.icon]) || FallbackUsers;
  const isNumber = typeof item.value === "number";
  return (
    <Card className="fade-in-up flex flex-col items-center justify-center p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <Icon className="mb-3 h-10 w-10 text-primary" />
      <p className="text-3xl font-bold md:text-4xl">
        {isNumber ? (
          <AnimatedCounter value={item.value as number} />
        ) : (
          String(item.value)
        )}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
    </Card>
  );
}

export function AboutClient({
  basicInfo,
  villages,
  infrastructure,
  sanitation,
  financials,
  assets,
}: {
  basicInfo: Array<{ label: string; value_numeric: number | null; value_text: string | null; icon: string | null; position: number | null }>;
  villages: Array<{ name: string; position: number | null }>;
  infrastructure: Array<{ id: string; section: string; title: string; icon: string | null; position: number | null; details: Array<{ label: string; value: string; position: number | null }> }>;
  sanitation: { stats: Array<{ label: string; value_text: string | null; icon: string | null; position: number | null }>; vehicles: Array<{ label: string; quantity: number | null; position: number | null }> };
  financials: { revenueData: Array<{ name: string; Demand: number | null; Collection: number | null; Balance: number | null }>; accountSummary: Array<{ name: string; value: number | null }> };
  assets: Array<{ label: string; value_numeric: number | null; icon: string | null; position: number | null }>;
}) {
  return (
    <div className="bg-background">
      <header className="bg-secondary/50 py-16">
        <div className="container text-center">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">About Edulapuram Municipality</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            A comprehensive overview of our municipality's structure, services, and commitment to citizen well-being.
          </p>
        </div>
      </header>

      <main>
        <Section>
          <div className="container">
            <SectionTitle>Basic Information</SectionTitle>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
              {basicInfo.map((b) => (
                <InfoCard key={b.label} item={{ label: b.label, value: (b.value_numeric ?? (b.value_text ?? "")) as any, icon: b.icon }} />
              ))}
            </div>
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Merged Villages</CardTitle>
                <CardDescription>The following villages have been merged into the municipality.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {villages.map((v, i) => (
                    <div key={`${v.name}-${i}`} className="bg-muted text-muted-foreground text-sm font-medium px-3 py-1 rounded-full">{v.name}</div>
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
              {infrastructure.map((s) => {
                const Icon = (s.icon && (Lucide as any)[s.icon]) || FallbackBuilding;
                return (
                  <Card key={s.id} className="fade-in-up">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{s.title}</CardTitle>
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      {s.details.map((d, idx) => (
                        <div key={`${s.id}-${idx}`} className="flex justify-between border-b py-2 last:border-none">
                          <span className="text-sm text-muted-foreground">{d.label}</span>
                          <span className="text-sm font-semibold">{d.value}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </Section>

        <Section>
          <div className="container">
            <SectionTitle>Sanitation & Solid Waste</SectionTitle>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="grid grid-cols-2 gap-4">
                {sanitation.stats.map((s) => (
                  <InfoCard key={s.label} item={{ label: s.label, value: s.value_text ?? "", icon: s.icon }} />
                ))}
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Vehicles & Machinery</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      {sanitation.vehicles.map((v) => (
                        <TableRow key={v.label}>
                          <TableCell className="font-medium capitalize">{v.label}</TableCell>
                          <TableCell className="text-right">{v.quantity ?? 0}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </Section>

        <Section className="bg-muted/30">
          <div className="container">
            <SectionTitle>Community Assets & Facilities</SectionTitle>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {assets.map((a) => {
                const Icon = (a.icon && (Lucide as any)[a.icon]) || FallbackBuilding;
                return (
                  <Card key={a.label} className="text-center p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <Icon className="mx-auto h-8 w-8 text-primary mb-2" />
                    <p className="text-xl font-bold">{a.value_numeric ?? 0}</p>
                    <p className="text-xs text-muted-foreground">{a.label}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}
