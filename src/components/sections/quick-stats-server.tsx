import { QuickStats } from "./quick-stats";
import { getQuickStats } from "@/lib/supabase/queries";

export async function QuickStatsServer() {
  const rows = await getQuickStats();
  const stats = rows.map((r) => ({
    label: r.label,
    value: r.value ?? 0,
    icon: r.icon ?? "Lightbulb",
  }));
  return <QuickStats stats={stats} />;
}
