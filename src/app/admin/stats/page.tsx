import { getServerSupabaseClient, getServiceSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { IconPicker } from "@/components/admin/icon-picker.client";

async function fetchStats() {
  const supabase = await getServerSupabaseClient();
  const { data, error } = await supabase
    .from("quick_stats")
    .select("id,label,value,value_text,icon,position,updated_at")
    .order("position", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export default async function AdminStatsPage({ searchParams }: { searchParams: Promise<{ success?: string }> }) {
  const items = await fetchStats();
  const sp = await searchParams;
  const successMsg = sp?.success ? decodeURIComponent(sp.success) : undefined;

  async function createStat(formData: FormData) {
    "use server";
    const label = String(formData.get("label") ?? "").trim();
    const valueStr = String(formData.get("value") ?? "").trim();
    const value = valueStr ? Number(valueStr) : null;
    const value_text = String(formData.get("value_text") ?? "").trim() || null;
    const icon = String(formData.get("icon") ?? "").trim() || "Lightbulb";
    if (!label) return;
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    const { data: maxRows } = await supabase.from("quick_stats").select("position").order("position", { ascending: false }).limit(1);
    const nextPos = (maxRows?.[0]?.position ?? 0) + 1;
    await supabase.from("quick_stats").insert({ label, value, value_text, icon, position: nextPos });
    revalidatePath("/admin/stats");
    revalidatePath("/");
    redirect("/admin/stats?success=Stat%20created");
  }

  async function del(id: string) {
    "use server";
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    await supabase.from("quick_stats").delete().eq("id", id);
    revalidatePath("/admin/stats");
    revalidatePath("/");
    redirect("/admin/stats?success=Stat%20deleted");
  }

  async function move(id: string, dir: "up" | "down") {
    "use server";
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    const { data: rows } = await supabase.from("quick_stats").select("id,position").order("position", { ascending: true });
    if (!rows) return;
    const idx = rows.findIndex((r) => r.id === id);
    if (idx < 0) return;
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= rows.length) return;
    const a = rows[idx];
    const b = rows[swapIdx];
    await supabase.from("quick_stats").update({ position: b.position }).eq("id", a.id);
    await supabase.from("quick_stats").update({ position: a.position }).eq("id", b.id);
    revalidatePath("/admin/stats");
    revalidatePath("/");
  }

  return (
    <div className="space-y-6">
      {successMsg ? (
        <div className="rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{successMsg}</div>
      ) : null}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Quick Stats</h1>
        <span className="text-sm text-muted-foreground">{items.length} items</span>
      </div>

      <form action={createStat} className="rounded border p-4 space-y-3">
        <div className="text-sm font-medium">Create Stat</div>
        <div className="grid gap-3 sm:grid-cols-6">
          <input name="label" placeholder="Label" className="rounded border px-3 py-2" required />
          <input name="value" placeholder="Value (number)" className="rounded border px-3 py-2" />
          <input name="value_text" placeholder="Value text (optional)" className="rounded border px-3 py-2" />
          <div className="sm:col-span-2">
            <IconPicker name="icon" label="Icon" />
          </div>
          <button type="submit" className="rounded bg-primary px-4 py-2 text-white">Create</button>
        </div>
      </form>

      <div className="overflow-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Label</th>
              <th className="px-3 py-2">Value</th>
              <th className="px-3 py-2">Icon</th>
              <th className="px-3 py-2">Updated</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((n, i) => (
              <tr key={n.id} className="border-t">
                <td className="px-3 py-2 whitespace-nowrap">{n.position}</td>
                <td className="px-3 py-2">{n.label}</td>
                <td className="px-3 py-2">{n.value ?? n.value_text ?? ""}</td>
                <td className="px-3 py-2">{n.icon ?? ""}</td>
                <td className="px-3 py-2">{n.updated_at ? new Date(n.updated_at as unknown as string).toLocaleString() : ""}</td>
                <td className="px-3 py-2 space-x-2 whitespace-nowrap">
                  <form action={del.bind(null, n.id as string)} className="inline">
                    <button className="rounded border px-2 py-1">Delete</button>
                  </form>
                  <form action={move.bind(null, n.id as string, "up")} className="inline">
                    <button disabled={i === 0} className="rounded border px-2 py-1 disabled:opacity-50">Up</button>
                  </form>
                  <form action={move.bind(null, n.id as string, "down")} className="inline">
                    <button disabled={i === items.length - 1} className="rounded border px-2 py-1 disabled:opacity-50">Down</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
