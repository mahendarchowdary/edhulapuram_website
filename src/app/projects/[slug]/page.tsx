import { notFound } from "next/navigation";
import { getServerSupabaseClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import {
  DollarSign,
  CalendarDays,
  CheckCircle,
  Clock,
  Hourglass,
  Lightbulb,
  Building,
  Workflow,
  Flower2,
  Wrench,
  Shield,
  Droplets,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const iconMap = {
  Lightbulb,
  Building,
  Workflow,
  Flower2,
  Wrench,
  Shield,
  Droplets,
};

const statusDetails = {
  Completed: { icon: CheckCircle, color: "bg-green-500" },
  Ongoing: { icon: Clock, color: "bg-blue-500" },
  Pending: { icon: Hourglass, color: "bg-yellow-500" },
};

export const revalidate = 0;

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = await getServerSupabaseClient();
  const { data: project, error } = await supabase
    .from("projects")
    .select("id, slug, name, description, cost, completion, status, timeline, icon")
    .eq("slug", params.slug)
    .single();
  let proj = project as any | null;
  if (error || !project) {
    // Fallback 1: try decoded slug
    const decoded = decodeURIComponent(params.slug);
    const { data: alt1 } = await supabase
      .from("projects")
      .select("id, slug, name, description, cost, completion, status, timeline, icon")
      .eq("slug", decoded)
      .maybeSingle();
    proj = alt1 ?? null;
  }
  if (!proj) {
    // Fallback 2: try replacing hyphens with spaces (legacy slugs)
    const spaced = params.slug.replace(/-/g, " ");
    const { data: alt2 } = await supabase
      .from("projects")
      .select("id, slug, name, description, cost, completion, status, timeline, icon")
      .eq("slug", spaced)
      .maybeSingle();
    proj = alt2 ?? null;
  }
  if (!proj) {
    notFound();
  }

  const { data: gallery } = await supabase
    .from("project_gallery")
    .select("image_url, description, image_hint, position")
    .eq("project_id", proj.id)
    .order("position", { ascending: true });

  const getBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "default";
      case "ongoing":
        return "secondary";
      default:
        return "outline";
    }
  };
  
  const Icon = iconMap[(proj.icon as keyof typeof iconMap) ?? "Building"] || Building;
  const StatusIcon = statusDetails[(proj.status as keyof typeof statusDetails) ?? "Ongoing"]?.icon || Clock;

  return (
    <div className="bg-background">
      <header className="bg-secondary/50 py-12">
        <div className="container">
          <Button asChild variant="outline" className="mb-8">
            <Link href="/#projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Projects
            </Link>
          </Button>
          <div className="flex items-center gap-4">
             <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-8 w-8" />
              </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
                {proj.name}
              </h1>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant={getBadgeVariant(proj.status)} className="text-sm">
                  <StatusIcon className="mr-1.5 h-4 w-4" />
                  {proj.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{proj.description ?? ""}</p>
              </CardContent>
            </Card>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Gallery</CardTitle>
                <CardDescription>Visual progress and impact of the project.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(gallery ?? []).map((image: { image_url: string; description: string | null; image_hint: string | null }, index: number) => (
                    <div key={index} className="relative aspect-video w-full overflow-hidden rounded-lg">
                      <Image
                        src={image.image_url}
                        alt={image.description ?? proj.name}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                        data-ai-hint={image.image_hint ?? undefined}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <DollarSign className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <p className="font-semibold text-lg">{proj.cost ?? ""}</p>
                    <p className="text-sm text-muted-foreground">Estimated Cost</p>
                  </div>
                </div>

                 <div className="flex items-start gap-4">
                  <CalendarDays className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <p className="font-semibold text-lg">{proj.timeline ?? ""}</p>
                    <p className="text-sm text-muted-foreground">Project Timeline</p>
                  </div>
                </div>
                
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
                    <span>Completion</span>
                    <span>{proj.completion ?? 0}%</span>
                  </div>
                  <Progress value={(proj.completion as number | null) ?? 0} className="h-3" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}