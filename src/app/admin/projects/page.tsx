import { getServerSupabaseClient, getServiceSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function fetchProjects() {
  const supabase = await getServerSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select("id,slug,name,description,cost,completion,status,position,updated_at")
    .order("position", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export default async function AdminProjectsPage({ searchParams }: { searchParams: Promise<{ success?: string }> }) {
  const items = await fetchProjects();
  const sp = await searchParams;
  const successMsg = sp?.success ? decodeURIComponent(sp.success) : undefined;

  async function createProject(formData: FormData) {
    "use server";
    const slug = String(formData.get("slug") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim() || null;
    const cost = String(formData.get("cost") ?? "").trim() || null;
    const completionStr = String(formData.get("completion") ?? "").trim();
    const completion = completionStr ? Number(completionStr) : null;
    const status = String(formData.get("status") ?? "").trim() || null;
    if (!slug || !name) return;
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    const { data: maxRows } = await supabase.from("projects").select("position").order("position", { ascending: false }).limit(1);
    const nextPos = (maxRows?.[0]?.position ?? 0) + 1;
    await supabase.from("projects").insert({ slug, name, description, cost, completion, status, position: nextPos });
    revalidatePath("/admin/projects");
    redirect("/admin/projects?success=Project%20created");
  }

  async function del(id: string) {
    "use server";
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    await supabase.from("projects").delete().eq("id", id);
    revalidatePath("/admin/projects");
    redirect("/admin/projects?success=Project%20deleted");
  }

  async function move(id: string, dir: "up" | "down") {
    "use server";
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    const { data: rows } = await supabase.from("projects").select("id,position").order("position", { ascending: true });
    if (!rows) return;
    const idx = rows.findIndex((r) => r.id === id);
    if (idx < 0) return;
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= rows.length) return;
    const a = rows[idx];
    const b = rows[swapIdx];
    await supabase.from("projects").update({ position: b.position }).eq("id", a.id);
    await supabase.from("projects").update({ position: a.position }).eq("id", b.id);
    revalidatePath("/admin/projects");
  }

  async function updateProject(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim() || null;
    const cost = String(formData.get("cost") ?? "").trim() || null;
    const completionStr = String(formData.get("completion") ?? "").trim();
    const completion = completionStr ? Number(completionStr) : null;
    const status = String(formData.get("status") ?? "").trim() || null;
    if (!id || !slug || !name) return;
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    await supabase
      .from("projects")
      .update({ slug, name, description, cost, completion, status })
      .eq("id", id);
    revalidatePath("/admin/projects");
    redirect("/admin/projects?success=Project%20updated");
  }

  async function uploadCover(formData: FormData) {
    "use server";
    const project_id = String(formData.get("project_id") ?? "").trim();
    const file = formData.get("cover_file") as File | null;
    if (!project_id || !file || file.size === 0) return;
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    const arrayBuffer = await file.arrayBuffer();
    const fileBytes = new Uint8Array(arrayBuffer);
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const path = `projects/${fileName}`;
    const { error: uploadErr, data: uploaded } = await supabase.storage
      .from("edhulapuram")
      .upload(path, fileBytes, { contentType: file.type || `image/${ext}`, upsert: false });
    if (uploadErr) throw uploadErr;
    const { data: pub } = supabase.storage.from("edhulapuram").getPublicUrl(uploaded.path);
    const image_url = pub.publicUrl;
    // Replace cover at position 1
    await supabase.from("project_gallery").delete().eq("project_id", project_id).eq("position", 1);
    await supabase.from("project_gallery").insert({ project_id, image_url, position: 1 });
    revalidatePath("/admin/projects");
    redirect("/admin/projects?success=Cover%20updated");
  }

  return (
    <div className="space-y-6">
      {successMsg ? (
        <div className="rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {successMsg}
        </div>
      ) : null}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <span className="text-sm text-muted-foreground">{items.length} items</span>
      </div>

      <form action={createProject} className="rounded border p-4 space-y-3">
        <div className="text-sm font-medium">Create Project</div>
        <div className="grid gap-3 sm:grid-cols-6">
          <input name="slug" placeholder="Slug" className="rounded border px-3 py-2" required />
          <input name="name" placeholder="Name" className="rounded border px-3 py-2" required />
          <input name="description" placeholder="Description" className="rounded border px-3 py-2" />
          <input name="cost" placeholder="Cost (e.g., ₹10,00,000)" className="rounded border px-3 py-2" />
          <input name="completion" placeholder="Completion %" className="rounded border px-3 py-2" />
          <input name="status" placeholder="Status" className="rounded border px-3 py-2" />
        </div>
        <button type="submit" className="rounded bg-primary px-4 py-2 text-white">Create</button>
      </form>

      <div className="overflow-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Slug</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Edit</th>
              <th className="px-3 py-2">Updated</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((n, i) => (
              <tr key={n.id} className="border-t">
                <td className="px-3 py-2 whitespace-nowrap">{n.position}</td>
                <td className="px-3 py-2">{n.slug}</td>
                <td className="px-3 py-2">{n.name}</td>
                <td className="px-3 py-2">{n.status ?? ""}</td>
                <td className="px-3 py-2">
                  <form action={updateProject} className="grid gap-2 sm:grid-cols-3">
                    <input type="hidden" name="id" defaultValue={n.id as string} />
                    <input name="slug" defaultValue={n.slug as string} className="rounded border px-2 py-1" />
                    <input name="name" defaultValue={n.name as string} className="rounded border px-2 py-1" />
                    <input name="status" defaultValue={(n.status ?? "") as string} className="rounded border px-2 py-1" />
                    <input name="description" defaultValue={(n.description ?? "") as string} className="rounded border px-2 py-1 sm:col-span-3" />
                    <input name="cost" defaultValue={(n.cost ?? "") as string} className="rounded border px-2 py-1" />
                    <input name="completion" defaultValue={(n.completion ?? 0) as any} className="rounded border px-2 py-1" />
                    <button className="rounded bg-primary px-3 py-1 text-white">Save</button>
                  </form>
                  <form action={uploadCover} className="mt-2 flex items-center gap-2">
                    <input type="hidden" name="project_id" defaultValue={n.id as string} />
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
