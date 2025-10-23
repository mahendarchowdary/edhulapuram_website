import { getServerSupabaseClient, getServiceSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function fetchOfficials(includeDeleted: boolean) {
  const supabase = await getServerSupabaseClient();
  let query = supabase
    .from("key_officials")
    .select("id,name,designation,description,image_url,position,updated_at,deleted_at")
    .order("position", { ascending: true });
  if (!includeDeleted) {
    query = query.is("deleted_at", null);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export default async function AdminKeyOfficialsPage({ searchParams }: { searchParams: Promise<{ success?: string; error?: string; showDeleted?: string }> }) {
  const sp = await searchParams;
  const includeDeleted = sp?.showDeleted === "1";
  const successMsg = sp?.success ? decodeURIComponent(sp.success) : undefined;
  const errorMsg = sp?.error ? decodeURIComponent(sp.error) : undefined;
  const items = await fetchOfficials(includeDeleted);

  async function createOfficial(formData: FormData) {
    "use server";
    const name = String(formData.get("name") ?? "").trim();
    const designation = String(formData.get("designation") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim() || null;
    // Normalize optional manual image URL/path
    let imageUrlInput = String(formData.get("image_url") ?? "").trim() || null;
    if (imageUrlInput) {
      if (imageUrlInput.startsWith("public/images/")) imageUrlInput = "/" + imageUrlInput.replace(/^public\//, "");
      else if (imageUrlInput.startsWith("images/")) imageUrlInput = "/" + imageUrlInput;
      else if (imageUrlInput.startsWith("/images/")) {
        // already normalized
      } else {
        // external or supabase URL, leave as is
      }
    }
    const file = formData.get("image_file") as File | null;
    if (!name || !designation) return;
    try {
      const supabase = getServiceSupabaseClient({ useServiceRole: true });
      const { data: maxRows } = await supabase
        .from("key_officials")
        .select("position")
        .order("position", { ascending: false })
        .limit(1);
      const nextPos = (maxRows?.[0]?.position ?? 0) + 1;

      let image_url = imageUrlInput;
      if (file && file.size > 0) {
        const buf = new Uint8Array(await file.arrayBuffer());
        const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
        const fileName = `${crypto.randomUUID()}.${ext}`;
        const { data: uploaded } = await supabase.storage
          .from("edhulapuram")
          .upload(`key-officials/${fileName}`, buf, { contentType: file.type || `image/${ext}`, upsert: false });
        if (uploaded?.path) {
          const { data: pub } = supabase.storage.from("edhulapuram").getPublicUrl(uploaded.path);
          image_url = pub.publicUrl;
        }
      }

      await supabase.from("key_officials").insert({ name, designation, description, image_url, position: nextPos });
      revalidatePath("/admin/key-officials");
      revalidatePath("/");
      redirect("/admin/key-officials?success=Official%20created");
    } catch (e: any) {
      const msg = encodeURIComponent(e?.message ?? "Create failed");
      redirect(`/admin/key-officials?error=${msg}`);
    }
  }

  async function updateOfficial(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const designation = String(formData.get("designation") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim() || null;
    // Normalize image_url field
    let image_url = String(formData.get("image_url") ?? "").trim() || null;
    if (image_url) {
      if (image_url.startsWith("public/images/")) image_url = "/" + image_url.replace(/^public\//, "");
      else if (image_url.startsWith("images/")) image_url = "/" + image_url;
      else if (image_url.startsWith("/images/")) {
        // ok
      } else {
        // external or supabase URL, leave as is
      }
    }
    if (!id || !name || !designation) return;
    try {
      const supabase = getServiceSupabaseClient({ useServiceRole: true });
      await supabase.from("key_officials").update({ name, designation, description, image_url }).eq("id", id);
      revalidatePath("/admin/key-officials");
      revalidatePath("/");
      redirect("/admin/key-officials?success=Official%20updated");
    } catch (e: any) {
      const msg = encodeURIComponent(e?.message ?? "Update failed");
      redirect(`/admin/key-officials?error=${msg}`);
    }
  }

  async function uploadImage(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "").trim();
    const file = formData.get("image_file") as File | null;
    if (!id || !file || file.size === 0) return;
    try {
      const supabase = getServiceSupabaseClient({ useServiceRole: true });
      const buf = new Uint8Array(await file.arrayBuffer());
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const fileName = `${crypto.randomUUID()}.${ext}`;
      const { data: uploaded } = await supabase.storage
        .from("edhulapuram")
        .upload(`key-officials/${fileName}`, buf, { contentType: file.type || `image/${ext}`, upsert: false });
      if (uploaded?.path) {
        const { data: pub } = supabase.storage.from("edhulapuram").getPublicUrl(uploaded.path);
        await supabase.from("key_officials").update({ image_url: pub.publicUrl }).eq("id", id);
      }
      revalidatePath("/admin/key-officials");
      revalidatePath("/");
      redirect("/admin/key-officials?success=Image%20updated");
    } catch (e: any) {
      const msg = encodeURIComponent(e?.message ?? "Upload failed");
      redirect(`/admin/key-officials?error=${msg}`);
    }
  }

  async function softDelete(id: string) {
    "use server";
    try {
      const supabase = getServiceSupabaseClient({ useServiceRole: true });
      await supabase.from("key_officials").update({ deleted_at: new Date().toISOString() as any }).eq("id", id);
      revalidatePath("/admin/key-officials");
      revalidatePath("/");
      redirect("/admin/key-officials?success=Official%20deleted");
    } catch (e: any) {
      const msg = encodeURIComponent(e?.message ?? "Delete failed");
      redirect(`/admin/key-officials?error=${msg}`);
    }
  }

  async function restore(id: string) {
    "use server";
    try {
      const supabase = getServiceSupabaseClient({ useServiceRole: true });
      await supabase.from("key_officials").update({ deleted_at: null as any }).eq("id", id);
      revalidatePath("/admin/key-officials");
      revalidatePath("/");
      redirect("/admin/key-officials?success=Official%20restored");
    } catch (e: any) {
      const msg = encodeURIComponent(e?.message ?? "Restore failed");
      redirect(`/admin/key-officials?error=${msg}`);
    }
  }

  async function move(id: string, dir: "up" | "down") {
    "use server";
    try {
      const supabase = getServiceSupabaseClient({ useServiceRole: true });
      const { data: rows } = await supabase
        .from("key_officials")
        .select("id,position")
        .is("deleted_at", null)
        .order("position", { ascending: true });
      if (!rows) return;
      const idx = rows.findIndex((r) => r.id === id);
      if (idx < 0) return;
      const swapIdx = dir === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= rows.length) return;
      const a = rows[idx];
      const b = rows[swapIdx];
      await supabase.from("key_officials").update({ position: b.position }).eq("id", a.id);
      await supabase.from("key_officials").update({ position: a.position }).eq("id", b.id);
      revalidatePath("/admin/key-officials");
      revalidatePath("/");
      redirect("/admin/key-officials?success=Order%20updated");
    } catch (e: any) {
      const msg = encodeURIComponent(e?.message ?? "Reorder failed");
      redirect(`/admin/key-officials?error=${msg}`);
    }
  }

  return (
    <div className="space-y-6">
      {successMsg ? (
        <div className="rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{successMsg}</div>
      ) : null}
      {errorMsg ? (
        <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{errorMsg}</div>
      ) : null}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Key Officials</h1>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">{items.length} items</span>
          <a className="rounded border px-2 py-1" href={includeDeleted ? "/admin/key-officials" : "/admin/key-officials?showDeleted=1"}>
            {includeDeleted ? "Hide deleted" : "Show deleted"}
          </a>
        </div>
      </div>

      <form action={createOfficial} className="rounded border p-4 space-y-3">
        <div className="text-sm font-medium">Create Official</div>
        <div className="grid gap-3 sm:grid-cols-6">
          <input name="name" placeholder="Name" className="rounded border px-3 py-2" required />
          <input name="designation" placeholder="Designation" className="rounded border px-3 py-2" required />
          <input name="description" placeholder="Description (optional)" className="rounded border px-3 py-2 sm:col-span-2" />
          <input name="image_url" placeholder="Image URL (optional)" className="rounded border px-3 py-2" />
          <input name="image_file" type="file" accept="image/*" className="rounded border px-3 py-2" />
          <button type="submit" className="rounded bg-primary px-4 py-2 text-white">Create</button>
        </div>
      </form>

      <div className="overflow-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Photo</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Designation</th>
              <th className="px-3 py-2">Edit</th>
              <th className="px-3 py-2">Updated</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((n: any, i: number) => (
              <tr key={n.id} className={`border-t ${n.deleted_at ? "opacity-60" : ""}`}>
                <td className="px-3 py-2 whitespace-nowrap">{n.position}</td>
                <td className="px-3 py-2">
                  {n.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={n.image_url} alt={n.name} className="h-12 w-12 rounded object-cover" />
                  ) : null}
                </td>
                <td className="px-3 py-2">{n.name}</td>
                <td className="px-3 py-2">{n.designation}</td>
                <td className="px-3 py-2">
                  <form action={updateOfficial} className="grid gap-2 sm:grid-cols-3">
                    <input type="hidden" name="id" defaultValue={n.id as string} />
                    <input name="name" defaultValue={(n.name ?? "") as string} className="rounded border px-2 py-1" />
                    <input name="designation" defaultValue={(n.designation ?? "") as string} className="rounded border px-2 py-1" />
                    <input name="description" defaultValue={(n.description ?? "") as string} className="rounded border px-2 py-1 sm:col-span-3" />
                    <input name="image_url" defaultValue={(n.image_url ?? "") as string} className="rounded border px-2 py-1 sm:col-span-2" />
                    <button className="rounded bg-primary px-3 py-1 text-white">Save</button>
                  </form>
                  <form action={uploadImage} className="mt-2 flex items-center gap-2">
                    <input type="hidden" name="id" defaultValue={n.id as string} />
                    <input type="file" name="image_file" accept="image/*" className="rounded border px-2 py-1" />
                    <button className="rounded border px-3 py-1">Upload Image</button>
                  </form>
                </td>
                <td className="px-3 py-2">{n.updated_at ? new Date(n.updated_at as string).toLocaleString() : ""}</td>
                <td className="px-3 py-2 space-x-2 whitespace-nowrap">
                  {!n.deleted_at ? (
                    <>
                      <form action={softDelete.bind(null, n.id as string)} className="inline"><button className="rounded border px-2 py-1">Delete</button></form>
                      <form action={move.bind(null, n.id as string, "up")} className="inline"><button disabled={i===0} className="rounded border px-2 py-1 disabled:opacity-50">Up</button></form>
                      <form action={move.bind(null, n.id as string, "down")} className="inline"><button disabled={i===items.length-1} className="rounded border px-2 py-1 disabled:opacity-50">Down</button></form>
                    </>
                  ) : (
                    <form action={restore.bind(null, n.id as string)} className="inline"><button className="rounded border px-2 py-1">Restore</button></form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
