

"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Search,
  Lock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { siteConfig, headerData, keyOfficialsData, serviceLinks } from "@/app/content/data";
import type { ServiceLink } from "@/app/content/data";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { socialIcons } from './social-icons';
import { useGoogleTranslate } from "@/components/providers/google-translate-provider";

const languages = [
  { code: "en" as const, label: "EN", name: "English", nativeLabel: "English" },
  { code: "te" as const, label: "TE", name: "Telugu", nativeLabel: "తెలుగు" },
  { code: "hi" as const, label: "HI", name: "Hindi", nativeLabel: "हिंदी" },
];

type ThemeOption = {
  id: string;
  name: string;
  className: string;
  colors: [string, string];
};

const themeOptions: ThemeOption[] = [
  {
    id: "green",
    name: "Telangana Green",
    className: "theme-green",
    colors: ["#0f8a4c", "#2cc16d"],
  },
  {
    id: "blue",
    name: "Classic Blue",
    className: "theme-default",
    colors: ["#0d47a1", "#1e88e5"],
  },
  {
    id: "orange",
    name: "Vibrant Orange",
    className: "theme-orange",
    colors: ["#d35400", "#f39c12"],
  },
];

type TopBarContentProps = {
  currentLanguage: "en" | "te" | "hi";
  translate: (code: "en" | "te" | "hi") => void;
  services: ServiceLink[];
  themeOptions: ThemeOption[];
  activeThemeId: string;
  onThemeChange: (id: string) => void;
};

const TopBarContent = ({ currentLanguage, translate, services, themeOptions, activeThemeId, onThemeChange }: TopBarContentProps) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    if (!query.trim()) {
      return [];
    }

    const lower = query.trim().toLowerCase();
    return services
      .filter((service) =>
        service.title.toLowerCase().includes(lower) ||
        service.category.toLowerCase().includes(lower)
      )
      .slice(0, 8);
  }, [query, services]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [suggestions.length]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!searchContainerRef.current?.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = useCallback((service: ServiceLink) => {
    setQuery("");
    setIsFocused(false);

    if (service.external) {
      window.open(service.href, "_blank", "noopener,noreferrer");
    } else {
      router.push(service.href);
    }
  }, [router]);

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (suggestions.length === 0) {
      return;
    }
    handleSelect(suggestions[highlightedIndex] ?? suggestions[0]);
  }, [handleSelect, highlightedIndex, suggestions]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      handleSelect(suggestions[highlightedIndex] ?? suggestions[0]);
    } else if (event.key === "Escape") {
      setIsFocused(false);
    }
  }, [handleSelect, highlightedIndex, suggestions]);

  return (
    <div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:gap-4">
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-2 md:flex-1 md:flex-row md:items-center md:gap-2">
        <div className="flex shrink-0 items-center">
          <a
            href="#main-content"
            className="inline-flex shrink-0 items-center rounded-full border border-transparent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:border-emerald-300 hover:text-emerald-600"
          >
            Skip to Content
          </a>
        </div>

        <div
          className="relative w-full min-w-[220px] max-w-2xl sm:min-w-[260px]"
          ref={searchContainerRef}
        >
          <form onSubmit={handleSubmit} className="relative">
            <Input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setIsFocused(true);
              }}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search services..."
              className="h-10 rounded-full border border-emerald-100 bg-white pl-4 pr-10 text-sm shadow-sm"
              aria-expanded={isFocused && suggestions.length > 0}
              aria-controls="service-search-list"
            />
            <Button
              variant="ghost"
              size="icon"
              type="submit"
              className="absolute right-1 top-1 h-8 w-8 rounded-full text-muted-foreground"
            >
              <Search className="h-4 w-4" />
            </Button>

          </form>

          {isFocused && query.trim() && (
            <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border border-emerald-100 bg-white shadow-xl">
              {suggestions.length > 0 ? (
                <ul id="service-search-list" className="max-h-72 overflow-y-auto py-2 text-sm">
                  {suggestions.map((service, index) => (
                    <li key={`${service.title}-${service.href}`}>
                      <button
                        type="button"
                        onMouseDown={(event) => {
                          event.preventDefault();
                          handleSelect(service);
                        }}
                        className={cn(
                          "w-full px-3 py-2 text-left text-foreground transition-colors",
                          index === highlightedIndex ? "bg-emerald-50 text-emerald-700" : "hover:bg-emerald-50"
                        )}
                      >
                        <span className="block font-medium">{service.title}</span>
                        <span className="block text-xs text-muted-foreground">{service.category}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-3 py-2 text-xs text-muted-foreground">No matching services found.</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex w-full flex-wrap items-center justify-start gap-2 sm:justify-between md:w-auto md:flex-none md:justify-end md:gap-3">
        <div className="flex flex-wrap items-center justify-start gap-1.5 md:justify-end">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => translate(lang.code)}
              className={cn(
                "group inline-flex min-w-[72px] items-center justify-between rounded-full border px-2.5 py-1.5 text-[11px] font-semibold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500",
                currentLanguage === lang.code
                  ? "border-emerald-500 bg-emerald-600 text-white shadow"
                  : "border-muted-foreground/20 bg-white text-muted-foreground shadow-sm hover:border-emerald-400 hover:text-emerald-600"
              )}
              aria-pressed={currentLanguage === lang.code}
            >
              <span className="font-bold uppercase tracking-wider text-muted-foreground/80 group-hover:text-inherit">
                {lang.label}
              </span>
              <span className="text-[11px] font-medium group-hover:text-inherit">
                {lang.nativeLabel}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-start gap-2 md:justify-end">
          {themeOptions.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => onThemeChange(theme.id)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500",
                activeThemeId === theme.id ? "border-white shadow-lg scale-110" : "border-white/40 shadow-sm hover:scale-105"
              )}
              style={{
                background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})`,
              }}
              aria-pressed={activeThemeId === theme.id}
              aria-label={`Switch to ${theme.name} theme`}
              title={theme.name}
            />
          ))}
        </div>

        <div className="flex items-center">
          <Link
            href="/auth/sign-in"
            aria-label="Admin Login"
            title="Admin Login"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
          >
            <Lock className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

// ... (rest of the code remains the same)

export function Header() {
  // ... (rest of the code remains the same)
  const { translate, currentLanguage } = useGoogleTranslate();
  const [activeThemeId, setActiveThemeId] = useState(themeOptions[0].id);

  const socialBrandColors: Record<string, string> = {
    Facebook: "#1877F2",
    Twitter: "#1DA1F2",
    Youtube: "#FF0000",
    Whatsapp: "#25D366",
    Apple: "#0F0F0F",
    Android: "#3DDC84",
  };

  // Removed header load animation

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const stored = window.localStorage.getItem("site-theme");
    const found = themeOptions.find((option) => option.id === stored);
    if (found) {
      setActiveThemeId(found.id);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const root = document.documentElement;
    themeOptions.forEach((option) => root.classList.remove(option.className));
    const activeTheme = themeOptions.find((option) => option.id === activeThemeId) ?? themeOptions[0];
    root.classList.add(activeTheme.className);
    window.localStorage.setItem("site-theme", activeTheme.id);
  }, [activeThemeId]);

  const handleThemeChange = useCallback((id: string) => {
    const found = themeOptions.find((option) => option.id === id);
    if (found) {
      setActiveThemeId(found.id);
    }
  }, []);

  const cmOfficial = keyOfficialsData.officials.find(o => o.id === 'cm-telangana');
  const cmSubDesignation = "Municipal Administration and Urban Development";


  return (
    <>
      <header className={cn(
        "relative w-full bg-white shadow-sm z-40"
        )} id="main-header">
        <div className="bg-white text-foreground border-b">
          <div className="container flex h-12 items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              {siteConfig.socials.map((social) => {
                const Icon = socialIcons[social.name as keyof typeof socialIcons];
                const background = socialBrandColors[social.name] ?? "var(--primary)";
                return (
                  <Link
                    key={social.name}
                    href={social.url}
                    className="flex h-9 w-9 items-center justify-center rounded-md text-white shadow-sm transition-transform hover:scale-110 hover:brightness-110"
                    style={{ backgroundColor: background }}
                  >
                    <Icon />
                    <span className="sr-only">{social.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="hidden md:flex items-center gap-4">
              <TopBarContent
                currentLanguage={currentLanguage}
                translate={translate}
                services={serviceLinks}
                themeOptions={themeOptions}
                activeThemeId={activeThemeId}
                onThemeChange={handleThemeChange}
              />
            </div>
            <div className="md:hidden">
                <Button variant="ghost" size="icon">
                    <Search className="h-6 w-6" />
                    <span className="sr-only">Search</span>
                </Button>
            </div>
          </div>
        </div>

        <div className="container flex flex-col gap-4 py-4 lg:gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link href="/" className="order-1 flex shrink-0 items-center">
              <Image
                src={headerData.logo.imageUrl}
                alt={headerData.logo.description || 'Site Logo'}
                width={140}
                height={140}
                className="h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 object-contain"
                data-ai-hint={headerData.logo.imageHint}
                priority
                sizes="(min-width: 1024px) 136px, (min-width: 640px) 112px, 96px"
              />
            </Link>

            <div className="order-2 flex flex-1 items-center justify-center gap-6 sm:gap-8">
              <div className="flex flex-col items-center text-center ml-5 sm:ml-12">
                <h1 className="text-2xl font-extrabold text-emerald-800 sm:text-3xl lg:text-4xl whitespace-nowrap">
                  Edulapuram Municipality
                </h1>
                <p className="text-base font-medium text-emerald-600 sm:text-lg">
                  ఏదులాపురం పురపాలక సంఘం
                </p>
              </div>
              <Image
                src="/images/EHULAPURAM_LOGO.png"
                alt="Edulapuram Municipality Emblem"
                width={165}
                height={165}
                className="hidden h-20 w-auto object-contain sm:block sm:h-24 md:h-28"
                priority
              />
            </div>

            <div className="order-3 flex flex-1 flex-wrap items-center justify-end gap-4 lg:gap-6">
              {cmOfficial && (
                <div className="flex items-center gap-3">
                  <Image
                    src={cmOfficial.imageUrl}
                    alt={cmOfficial.description}
                    width={140}
                    height={140}
                    className="h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 rounded-md object-cover border-2 border-emerald-100 shadow-md"
                    data-ai-hint={cmOfficial.imageHint}
                    sizes="(min-width: 1280px) 110px, (min-width: 1024px) 100px, 92px"
                  />
                  <div className="space-y-1 text-left">
                    <p className="font-bold text-orange-500 whitespace-nowrap">
                      {cmOfficial.name}
                    </p>
                    <p className="text-xs text-muted-foreground font-semibold">
                      {cmOfficial.designation}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {cmSubDesignation}
                    </p>
                  </div>
                </div>
              )}

              <Image
                src={headerData.telanganaRisingLogo.imageUrl}
                alt={headerData.telanganaRisingLogo.description}
                width={150}
                height={150}
                className="h-16 w-auto sm:h-20 lg:h-28 object-contain"
                data-ai-hint={headerData.telanganaRisingLogo.imageHint}
                sizes="(min-width: 1280px) 120px, (min-width: 1024px) 104px, 88px"
              />
            </div>
          </div>
        </div>
         <div className="absolute bottom-0 left-0 w-full h-1.5 bg-primary" />
      </header>
    </>
  );
}

    