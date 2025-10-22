import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { keyOfficialsData } from "@/app/content/data";
import { getKeyOfficials } from "@/lib/supabase/queries";

export async function KeyOfficialsSection() {
  const rows = await getKeyOfficials();
  const data = rows.length
    ? {
        title: keyOfficialsData.title,
        subtitle: keyOfficialsData.subtitle,
        officials: rows.map((r) => ({
          id: r.id as string,
          imageUrl: (r as any).image_url ?? "",
          description: (r as any).description ?? r.designation ?? r.name,
          imageHint: (r as any).image_hint ?? undefined,
          name: r.name as string,
          designation: r.designation as string,
          bio: (r as any).description ?? null,
        })),
      }
    : keyOfficialsData;

  return (
    <section>
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {data.title}
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            {data.subtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {data.officials.map((official: any, index: number) => (
              <Card
                key={official.id}
                className="group fade-in-up transform-gpu overflow-hidden rounded-xl border-0 shadow-lg transition-all duration-500 hover:!opacity-100 hover:shadow-2xl"
                style={{ animationDelay: `${index * 150}ms`, opacity: 0 }}
              >
                <CardContent className="relative p-0">
                  <div className="aspect-[3/4] transition-transform duration-500 group-hover:scale-110">
                    <Image
                      src={official.imageUrl}
                      alt={official.description}
                      fill
                      className="object-cover"
                      data-ai-hint={official.imageHint}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-6 transition-all duration-500 group-hover:bottom-1/2 group-hover:translate-y-1/2">
                    <h3 className="text-xl font-bold text-white">{official.name}</h3>
                    <p className="text-base font-medium text-primary">{official.designation}</p>
                    <div className="mt-4 max-h-0 overflow-hidden text-sm text-gray-200 opacity-0 transition-all duration-500 group-hover:max-h-40 group-hover:opacity-100">
                      <p>{official.bio ?? "Oversees the administration and implementation of municipal policies and development projects."}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </section>
  );
}
