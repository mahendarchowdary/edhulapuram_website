'use client';

import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export type EventCard = {
  id: string;
  title: string;
  date: string | null;
  description: string | null;
  cover_image_url: string | null;
};

export function EventsCarouselClient({ events }: { events: EventCard[] }) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  // Track per-event fit mode determined at runtime based on image aspect ratio
  const [fitMode, setFitMode] = React.useState<Record<string, 'cover' | 'contain'>>({});
  const plugin = React.useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  return (
    <Carousel
      setApi={setApi}
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      opts={{ loop: true, align: 'center' }}
    >
      <CarouselContent className="-ml-4">
        {events.map((event, index) => (
          <CarouselItem key={event.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
            <div className={cn('p-1 transition-transform duration-500 ease-in-out', index === current ? 'scale-105' : 'scale-90 opacity-60')}>
              <Card>
                <CardContent className="flex aspect-video flex-col items-start justify-end p-0">
                  <div className="relative h-full w-full overflow-hidden rounded-lg bg-neutral-200">
                    {event.cover_image_url ? (
                      <>
                        {/* Background fill to avoid side gaps, using same image blurred */}
                        <div
                          aria-hidden
                          className="absolute inset-0"
                        >
                          <div
                            className="h-full w-full bg-center bg-cover blur-md scale-110 opacity-40 saturate-150"
                            style={{ backgroundImage: `url(${event.cover_image_url})` }}
                          />
                        </div>
                        {/* Foreground full image without cropping */}
                        <Image
                          src={event.cover_image_url}
                          alt={event.description ?? event.title}
                          fill
                          className={`${fitMode[event.id] === 'cover' ? 'object-cover' : 'object-contain'} transition-transform duration-300`}
                          onLoad={(e) => {
                            const img = e.currentTarget as HTMLImageElement;
                            const ratio = img.naturalWidth / img.naturalHeight;
                            setFitMode((prev) => ({ ...prev, [event.id]: ratio >= 1.4 ? 'cover' : 'contain' }));
                          }}
                        />
                      </>
                    ) : null}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4 text-white">
                      <h3 className="text-lg font-bold">{event.title}</h3>
                      <div className="flex items-center text-xs text-gray-300 mt-1">
                        <Calendar className="mr-1.5 h-3 w-3" />
                        <span>{event.date ?? ''}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="ml-12 hidden sm:flex" />
      <CarouselNext className="mr-12 hidden sm:flex" />
    </Carousel>
  );
}
