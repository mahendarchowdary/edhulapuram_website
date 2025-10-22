import { HeroSection } from "@/components/sections/hero-section";
import { NewsTicker } from "@/components/sections/news-ticker";
import { QuickStats } from "@/components/sections/quick-stats";
import { ServicesSection } from "@/components/sections/services-section";
import { EventsSection } from "@/components/sections/events-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { KeyOfficialsSection } from "@/components/sections/key-officials-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <NewsTicker />
      <QuickStats />
      <ServicesSection />
      <KeyOfficialsSection />
      <EventsSection />
      <ProjectsSection />
    </>
  );
}
