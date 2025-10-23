'use client';

import { newsTickerData } from "@/app/content/data";
import { Megaphone, Languages } from "lucide-react";
import { useState } from "react";

type NewsItem = { en: string; te?: string };
type NewsTickerProps = {
  title?: { en: string; te?: string };
  news?: NewsItem[];
};

export function NewsTicker(props: NewsTickerProps) {
  const [language, setLanguage] = useState<"en" | "te">("en");
  const title = props.title ?? newsTickerData.title;
  const items = props.news ?? newsTickerData.news;
  const duplicatedNews = [...items, ...items];

  function normalizeHref(raw: string) {
    const trimmed = raw.trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    // add https to www. or bare domains
    return `https://${trimmed}`;
  }

  function linkify(text: string) {
    // Match http(s), www., or bare domains like example.com/path
    const regex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/g;
    const parts: Array<string> = String(text).split(regex) as any;
    return parts.map((part, i) => {
      if (!part) return null;
      if (regex.test(part)) {
        const href = normalizeHref(part);
        return (
          <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 break-all">
            {part}
          </a>
        );
      }
      return (
        <span key={i} className="break-words">{part}</span>
      );
    });
  }

  return (
    <div className="w-full border-y bg-card py-2">
      <div className="container flex flex-wrap items-center gap-3 sm:gap-4">
        <div className="flex shrink-0 items-center gap-2 pr-2 sm:pr-3">
          <Megaphone className="h-5 w-5 text-accent" />
          <span className="text-sm font-bold tracking-wide text-foreground">
            {(title as any)[language] ?? title.en}:
          </span>
        </div>
        <div className="flex items-center gap-2 pr-2 sm:pr-4">
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
        <div className="relative flex min-w-[240px] flex-1 items-center overflow-hidden">
          <div className="flex ticker-container text-sm font-medium text-foreground/90">
            {duplicatedNews.map((news, index) => {
              const text = (news as any)[language] ?? news.en;
              return (
                <p key={index} className="whitespace-nowrap px-6">
                  {linkify(String(text))}
                </p>
              );
            })}
          </div>
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-card to-transparent" />
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-card to-transparent" />
        </div>
      </div>
    </div>
  );
}
