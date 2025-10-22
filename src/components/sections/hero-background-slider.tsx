"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type Slide = { id: string; image_url: string; alt?: string };

export function HeroBackgroundSlider({ slides, intervalMs = 6000, overlayClassName = "", fit = "contain" }: { slides: Slide[]; intervalMs?: number; overlayClassName?: string; fit?: "cover" | "contain"; }) {
  const safeSlides = useMemo(() => slides.filter(Boolean), [slides]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!safeSlides.length) return;
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % safeSlides.length);
    }, Math.max(2000, intervalMs));
    return () => clearInterval(t);
  }, [safeSlides.length, intervalMs]);

  if (!safeSlides.length) return null;

  return (
    <div className="absolute inset-0 bg-white">
      {safeSlides.map((s, i) => (
        <div key={s.id} className={`absolute inset-0 transition-opacity duration-700 ${i === idx ? "opacity-100" : "opacity-0"}`}>
          <Image
            src={s.image_url}
            alt={s.alt || ""}
            fill
            priority={i === idx}
            quality={100}
            sizes="100vw"
            className={fit === "cover" ? "object-cover" : "object-contain"}
          />
          <div className={overlayClassName} />
        </div>
      ))}
    </div>
  );
}
