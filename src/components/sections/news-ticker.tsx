'use client';

import { newsTickerData } from "@/app/content/data";
import { Megaphone, Languages } from "lucide-react";
import { useState } from "react";

export function NewsTicker() {
  const [language, setLanguage] = useState<"en" | "te">("en");
  const duplicatedNews = [...newsTickerData.news, ...newsTickerData.news];

  return (
    <div className="w-full border-y bg-card py-2">
      <div className="container flex flex-wrap items-center gap-3 sm:gap-4">
        <div className="flex shrink-0 items-center gap-2 sm:pr-4">
          <Megaphone className="h-5 w-5 text-accent" />
          <span className="font-bold text-sm">
            {newsTickerData.title[language]}:
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Languages className="h-4 w-4 text-muted-foreground" />
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                language === "en"
                  ? "bg-emerald-600 text-white shadow"
                  : "bg-white text-muted-foreground hover:bg-emerald-50"
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage("te")}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                language === "te"
                  ? "bg-emerald-600 text-white shadow"
                  : "bg-white text-muted-foreground hover:bg-emerald-50"
              }`}
            >
              తెలుగు
            </button>
          </div>
        </div>
        <div className="relative flex-1 min-w-[200px] overflow-hidden">
          <div className="flex ticker-container">
            {duplicatedNews.map((news, index) => (
              <p
                key={index}
                className="whitespace-nowrap px-6 text-sm text-muted-foreground"
              >
                {news[language]}
              </p>
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-card to-transparent" />
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-card to-transparent" />
        </div>
      </div>
    </div>
  );
}
