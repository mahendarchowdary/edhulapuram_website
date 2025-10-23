import { getServerSupabaseClient, getServiceSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function slugify(input: string) {
  return input
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function fetchProjects() {
  const supabase = await getServerSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select("id,slug,name,description,cost,completion,status,position,updated_at")
    .order("position", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

async function fetchProjectGalleries(projectIds: string[]) {
  if (projectIds.length === 0) return [] as Array<{ id: string; project_id: string; image_url: string; description: string | null; position: number | null }>;
  const supabase = await getServerSupabaseClient();
  const { data, error } = await supabase
    .from("project_gallery")
    .select("id,project_id,image_url,description,position")
    .in("project_id", projectIds)
    .order("position", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Array<{ id: string; project_id: string; image_url: string; description: string | null; position: number | null }>;
}

export default async function AdminProjectsPage({ searchParams }: { searchParams: Promise<{ success?: string }> }) {
  const items = await fetchProjects();
  const sp = await searchParams;
  const successMsg = sp?.success ? decodeURIComponent(sp.success) : undefined;
  const galleriesArr = await fetchProjectGalleries(items.map((p) => p.id as string));
  const galleriesByProject: Record<string, Array<{ id: string; project_id: string; image_url: string; description: string | null; position: number | null }>> = {};
  for (const g of galleriesArr) {
    if (!galleriesByProject[g.project_id]) galleriesByProject[g.project_id] = [];
    galleriesByProject[g.project_id].push(g);
  }

  // slugify moved to module scope

  async function saveAllProject(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "").trim();
    const slugRaw = String(formData.get("slug") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const status = String(formData.get("status") ?? "").trim() || null;
    const description = String(formData.get("description") ?? "").trim() || null;
    const cost = String(formData.get("cost") ?? "").trim() || null;
    const completionStr = String(formData.get("completion") ?? "").trim();
    const completion = completionStr ? Number(completionStr) : null;
    const coverFile = formData.get("cover_file_all") as File | null;
    const galleryFiles = formData.getAll("gallery_files_all") as File[];
    const galleryUrlsRaw = String(formData.get("gallery_urls_all") ?? "").trim();
    if (!id || !name) return;
    const slug = slugify(slugRaw || name);

    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    // 1) Update core fields
    await supabase
      .from("projects")
      .update({ slug, name, description, cost, completion, status })
      .eq("id", id);

    // 2) Optional cover (position 1)
    if (coverFile && coverFile.size > 0) {
      const ext = (coverFile.name.split(".").pop() || "jpg").toLowerCase();
      const fileName = `${crypto.randomUUID()}.${ext}`;
      const path = `projects/${fileName}`;
      const { error: uploadErr, data: uploaded } = await supabase.storage
        .from("edhulapuram")
        .upload(path, coverFile, { contentType: coverFile.type || `image/${ext}`, upsert: false });
      if (!uploadErr && uploaded) {
        const { data: pub } = supabase.storage.from("edhulapuram").getPublicUrl(uploaded.path);
        await supabase.from("project_gallery").delete().eq("project_id", id).eq("position", 1);
        await supabase.from("project_gallery").insert({ project_id: id, image_url: pub.publicUrl, position: 1 });
      }
    }

    // Find current max position for gallery appends
    const { data: maxRows } = await supabase
      .from("project_gallery")
      .select("position")
      .eq("project_id", id)
      .order("position", { ascending: false })
      .limit(1);
    let nextPos = (maxRows?.[0]?.position ?? 1) + 1;

    // 3) Optional gallery files (append)
    for (const f of galleryFiles) {
      const file = f as File;
      if (!file || file.size === 0) continue;
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const fileName = `${crypto.randomUUID()}.${ext}`;
      const path = `projects/${fileName}`;
      const { error: uploadErr, data: uploaded } = await supabase.storage
        .from("edhulapuram")
        .upload(path, file, { contentType: file.type || `image/${ext}`, upsert: false });
      if (!uploadErr && uploaded) {
        const { data: pub } = supabase.storage.from("edhulapuram").getPublicUrl(uploaded.path);
        await supabase.from("project_gallery").insert({ project_id: id, image_url: pub.publicUrl, position: nextPos });
        nextPos += 1;
      }
    }

    // 4) Optional gallery URLs (line or comma separated)
    if (galleryUrlsRaw) {
      const urls = galleryUrlsRaw
        .split(/\r?\n|,/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      for (const u of urls) {
        await supabase.from("project_gallery").insert({ project_id: id, image_url: u, position: nextPos });
        nextPos += 1;
      }
    }

    revalidatePath("/admin/projects");
    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath(`/projects/${slug}`);
    redirect("/admin/projects?success=Changes%20saved");
  }

  async function createProject(formData: FormData) {
    "use server";
    const slugRaw = String(formData.get("slug") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim() || null;
    const cost = String(formData.get("cost") ?? "").trim() || null;
    const completionStr = String(formData.get("completion") ?? "").trim();
    const completion = completionStr ? Number(completionStr) : null;
    const status = String(formData.get("status") ?? "").trim() || null;
    if (!name) return;
    const slug = slugify(slugRaw || name);
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    const { data: maxRows } = await supabase.from("projects").select("position").order("position", { ascending: false }).limit(1);
    const nextPos = (maxRows?.[0]?.position ?? 0) + 1;
    await supabase.from("projects").insert({ slug, name, description, cost, completion, status, position: nextPos });
    revalidatePath("/admin/projects");
    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath(`/projects/${slug}`);
    redirect("/admin/projects?success=Project%20created");
  }

  async function addGalleryFiles(formData: FormData) {
    "use server";
    const project_id = String(formData.get("project_id") ?? "").trim();
    const files = formData.getAll("images") as File[];
    if (!project_id || files.length === 0) return;
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    const { data: maxRows } = await supabase
      .from("project_gallery")
      .select("position")
      .eq("project_id", project_id)
      .order("position", { ascending: false })
      .limit(1);
    let nextPos = (maxRows?.[0]?.position ?? 1) + 1;
    for (const file of files) {
      if (!file || file.size === 0) continue;
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const fileName = `${crypto.randomUUID()}.${ext}`;
      const path = `projects/${fileName}`;
      const { error: uploadErr, data: uploaded } = await supabase.storage
        .from("edhulapuram")
        .upload(path, file, { contentType: file.type || `image/${ext}`, upsert: false });
      if (uploadErr) continue;
      const { data: pub } = supabase.storage.from("edhulapuram").getPublicUrl(uploaded.path);
      await supabase.from("project_gallery").insert({ project_id, image_url: pub.publicUrl, position: nextPos });
      nextPos += 1;
    }
    revalidatePath("/admin/projects");
    revalidatePath("/");
    revalidatePath("/projects");
    redirect("/admin/projects?success=Gallery%20images%20added");
  }

  async function delGalleryItem(id: string) {
    "use server";
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    await supabase.from("project_gallery").delete().eq("id", id);
    revalidatePath("/admin/projects");
    revalidatePath("/");
    revalidatePath("/projects");
    redirect("/admin/projects?success=Gallery%20item%20deleted");
  }

  async function moveGalleryItem(project_id: string, id: string, dir: "up" | "down") {
    "use server";
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    const { data: rows } = await supabase
      .from("project_gallery")
      .select("id,position")
      .eq("project_id", project_id)
      .order("position", { ascending: true });
    if (!rows) return;
    const idx = rows.findIndex((r) => r.id === id);
    if (idx < 0) return;
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= rows.length) return;
    const a = rows[idx]!;
    const b = rows[swapIdx]!;
    await supabase.from("project_gallery").update({ position: b.position }).eq("id", a.id);
    await supabase.from("project_gallery").update({ position: a.position }).eq("id", b.id);
    revalidatePath("/admin/projects");
    revalidatePath("/");
    revalidatePath("/projects");
    redirect("/admin/projects?success=Gallery%20reordered");
  }

  async function del(id: string) {
    "use server";
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    await supabase.from("projects").delete().eq("id", id);
    revalidatePath("/admin/projects");
    revalidatePath("/");
    revalidatePath("/projects");
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
    const slugRaw = String(formData.get("slug") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim() || null;
    const cost = String(formData.get("cost") ?? "").trim() || null;
    const completionStr = String(formData.get("completion") ?? "").trim();
    const completion = completionStr ? Number(completionStr) : null;
    const status = String(formData.get("status") ?? "").trim() || null;
    const slug = slugify(slugRaw || name);
    if (!id || !slug || !name) return;
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    await supabase
      .from("projects")
      .update({ slug, name, description, cost, completion, status })
      .eq("id", id);
    revalidatePath("/admin/projects");
    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath(`/projects/${slug}`);
    redirect("/admin/projects?success=Project%20updated");
  }

  async function uploadCover(formData: FormData) {
    "use server";
    const project_id = String(formData.get("project_id") ?? "").trim();
    const file = formData.get("cover_file") as File | null;
    if (!project_id || !file || file.size === 0) return;
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const path = `projects/${fileName}`;
    const { error: uploadErr, data: uploaded } = await supabase.storage
      .from("edhulapuram")
      .upload(path, file, { contentType: file.type || `image/${ext}`, upsert: false });
    if (uploadErr) throw uploadErr;
    const { data: pub } = supabase.storage.from("edhulapuram").getPublicUrl(uploaded.path);
    const image_url = pub.publicUrl;
    // Replace cover at position 1
    await supabase.from("project_gallery").delete().eq("project_id", project_id).eq("position", 1);
    await supabase.from("project_gallery").insert({ project_id, image_url, position: 1 });
    revalidatePath("/admin/projects");
    revalidatePath("/");
    revalidatePath("/projects");
    redirect("/admin/projects?success=Cover%20updated");
  }

  async function addGalleryItem(formData: FormData) {
    "use server";
    const project_id = String(formData.get("project_id") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim() || null;
    const image_url_input = String(formData.get("image_url") ?? "").trim() || null;
    const file = formData.get("image_file") as File | null;
    if (!project_id) return;
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    // Find next position for this project's gallery
    const { data: maxRows } = await supabase
      .from("project_gallery")
      .select("position")
      .eq("project_id", project_id)
      .order("position", { ascending: false })
      .limit(1);
    const nextPos = (maxRows?.[0]?.position ?? 1) + 1;

    let image_url = image_url_input;
    if (file && file.size > 0) {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const fileName = `${crypto.randomUUID()}.${ext}`;
      const path = `projects/${fileName}`;
      const { error: uploadErr, data: uploaded } = await supabase.storage
        .from("edhulapuram")
        .upload(path, file, { contentType: file.type || `image/${ext}`, upsert: false });
      if (uploadErr) throw uploadErr;
      const { data: pub } = supabase.storage.from("edhulapuram").getPublicUrl(uploaded.path);
      image_url = pub.publicUrl;
    }
    if (!image_url) return;
    await supabase.from("project_gallery").insert({ project_id, image_url, description, position: nextPos });
    revalidatePath("/admin/projects");
    revalidatePath("/");
    revalidatePath("/projects");
    redirect("/admin/projects?success=Gallery%20image%20added");
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
                  <form action={saveAllProject} className="grid gap-2 sm:grid-cols-3">
                    <input type="hidden" name="id" defaultValue={n.id as string} />
                    <input name="slug" defaultValue={n.slug as string} className="rounded border px-2 py-1" />
                    <input name="name" defaultValue={n.name as string} className="rounded border px-2 py-1" />
                    <input name="status" defaultValue={(n.status ?? "") as string} className="rounded border px-2 py-1" />
                    <input name="description" defaultValue={(n.description ?? "") as string} className="rounded border px-2 py-1 sm:col-span-3" />
                    <input name="cost" defaultValue={(n.cost ?? "") as string} className="rounded border px-2 py-1" />
                    <input name="completion" defaultValue={(n.completion ?? 0) as any} className="rounded border px-2 py-1" />
                    <div className="sm:col-span-3 grid gap-2 sm:grid-cols-3 items-center">
                      <div className="text-xs text-muted-foreground sm:col-span-3">Cover photo (used on project cards)</div>
                      <input type="file" name="cover_file_all" accept="image/*" className="rounded border px-2 py-1 sm:col-span-3" />
                      <div className="text-xs text-muted-foreground sm:col-span-3">Gallery (detail page)</div>
                      <input type="file" name="gallery_files_all" accept="image/*" multiple className="rounded border px-2 py-1 sm:col-span-2" />
                      <textarea name="gallery_urls_all" placeholder="Or paste image URLs (one per line or comma separated)" className="rounded border px-2 py-1 sm:col-span-1" />
                    </div>
                    <button className="rounded bg-primary px-3 py-1 text-white">Save All</button>
                  </form>
                  <form action={uploadCover} className="mt-2 flex items-center gap-2">
                    <input type="hidden" name="project_id" defaultValue={n.id as string} />
                    <input type="file" name="cover_file" accept="image/*" className="rounded border px-2 py-1" />
                    <button className="rounded border px-3 py-1">Upload Cover</button>
                  </form>
                  <form action={addGalleryItem} className="mt-2 grid gap-2 sm:grid-cols-3">
                    <input type="hidden" name="project_id" defaultValue={n.id as string} />
                    <input name="image_url" placeholder="Gallery image URL (optional)" className="rounded border px-2 py-1 sm:col-span-2" />
                    <input type="file" name="image_file" accept="image/*" className="rounded border px-2 py-1 sm:col-span-1" />
                    <input name="description" placeholder="Description (optional)" className="rounded border px-2 py-1 sm:col-span-3" />
                    <button className="rounded border px-3 py-1 sm:col-span-1">Add to Gallery</button>
                  </form>
                  <form action={addGalleryFiles} className="mt-2 flex items-center gap-2">
                    <input type="hidden" name="project_id" defaultValue={n.id as string} />
                    <input type="file" name="images" accept="image/*" multiple className="rounded border px-2 py-1" />
                    <button className="rounded border px-3 py-1">Add Multiple</button>
                  </form>
                  <div className="mt-3 rounded border p-2">
                    <div className="text-xs font-medium mb-2">Gallery Items</div>
                    <ul className="space-y-2">
                      {(galleriesByProject[n.id as string] ?? []).map((g, gi) => (
                        <li key={g.id} className="flex items-center gap-2">
                          <img src={g.image_url} alt="" className="h-10 w-16 rounded object-cover" />
                          <span className="text-xs text-muted-foreground">#{g.position ?? gi + 1}</span>
                          <div className="ml-auto space-x-2">
                            <form action={moveGalleryItem.bind(null, n.id as string, g.id, "up")} className="inline"><button className="rounded border px-2 py-1 text-xs">Up</button></form>
                            <form action={moveGalleryItem.bind(null, n.id as string, g.id, "down")} className="inline"><button className="rounded border px-2 py-1 text-xs">Down</button></form>
                            <form action={delGalleryItem.bind(null, g.id)} className="inline"><button className="rounded border px-2 py-1 text-xs">Delete</button></form>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
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
