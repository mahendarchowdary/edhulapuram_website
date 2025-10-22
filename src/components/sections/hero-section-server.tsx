import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getHero, getHeroSlides } from "@/lib/supabase/queries";
import { HeroBackgroundSlider } from "./hero-background-slider";

export async function HeroSectionServer() {
  const [hero, slides] = await Promise.all([getHero(), getHeroSlides()]);
  if (!hero) return null;

  return (
    <section className="relative w-full py-0">
      <div className="container grid min-h-[60vh] grid-cols-1 items-stretch gap-6 py-6 md:min-h-[70vh] md:grid-cols-2">
        {/* Left: Text on themed background */}
        <div className="relative flex items-center justify-center rounded-xl bg-primary px-6 py-10 text-center text-primary-foreground md:text-left">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
              {hero.title}
            </h1>
            {hero.subtitle ? (
              <p className="mt-4 text-lg opacity-90 md:text-xl">{hero.subtitle}</p>
            ) : null}
            <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
              {hero.ctas.map((cta) => (
                <a href={cta.href} target="_blank" rel="noopener noreferrer" key={`${cta.text}-${cta.href}`}>
                  <Button
                    size="lg"
                    variant={cta.variant === "accent" ? "accent" : "default"}
                    className={cta.variant === "accent" ? "bg-accent text-accent-foreground hover:bg-accent/90" : "bg-background text-foreground hover:bg-background/90"}
                  >
                    {cta.text}
                  </Button>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Sliding images */}
        <div className="relative overflow-hidden rounded-xl">
          <div className="absolute inset-0">
            {slides && slides.length > 0 ? (
              <HeroBackgroundSlider slides={slides} overlayClassName="" fit="contain" />
            ) : hero.background_image_url ? (
              <Image
                src={hero.background_image_url}
                alt={hero.title}
                fill
                priority
                quality={95}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-contain"
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

