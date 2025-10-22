import { getEvents } from "@/lib/supabase/queries";
import { EventsCarouselClient, type EventCard } from "./events-carousel.client";

export async function EventsSectionServer() {
  const events = await getEvents();
  // Use client carousel for autoplay/controls
  return (
    <section>
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Events</h2>
          <p className="mt-3 text-lg text-muted-foreground">Recent and upcoming municipal events.</p>
        </div>
        <EventsCarouselClient events={events as EventCard[]} />
      </div>
    </section>
  );
}
