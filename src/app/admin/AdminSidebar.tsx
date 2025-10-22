"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/admin/news", label: "News" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/stats", label: "Quick Stats" },
  { href: "/admin/hero", label: "Hero" },
  { href: "/admin/key-officials", label: "Key Officials" },
  { href: "/admin/staff", label: "Staff" },
];

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("admin-sidebar-collapsed");
    setCollapsed(saved === "1");
  }, []);

  useEffect(() => {
    localStorage.setItem("admin-sidebar-collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  return (
    <aside className={`relative rounded-xl border bg-card/95 backdrop-blur p-2 transition-all duration-300 ${collapsed ? "w-16" : "w-60"}`}>
      <button
        type="button"
        onClick={() => setCollapsed((v) => !v)}
        className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border bg-background text-xs shadow hover:bg-muted"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand" : "Collapse"}
      >
        {collapsed ? ">" : "<"}
      </button>
      <nav className="mt-1 flex flex-col gap-1">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted ${collapsed ? "justify-center" : ""}`}
            title={collapsed ? l.label : undefined}
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 text-emerald-700 text-xs">
              {l.label.charAt(0)}
            </span>
            {!collapsed && <span className="truncate">{l.label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
