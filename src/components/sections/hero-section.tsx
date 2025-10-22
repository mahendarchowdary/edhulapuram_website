import Image from "next/image";
import { heroData } from "@/app/content/data";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative h-[60vh] min-h-[400px] w-full py-0 md:h-[80vh]">
      <div className="absolute inset-0 z-0">
        <Image
          src={heroData.backgroundImage.imageUrl}
          alt={heroData.backgroundImage.description}
          fill
          priority
          className="object-cover"
          data-ai-hint={heroData.backgroundImage.imageHint}
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="container relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
            {heroData.title}
          </h1>
          <p className="mt-4 text-lg text-gray-200 md:text-xl">
            {heroData.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {heroData.ctas.map((cta) => (
              <a href={cta.href} target="_blank" rel="noopener noreferrer" key={cta.text}>
                <Button
                  size="lg"
                  variant={cta.variant === 'accent' ? 'accent' : 'default'}
                  className={cta.variant === 'accent' ? 'bg-accent text-accent-foreground hover:bg-accent/90' : 'bg-primary text-primary-foreground hover:bg-primary/90'}
                >
                  {cta.text}
                </Button>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
