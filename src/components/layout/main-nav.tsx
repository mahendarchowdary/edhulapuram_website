'use client';

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationData, NavigationGroup, NavigationItem } from "@/app/content/data";
import { cn } from "@/lib/utils";
import { ChevronDown, ExternalLink, Home } from "lucide-react";

type NavLinkProps = {
  title: string;
  href: string;
  external?: boolean;
};

const iconMap: Record<string, ReactNode> = {
  Home: <Home className="h-5 w-5 md:h-6 md:w-6" />,
};

function NavLink({ title, href, external }: NavLinkProps) {
  const classes = "flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-emerald-50 hover:text-emerald-700";
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cn(classes, "text-muted-foreground w-full")}> 
        <span>{title}</span>
        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
      </a>
    );
  }

  return (
    <Link href={href} className={cn(classes, "text-muted-foreground justify-start w-full")}>{title}</Link>
  );
}

function GroupColumn({ group }: { group: NavigationGroup }) {
  return (
    <div className="min-w-[220px] space-y-3">
      {group.title && (
        <h4 className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
          {group.title}
        </h4>
      )}
      <div className="flex flex-col gap-1">
        {group.links.map((link) => (
          <NavLink key={link.title} {...link} />
        ))}
      </div>
    </div>
  );
}

function SimpleLinks({ item }: { item: NavigationItem }) {
  if (!item.links) return null;

  return (
    <div className="grid min-w-[240px] gap-1 rounded-lg border border-emerald-100 bg-white p-3 shadow-xl">
      {item.links.map((link) => (
        <NavLink key={link.title} {...link} />
      ))}
    </div>
  );
}

export function MainNav() {
  const pathname = usePathname();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenIndex(null);
      }
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenIndex(null);
      }
    }

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <nav className="w-full bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 text-white shadow-lg">
      <div ref={navRef} className="container">
        <ul className="flex flex-wrap items-center justify-center gap-2 py-2 text-sm md:justify-center">
          {navigationData.map((item, index) => {
            const icon = item.icon ? iconMap[item.icon] : null;
            const isActive = item.href ? pathname === item.href : false;
            const hasDropdown = Boolean(item.groups?.length || item.links?.length);

            if (item.label === "Home") {
              return (
                <li key={item.label}>
                  <Link
                    href={item.href || "/"}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white shadow-sm transition-all hover:scale-105 hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    aria-label="Home"
                  >
                    {icon}
                  </Link>
                </li>
              );
            }

            if (!hasDropdown) {
              const baseClasses = "flex items-center gap-2 rounded-md px-4 py-2 font-semibold transition-colors";

              if (item.external) {
                return (
                  <li key={item.label}>
                    <a
                      href={item.href || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(
                        baseClasses,
                        isActive ? "bg-white/20" : "hover:bg-white/15"
                      )}
                    >
                      {icon}
                      <span>{item.label}</span>
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </li>
                );
              }

              return (
                <li key={item.label}>
                  <Link
                    href={item.href || "#"}
                    className={cn(
                      baseClasses,
                      isActive ? "bg-white/20" : "hover:bg-white/15"
                    )}
                  >
                    {icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            }

            const isOpen = openIndex === index;

            return (
              <li
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenIndex(index)}
                onMouseLeave={() => setOpenIndex((current) => (current === index ? null : current))}
                onFocus={() => setOpenIndex(index)}
                onBlur={(event) => {
                  const relatedTarget = event.relatedTarget as Node | null;
                  if (!event.currentTarget.contains(relatedTarget)) {
                    setOpenIndex((current) => (current === index ? null : current));
                  }
                }}
              >
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex items-center gap-2 rounded-md px-4 py-2 font-semibold transition-colors hover:bg-white/15 focus:bg-white/15 focus:outline-none"
                >
                  {icon}
                  <span>{item.label}</span>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
                  />
                </button>
                <div
                  className={cn(
                    "absolute left-0 top-full z-30 w-max min-w-[280px] transition-all duration-200",
                    isOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0"
                  )}
                >
                  <div className="pt-3">
                    <div className="rounded-xl border border-emerald-100 bg-white text-emerald-900 shadow-2xl">
                      <div className="max-h-[70vh] overflow-y-auto p-4">
                        {item.groups ? (
                          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {item.groups.map((group, groupIndex) => (
                              <GroupColumn key={`${item.label}-group-${groupIndex}`} group={group} />
                            ))}
                          </div>
                        ) : (
                          <SimpleLinks item={item} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
          {/* Admin green dot at the end (after About Municipality) */}
          <li key="admin-dot-end">
            <Link
              href="/auth/sign-in"
              aria-label="Admin"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white shadow-sm transition-all hover:scale-105 hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span className="inline-block h-3.5 w-3.5 rounded-full bg-emerald-400 ring-2 ring-white" />
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
