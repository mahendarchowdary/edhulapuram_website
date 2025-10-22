import { HeroSectionServer } from "@/components/sections/hero-section-server";
import { QuickStatsServer } from "@/components/sections/quick-stats-server";
import { ServicesSection } from "@/components/sections/services-section";
import { EventsSectionServer } from "@/components/sections/events-section-server";
import { ProjectsSectionServer } from "@/components/sections/projects-section-server";
import { KeyOfficialsSection } from "@/components/sections/key-officials-section";

export default function Home() {
  return (
    <>
      <HeroSectionServer />
      <QuickStatsServer />
      <ServicesSection />
      <KeyOfficialsSection />
      <EventsSectionServer />
      <ProjectsSectionServer />
    </>
  );
}
