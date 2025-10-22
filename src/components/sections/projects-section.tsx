
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { projectsData } from "@/app/content/data";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
} from "lucide-react";

export function ProjectsSection() {
  return (
    <section className="bg-secondary/50" id="projects">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {projectsData.title}
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            {projectsData.subtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projectsData.projects.map((project, index) => (
            <Link key={project.slug} href={`/projects/${project.slug}`} className="group block">
              <Card
                className="fade-in-up h-full transform-gpu overflow-hidden rounded-xl border-0 bg-card text-card-foreground shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                style={{ animationDelay: `${index * 100}ms`, opacity: 0 }}
              >
                <CardContent className="relative h-full flex flex-col p-0">
                  <div className="aspect-[3/4] w-full transition-transform duration-500 group-hover:scale-110">
                     <Image
                      src={project.gallery[0].imageUrl}
                      alt={project.gallery[0].description}
                      fill
                      className="object-cover"
                      data-ai-hint={project.gallery[0].imageHint}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-6 text-white transition-all duration-500 group-hover:bottom-1/2 group-hover:translate-y-1/2">
                    <h3 className="text-xl font-bold">{project.name}</h3>
                    <p className="flex items-baseline gap-1 text-base font-semibold text-emerald-200">
                      <span className="text-lg font-bold text-white">₹</span>
                      <span className="text-primary-foreground/90">{project.cost.replace(/₹/gi, "").trim()}</span>
                    </p>
                    <div className="mt-4 max-h-0 space-y-3 overflow-hidden text-sm text-gray-200 opacity-0 transition-all duration-500 group-hover:max-h-40 group-hover:opacity-100">
                      <p className="line-clamp-2">{project.description}</p>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>{project.status}</span>
                          <span>{project.completion}%</span>
                        </div>
                        <Progress value={project.completion} className="h-2" />
                      </div>
                      <div className="flex items-center font-semibold text-primary">
                        View Details <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
