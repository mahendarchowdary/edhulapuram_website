import { getServerSupabaseClient, getServiceSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function fetchEvents() {
  const supabase = await getServerSupabaseClient();
  const { data, error } = await supabase
    .from("events")
    .select("id,title,event_date,description,cover_image_url,position,updated_at")
    .order("position", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export default async function AdminEventsPage({ searchParams }: { searchParams: Promise<{ success?: string; error?: string }> }) {
  const items = await fetchEvents();
  const sp = await searchParams;
  const successMsg = sp?.success ? decodeURIComponent(sp.success) : undefined;

  async function createEvent(formData: FormData) {
    "use server";
    const title = String(formData.get("title") ?? "").trim();
    const event_date = String(formData.get("event_date") ?? "").trim() || null;
    const description = String(formData.get("description") ?? "").trim() || null;
    const cover_image_url_input = String(formData.get("cover_image_url") ?? "").trim() || null;
    const coverFile = formData.get("cover_image_file") as File | null;
    if (!title) return;
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    const { data: maxRows } = await supabase.from("events").select("position").order("position", { ascending: false }).limit(1);
    const nextPos = (maxRows?.[0]?.position ?? 0) + 1;
    let cover_image_url = cover_image_url_input;
    try {
      if (coverFile && coverFile.size > 0) {
        const arrayBuffer = await coverFile.arrayBuffer();
        const fileBytes = new Uint8Array(arrayBuffer);
        const ext = (coverFile.name.split(".").pop() || "png").toLowerCase();
        const fileName = `${crypto.randomUUID()}.${ext}`;
        const { data: uploaded, error: uploadErr } = await supabase.storage.from("edhulapuram").upload(`events/${fileName}`, fileBytes, {
          contentType: coverFile.type || `image/${ext}`,
          upsert: false,
        });
        if (uploadErr) throw uploadErr;
        if (uploaded?.path) {
          const { data: pub } = supabase.storage.from("edhulapuram").getPublicUrl(uploaded.path);
          cover_image_url = pub.publicUrl;
        }
      }
    } catch (e) {
      // fallback to provided URL if upload fails
      cover_image_url = cover_image_url_input;
    }

    await supabase.from("events").insert({ title, event_date, description, cover_image_url, position: nextPos });
    revalidatePath("/admin/events");
    revalidatePath("/");
    revalidatePath("/events");
    redirect("/admin/events?success=Event%20created");
  }

  async function del(id: string) {
    "use server";
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    await supabase.from("events").delete().eq("id", id);
    revalidatePath("/admin/events");
    revalidatePath("/");
    revalidatePath("/events");
    redirect("/admin/events?success=Event%20deleted");
  }

  async function move(id: string, dir: "up" | "down") {
    "use server";
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    const { data: rows } = await supabase.from("events").select("id,position").order("position", { ascending: true });
    if (!rows) return;
    const idx = rows.findIndex((r) => r.id === id);
    if (idx < 0) return;
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= rows.length) return;
    const a = rows[idx];
    const b = rows[swapIdx];
    await supabase.from("events").update({ position: b.position }).eq("id", a.id);
    await supabase.from("events").update({ position: a.position }).eq("id", b.id);
    revalidatePath("/admin/events");
    revalidatePath("/");
    revalidatePath("/events");
    redirect("/admin/events?success=Order%20updated");
  }

  async function updateEvent(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "").trim();
    const title = String(formData.get("title") ?? "").trim();
    const event_date = String(formData.get("event_date") ?? "").trim() || null;
    const description = String(formData.get("description") ?? "").trim() || null;
    const cover_image_url = String(formData.get("cover_image_url") ?? "").trim() || null;
    if (!id || !title) return;
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    await supabase.from("events").update({ title, event_date, description, cover_image_url }).eq("id", id);
    revalidatePath("/admin/events");
    revalidatePath("/");
    revalidatePath("/events");
    redirect("/admin/events?success=Event%20updated");
  }

  async function uploadCover(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "").trim();
    const file = formData.get("cover_file") as File | null;
    if (!id || !file || file.size === 0) return;
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    const arrayBuffer = await file.arrayBuffer();
    const fileBytes = new Uint8Array(arrayBuffer);
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const { data: uploaded, error: uploadErr } = await supabase.storage.from("edhulapuram").upload(`events/${fileName}`, fileBytes, {
      contentType: file.type || `image/${ext}`,
      upsert: false,
    });
    if (uploadErr) throw uploadErr;
    const { data: pub } = supabase.storage.from("edhulapuram").getPublicUrl(uploaded.path);
    await supabase.from("events").update({ cover_image_url: pub.publicUrl }).eq("id", id);
    revalidatePath("/admin/events");
    revalidatePath("/");
    revalidatePath("/events");
    redirect("/admin/events?success=Cover%20updated");
  }

  return (
    <div className="space-y-6">
      {successMsg ? (
        <div className="rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {successMsg}
        </div>
      ) : null}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Events</h1>
        <span className="text-sm text-muted-foreground">{items.length} items</span>
      </div>

      <form action={createEvent} className="rounded border p-4 space-y-3">
        <div className="text-sm font-medium">Create Event</div>
        <div className="grid gap-3 sm:grid-cols-5">
          <input name="title" placeholder="Title" className="rounded border px-3 py-2" required />
          <input name="event_date" placeholder="Date (YYYY-MM-DD)" className="rounded border px-3 py-2" />
          <input name="description" placeholder="Description" className="rounded border px-3 py-2" />
          <input name="cover_image_url" placeholder="Cover image URL (optional)" className="rounded border px-3 py-2" />
          <input name="cover_image_file" type="file" accept="image/*" className="rounded border px-3 py-2" />
          <button type="submit" className="rounded bg-primary px-4 py-2 text-white">Create</button>
        </div>
      </form>

      <div className="overflow-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Edit</th>
              <th className="px-3 py-2">Updated</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((n, i) => (
              <tr key={n.id} className="border-t">
                <td className="px-3 py-2 whitespace-nowrap">{n.position}</td>
                <td className="px-3 py-2">{n.title}</td>
                <td className="px-3 py-2">{n.event_date ?? ""}</td>
                <td className="px-3 py-2">
                  <form action={updateEvent} className="grid gap-2 sm:grid-cols-2">
                    <input type="hidden" name="id" defaultValue={n.id as string} />
                    <input name="title" defaultValue={(n.title ?? "") as string} className="rounded border px-2 py-1" />
                    <input name="event_date" defaultValue={(n.event_date ?? "") as string} className="rounded border px-2 py-1" />
                    <input name="description" defaultValue={(n.description ?? "") as string} className="rounded border px-2 py-1 sm:col-span-2" />
                    <input name="cover_image_url" defaultValue={(n.cover_image_url ?? "") as string} className="rounded border px-2 py-1 sm:col-span-2" />
                    <button className="rounded bg-primary px-3 py-1 text-white">Save</button>
                  </form>
                  <form action={uploadCover} className="mt-2 flex items-center gap-2">
                    <input type="hidden" name="id" defaultValue={n.id as string} />
                    <input type="file" name="cover_file" accept="image/*" className="rounded border px-2 py-1" />
                    <button className="rounded border px-3 py-1">Upload Cover</button>
                  </form>
                </td>
                <td className="px-3 py-2">{n.updated_at ? new Date(n.updated_at as unknown as string).toLocaleString() : ""}</td>
                <td className="px-3 py-2 space-x-2 whitespace-nowrap">
                  <form action={del.bind(null, n.id as string)} className="inline"><button className="rounded border px-2 py-1">Delete</button></form>
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
