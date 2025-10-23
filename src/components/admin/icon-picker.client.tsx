"use client";

import * as React from "react";
import * as Lucide from "lucide-react";

/**
 * IconPicker: searchable lucide icon picker that writes the chosen icon name into a hidden input.
 * Props:
 * - name: string (form field name, typically "icon")
 * - defaultValue?: string
 * - label?: string
 */
export function IconPicker({ name, defaultValue, label }: { name: string; defaultValue?: string; label?: string }) {
  const allIconNames = React.useMemo(() => {
    const exclude = new Set(["default", "createLucideIcon", "Icon"]);
    return Object.keys(Lucide).filter((k) => {
      if (exclude.has(k)) return false;
      if (!/^[A-Z]/.test(k)) return false;
      const exp = (Lucide as any)[k];
      const t = typeof exp;
      // Many lucide icons are ForwardRefExoticComponent (object); allow both
      return t === "function" || t === "object";
    });
  }, []);
  const [query, setQuery] = React.useState("");
  const [value, setValue] = React.useState<string>(defaultValue ?? "");
  const [open, setOpen] = React.useState(false);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allIconNames; // show all icons by default
    return allIconNames.filter((n) => n.toLowerCase().includes(q));
  }, [allIconNames, query]);

  const Preview = (value && (Lucide as any)[value]) || null;

  return (
    <div className="space-y-1">
      {label ? <div className="text-xs text-muted-foreground">{label}</div> : null}
      <input type="hidden" name={name} value={value} readOnly />
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            className="w-full rounded border px-2 py-1"
            placeholder="Search icons or type exact lucide name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
          />
          {open && (
            <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 p-4 md:items-center">
              <div className="w-full max-w-[90vw] rounded-md border bg-white shadow-xl md:w-[920px]">
                <div className="flex items-center justify-between gap-2 border-b p-2">
                  <input
                    className="w-full rounded border px-2 py-1"
                    placeholder="Search icons"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <button type="button" className="rounded border px-2 py-1 text-xs" onClick={() => setOpen(false)}>Close</button>
                  <button type="button" className="rounded border px-2 py-1 text-xs" onClick={() => { setValue(""); setOpen(false); }}>None</button>
                </div>
                <div className="max-h-[70vh] overflow-auto p-3">
                  {filtered.length === 0 ? (
                    <div className="px-3 py-6 text-center text-sm text-muted-foreground">No matches</div>
                  ) : (
                    <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-10">
                      {filtered.map((n) => {
                        const IconComp = (Lucide as any)[n] as React.ComponentType<{ className?: string }>;
                        const selected = n === value;
                        return (
                          <button
                            type="button"
                            key={n}
                            className={`flex flex-col items-center justify-center rounded border px-2 py-2 hover:bg-muted ${selected ? "border-primary bg-primary/5" : ""}`}
                            title={n}
                            onClick={() => {
                              setValue(n);
                              setOpen(false);
                              setQuery("");
                            }}
                          >
                            <IconComp className="h-5 w-5" />
                            <span className="mt-1 truncate text-[10px]">{n}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <button
          type="button"
          className="rounded border px-2 py-1 text-xs"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle icon list"
        >
          {open ? "Close" : "Browse"}
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded border bg-white">
          {Preview ? <Preview className="h-5 w-5" /> : <span className="text-[10px] text-muted-foreground">none</span>}
        </div>
      </div>
      <div className="text-xs text-muted-foreground">
        Selected: <span className="font-mono">{value || "(none)"}</span>
      </div>
    </div>
  );
}
