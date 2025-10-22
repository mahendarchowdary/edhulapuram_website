import { getServerSupabaseClient, getServiceSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function fetchNews() {
  const supabase = await getServerSupabaseClient();
  const { data, error } = await supabase
    .from("news_items")
    .select("id,title_en,title_te,is_published,position,updated_at")
    .order("position", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export default async function AdminNewsPage({ searchParams }: { searchParams: Promise<{ success?: string }> }) {
  const items = await fetchNews();
  const sp = await searchParams;
  const successMsg = sp?.success ? decodeURIComponent(sp.success) : undefined;

  async function createNews(formData: FormData) {
    "use server";
    const title_en = String(formData.get("title_en") ?? "").trim();
    const title_te = String(formData.get("title_te") ?? "").trim() || null;
    if (!title_en) return;
    const supabase = await getServerSupabaseClient();
    // place after current max position
    const { data: maxRows } = await supabase
      .from("news_items")
      .select("position")
      .order("position", { ascending: false })
      .limit(1);
    const nextPos = (maxRows?.[0]?.position ?? 0) + 1;
    await supabase.from("news_items").insert({ title_en, title_te, position: nextPos, is_published: true });
    revalidatePath("/admin/news");
    redirect("/admin/news?success=News%20created");
  }

  async function togglePublish(id: string, is_published: boolean) {
    "use server";
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    await supabase.from("news_items").update({ is_published: !is_published }).eq("id", id);
    revalidatePath("/admin/news");
    redirect("/admin/news?success=Publish%20toggled");
  }

  async function delNews(id: string) {
    "use server";
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    await supabase.from("news_items").delete().eq("id", id);
    revalidatePath("/admin/news");
    redirect("/admin/news?success=News%20deleted");
  }

  async function move(id: string, dir: "up" | "down") {
    "use server";
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    const { data: rows } = await supabase
      .from("news_items")
      .select("id,position")
      .order("position", { ascending: true });
    if (!rows) return;
    const idx = rows.findIndex((r) => r.id === id);
    if (idx < 0) return;
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= rows.length) return;
    const a = rows[idx];
    const b = rows[swapIdx];
    await supabase.from("news_items").update({ position: b.position }).eq("id", a.id);
    await supabase.from("news_items").update({ position: a.position }).eq("id", b.id);
    revalidatePath("/admin/news");
    redirect("/admin/news?success=Order%20updated");
  }

  async function updateNews(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "").trim();
    const title_en = String(formData.get("title_en") ?? "").trim();
    const title_te = String(formData.get("title_te") ?? "").trim() || null;
    if (!id || !title_en) return;
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    await supabase.from("news_items").update({ title_en, title_te }).eq("id", id);
    revalidatePath("/admin/news");
    redirect("/admin/news?success=News%20updated");
  }

  return (
    <div className="space-y-6">
      {successMsg ? (
        <div className="rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {successMsg}
        </div>
      ) : null}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">News</h1>
        <span className="text-sm text-muted-foreground">{items.length} items</span>
      </div>

      <form action={createNews} className="rounded border p-4 space-y-3">
        <div className="text-sm font-medium">Create News</div>
        <div className="grid gap-3 sm:grid-cols-2">
          <input name="title_en" placeholder="Title (EN)" className="rounded border px-3 py-2" required />
          <input name="title_te" placeholder="Title (TE)" className="rounded border px-3 py-2" />
        </div>
        <button type="submit" className="rounded bg-primary px-4 py-2 text-white">Create</button>
      </form>

      <div className="overflow-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">EN</th>
              <th className="px-3 py-2">TE</th>
              <th className="px-3 py-2">Edit</th>
              <th className="px-3 py-2">Published</th>
              <th className="px-3 py-2">Updated</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((n, i) => (
              <tr key={n.id} className="border-t">
                <td className="px-3 py-2 whitespace-nowrap">{n.position}</td>
                <td className="px-3 py-2">{n.title_en}</td>
                <td className="px-3 py-2">{n.title_te ?? ""}</td>
                <td className="px-3 py-2">
                  <form action={updateNews} className="grid gap-2 sm:grid-cols-2">
                    <input type="hidden" name="id" defaultValue={n.id as string} />
                    <input name="title_en" defaultValue={(n.title_en ?? "") as string} className="rounded border px-2 py-1" />
                    <input name="title_te" defaultValue={(n.title_te ?? "") as string} className="rounded border px-2 py-1" />
                    <button className="rounded bg-primary px-3 py-1 text-white">Save</button>
                  </form>
                </td>
                <td className="px-3 py-2">{n.is_published ? "Yes" : "No"}</td>
                <td className="px-3 py-2">{n.updated_at ? new Date(n.updated_at as unknown as string).toLocaleString() : ""}</td>
                <td className="px-3 py-2 space-x-2 whitespace-nowrap">
                  <form action={togglePublish.bind(null, n.id as string, n.is_published as boolean)} className="inline"><button className="rounded border px-2 py-1">{n.is_published ? "Unpublish" : "Publish"}</button></form>
                  <form action={delNews.bind(null, n.id as string)} className="inline"><button className="rounded border px-2 py-1">Delete</button></form>
                  <form action={move.bind(null, n.id as string, "up")} className="inline"><button disabled={i===0} className="rounded border px-2 py-1 disabled:opacity-50">Up</button></form>
                  <form action={move.bind(null, n.id as string, "down")} className="inline"><button disabled={i===items.length-1} className="rounded border px-2 py-1 disabled:opacity-50">Down</button></form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
