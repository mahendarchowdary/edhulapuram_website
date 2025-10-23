import { getServerSupabaseClient, getServiceSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function fetchHero() {
  const supabase = await getServerSupabaseClient();
  const { data: hero } = await supabase
    .from("hero_sections")
    .select("id,title,subtitle,background_image_url,updated_at")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!hero) return { hero: null as any, ctas: [] as any[] };
  const { data: ctas } = await supabase
    .from("hero_ctas")
    .select("id,text,href,variant,position,updated_at")
    .eq("hero_id", hero.id)
    .order("position", { ascending: true });
  return { hero, ctas: ctas ?? [] };
}

async function fetchSlides(includeDeleted: boolean) {
  const supabase = await getServerSupabaseClient();
  const sb: any = supabase as any;
  let q = sb
    .from("hero_slides")
    .select("id,image_url,alt,position,is_enabled,deleted_at,updated_at")
    .order("position", { ascending: true });
  if (!includeDeleted) q = q.is("deleted_at", null);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export default async function AdminHeroPage({ searchParams }: { searchParams: Promise<{ success?: string; error?: string; showDeleted?: string }> }) {
  const sp = await searchParams;
  const includeDeleted = sp?.showDeleted === "1";
  const successMsg = sp?.success ? decodeURIComponent(sp.success) : undefined;
  const errorMsg = sp?.error ? decodeURIComponent(sp.error) : undefined;
  const items = await fetchSlides(includeDeleted);
  const { hero, ctas } = await fetchHero();

  async function saveHero(formData: FormData) {
    "use server";
    const title = String(formData.get("title") ?? "").trim();
    const subtitle = String(formData.get("subtitle") ?? "").trim() || null;
    let background_image_url = String(formData.get("background_image_url") ?? "").trim() || null;
    const file = formData.get("image_file") as File | null;
    if (!title) return redirect("/admin/hero?error=" + encodeURIComponent("Title required"));
    try {
      const supabase = getServiceSupabaseClient({ useServiceRole: true });
      if (background_image_url) {
        if (background_image_url.startsWith("public/images/")) background_image_url = "/" + background_image_url.replace(/^public\//, "");
        else if (background_image_url.startsWith("images/")) background_image_url = "/" + background_image_url;
      }
      if (file && file.size > 0) {
        const buf = new Uint8Array(await file.arrayBuffer());
        const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
        const fileName = `${crypto.randomUUID()}.${ext}`;
        const { data: uploaded } = await supabase.storage
          .from("edhulapuram")
          .upload(`hero/${fileName}`, buf, { contentType: file.type || `image/${ext}`, upsert: false });
        if (uploaded?.path) {
          const { data: pub } = supabase.storage.from("edhulapuram").getPublicUrl(uploaded.path);
          background_image_url = pub.publicUrl;
        }
      }
      if (hero?.id) {
        await supabase.from("hero_sections").update({ title, subtitle, background_image_url }).eq("id", hero.id);
      } else {
        await supabase.from("hero_sections").insert({ title, subtitle, background_image_url });
      }
      revalidatePath("/admin/hero");
      redirect("/admin/hero?success=" + encodeURIComponent("Hero saved"));
    } catch (e: any) {
      redirect(`/admin/hero?error=${encodeURIComponent(e?.message ?? "Save failed")}`);
    }
  }

  async function createCta(formData: FormData) {
    "use server";
    const text = String(formData.get("text") ?? "").trim();
    const href = String(formData.get("href") ?? "").trim();
    const variant = String(formData.get("variant") ?? "default").trim() || null;
    const hero_id = String(formData.get("hero_id") ?? "").trim();
    if (!hero_id || !text || !href) return redirect("/admin/hero?error=" + encodeURIComponent("Text and link required"));
    try {
      const supabase = getServiceSupabaseClient({ useServiceRole: true });
      const sb: any = supabase as any;
      const { data: maxRows } = await supabase
        .from("hero_ctas")
        .select("position")
        .eq("hero_id", hero_id)
        .order("position", { ascending: false })
        .limit(1);
      const nextPos = (maxRows?.[0]?.position ?? 0) + 1;
      await supabase.from("hero_ctas").insert({ hero_id, text, href, variant, position: nextPos });
      revalidatePath("/admin/hero");
      redirect("/admin/hero?success=" + encodeURIComponent("CTA created"));
    } catch (e: any) {
      redirect(`/admin/hero?error=${encodeURIComponent(e?.message ?? "Create CTA failed")}`);
    }
  }

  async function updateCta(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "").trim();
    const text = String(formData.get("text") ?? "").trim();
    const href = String(formData.get("href") ?? "").trim();
    const variant = String(formData.get("variant") ?? "default").trim() || null;
    if (!id || !text || !href) return;
    try {
      const supabase = getServiceSupabaseClient({ useServiceRole: true });
      await supabase.from("hero_ctas").update({ text, href, variant }).eq("id", id);
      revalidatePath("/admin/hero");
      redirect("/admin/hero?success=" + encodeURIComponent("CTA updated"));
    } catch (e: any) {
      redirect(`/admin/hero?error=${encodeURIComponent(e?.message ?? "Update CTA failed")}`);
    }
  }

  async function deleteCta(id: string) {
    "use server";
    try {
      const supabase = getServiceSupabaseClient({ useServiceRole: true });
      await supabase.from("hero_ctas").delete().eq("id", id);
      revalidatePath("/admin/hero");
      redirect("/admin/hero?success=" + encodeURIComponent("CTA deleted"));
    } catch (e: any) {
      redirect(`/admin/hero?error=${encodeURIComponent(e?.message ?? "Delete CTA failed")}`);
    }
  }

  async function moveCta(id: string, dir: "up" | "down") {
    "use server";
    try {
      const supabase = getServiceSupabaseClient({ useServiceRole: true });
      const { data: rows } = await supabase
        .from("hero_ctas")
        .select("id,position,hero_id")
        .order("position", { ascending: true });
      if (!rows) return;
      const idx = rows.findIndex((r) => r.id === id);
      if (idx < 0) return;
      const heroId = rows[idx].hero_id;
      const filtered = rows.filter((r) => r.hero_id === heroId);
      const localIdx = filtered.findIndex((r) => r.id === id);
      const swapIdx = dir === "up" ? localIdx - 1 : localIdx + 1;
      if (swapIdx < 0 || swapIdx >= filtered.length) return;
      const a = filtered[localIdx];
      const b = filtered[swapIdx];
      await supabase.from("hero_ctas").update({ position: b.position }).eq("id", a.id);
      await supabase.from("hero_ctas").update({ position: a.position }).eq("id", b.id);
      revalidatePath("/admin/hero");
      redirect("/admin/hero?success=" + encodeURIComponent("CTA order updated"));
    } catch (e: any) {
      redirect(`/admin/hero?error=${encodeURIComponent(e?.message ?? "Reorder CTA failed")}`);
    }
  }

  async function createSlide(formData: FormData) {
    "use server";
    const altRaw = String(formData.get("alt") ?? "").trim();
    let imageUrlInput = String(formData.get("image_url") ?? "").trim() || null;
    const file = formData.get("image_file") as File | null;
    try {
      const supabase = getServiceSupabaseClient({ useServiceRole: true });
      const sb: any = supabase as any;
      const { data: maxRows } = await sb
        .from("hero_slides")
        .select("position")
        .order("position", { ascending: false })
        .limit(1);
      const nextPos = (maxRows?.[0]?.position ?? 0) + 1;

      // Normalize manual local path
      if (imageUrlInput) {
        if (imageUrlInput.startsWith("public/images/")) imageUrlInput = "/" + imageUrlInput.replace(/^public\//, "");
        else if (imageUrlInput.startsWith("images/")) imageUrlInput = "/" + imageUrlInput;
      }

      let image_url = imageUrlInput;
      if (file && file.size > 0) {
        const buf = new Uint8Array(await file.arrayBuffer());
        const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
        const fileName = `${crypto.randomUUID()}.${ext}`;
        const { data: uploaded } = await supabase.storage
          .from("edhulapuram")
          .upload(`hero/${fileName}`, buf, { contentType: file.type || `image/${ext}`, upsert: false });
        if (uploaded?.path) {
          const { data: pub } = supabase.storage.from("edhulapuram").getPublicUrl(uploaded.path);
          image_url = pub.publicUrl;
        }
      }

      await sb.from("hero_slides").insert({ image_url, alt: altRaw || null, position: nextPos, is_enabled: true });
      revalidatePath("/admin/hero");
      revalidatePath("/");
      redirect("/admin/hero?success=Slide%20created");
    } catch (e: any) {
      redirect(`/admin/hero?error=${encodeURIComponent(e?.message ?? "Create failed")}`);
    }
  }

  async function updateSlide(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "").trim();
    const altRaw = String(formData.get("alt") ?? "").trim() || null;
    const enabled = String(formData.get("is_enabled") ?? "true") === "true";
    let image_url = String(formData.get("image_url") ?? "").trim() || null;
    if (image_url) {
      if (image_url.startsWith("public/images/")) image_url = "/" + image_url.replace(/^public\//, "");
      else if (image_url.startsWith("images/")) image_url = "/" + image_url;
    }
    try {
      const supabase = getServiceSupabaseClient({ useServiceRole: true });
      const sb: any = supabase as any;
      await sb.from("hero_slides").update({ alt: altRaw, is_enabled: enabled, image_url }).eq("id", id);
      revalidatePath("/admin/hero");
      revalidatePath("/");
      redirect("/admin/hero?success=Slide%20updated");
    } catch (e: any) {
      redirect(`/admin/hero?error=${encodeURIComponent(e?.message ?? "Update failed")}`);
    }
  }

  async function uploadImage(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "").trim();
    const file = formData.get("image_file") as File | null;
    if (!id || !file || file.size === 0) return;
    try {
      const supabase = getServiceSupabaseClient({ useServiceRole: true });
      const sb: any = supabase as any;
      const buf = new Uint8Array(await file.arrayBuffer());
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const fileName = `${crypto.randomUUID()}.${ext}`;
      const { data: uploaded } = await supabase.storage
        .from("edhulapuram")
        .upload(`hero/${fileName}`, buf, { contentType: file.type || `image/${ext}`, upsert: false });
      if (uploaded?.path) {
        const { data: pub } = supabase.storage.from("edhulapuram").getPublicUrl(uploaded.path);
        await sb.from("hero_slides").update({ image_url: pub.publicUrl }).eq("id", id);
      }
      revalidatePath("/admin/hero");
      revalidatePath("/");
      redirect("/admin/hero?success=Image%20updated");
    } catch (e: any) {
      redirect(`/admin/hero?error=${encodeURIComponent(e?.message ?? "Upload failed")}`);
    }
  }

  async function softDelete(id: string) {
    "use server";
    try {
      const supabase = getServiceSupabaseClient({ useServiceRole: true });
      const sb: any = supabase as any;
      await sb.from("hero_slides").update({ deleted_at: new Date().toISOString() as any }).eq("id", id);
      revalidatePath("/admin/hero");
      revalidatePath("/");
      redirect("/admin/hero?success=Slide%20deleted");
    } catch (e: any) {
      redirect(`/admin/hero?error=${encodeURIComponent(e?.message ?? "Delete failed")}`);
    }
  }

  async function restore(id: string) {
    "use server";
    try {
      const supabase = getServiceSupabaseClient({ useServiceRole: true });
      const sb: any = supabase as any;
      await sb.from("hero_slides").update({ deleted_at: null as any }).eq("id", id);
      revalidatePath("/admin/hero");
      revalidatePath("/");
      redirect("/admin/hero?success=Slide%20restored");
    } catch (e: any) {
      redirect(`/admin/hero?error=${encodeURIComponent(e?.message ?? "Restore failed")}`);
    }
  }

  async function move(id: string, dir: "up" | "down") {
    "use server";
    try {
      const supabase = getServiceSupabaseClient({ useServiceRole: true });
      const sb: any = supabase as any;
      const { data: rows } = await sb
        .from("hero_slides")
        .select("id,position")
        .is("deleted_at", null)
        .order("position", { ascending: true });
      const list: Array<{ id: string; position: number | null }> = (rows as any[]) ?? [];
      if (list.length === 0) return;
      const idx = list.findIndex((r: { id: string }) => r.id === id);
      if (idx < 0) return;
      const swapIdx = dir === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= list.length) return;
      const a = list[idx]!;
      const b = list[swapIdx]!;
      await sb.from("hero_slides").update({ position: b.position }).eq("id", a.id);
      await sb.from("hero_slides").update({ position: a.position }).eq("id", b.id);
      revalidatePath("/admin/hero");
      revalidatePath("/");
      redirect("/admin/hero?success=Order%20updated");
    } catch (e: any) {
      redirect(`/admin/hero?error=${encodeURIComponent(e?.message ?? "Reorder failed")}`);
    }
  }

  return (
    <div className="space-y-6">
      {successMsg ? (<div className="rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{successMsg}</div>) : null}
      {errorMsg ? (<div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{errorMsg}</div>) : null}

      <div className="rounded border p-4 space-y-3">
        <h2 className="text-xl font-semibold">Hero Basics</h2>
        <form action={saveHero} className="grid gap-3 sm:grid-cols-2">
          <input name="title" placeholder="Title" defaultValue={hero?.title ?? ""} className="rounded border px-3 py-2 sm:col-span-2" required />
          <input name="subtitle" placeholder="Subtitle" defaultValue={hero?.subtitle ?? ""} className="rounded border px-3 py-2 sm:col-span-2" />
          <input name="background_image_url" placeholder="Background image URL (right side when no slides)" defaultValue={hero?.background_image_url ?? ""} className="rounded border px-3 py-2 sm:col-span-2" />
          <input name="image_file" type="file" accept="image/*" className="rounded border px-3 py-2" />
          <button type="submit" className="rounded bg-primary px-4 py-2 text-white">Save</button>
        </form>
        {hero?.background_image_url ? (
          <div className="mt-2">
            <div className="text-sm text-muted-foreground">Current background preview</div>
            <img src={hero.background_image_url} alt="Right-side background" className="mt-1 h-24 w-full max-w-xs rounded object-contain border" />
          </div>
        ) : null}
      </div>

      <div className="rounded border p-4 space-y-3">
        <h2 className="text-xl font-semibold">Hero CTAs</h2>
        <form action={createCta} className="grid gap-3 sm:grid-cols-5">
          <input type="hidden" name="hero_id" defaultValue={hero?.id ?? ""} />
          <input name="text" placeholder="Text" className="rounded border px-3 py-2" />
          <input name="href" placeholder="Link" className="rounded border px-3 py-2" />
          <select name="variant" defaultValue="default" className="rounded border px-3 py-2">
            <option value="default">Default</option>
            <option value="accent">Accent</option>
          </select>
          <button type="submit" className="rounded bg-primary px-4 py-2 text-white sm:col-span-2">Add CTA</button>
        </form>
        <div className="overflow-auto rounded border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">Text</th>
                <th className="px-3 py-2">Href</th>
                <th className="px-3 py-2">Variant</th>
                <th className="px-3 py-2">Edit</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ctas.map((c: any, i: number) => (
                <tr key={c.id} className="border-t">
                  <td className="px-3 py-2 whitespace-nowrap">{c.position}</td>
                  <td className="px-3 py-2">{c.text}</td>
                  <td className="px-3 py-2">{c.href}</td>
                  <td className="px-3 py-2">{c.variant ?? "default"}</td>
                  <td className="px-3 py-2">
                    <form action={updateCta} className="grid gap-2 sm:grid-cols-4">
                      <input type="hidden" name="id" defaultValue={c.id as string} />
                      <input name="text" defaultValue={(c.text ?? "") as string} className="rounded border px-2 py-1" />
                      <input name="href" defaultValue={(c.href ?? "") as string} className="rounded border px-2 py-1" />
                      <select name="variant" defaultValue={(c.variant ?? "default") as string} className="rounded border px-2 py-1">
                        <option value="default">Default</option>
                        <option value="accent">Accent</option>
                      </select>
                      <button className="rounded bg-primary px-3 py-1 text-white">Save</button>
                    </form>
                  </td>
                  <td className="px-3 py-2 space-x-2 whitespace-nowrap">
                    <form action={deleteCta.bind(null, c.id as string)} className="inline"><button className="rounded border px-2 py-1">Delete</button></form>
                    <form action={moveCta.bind(null, c.id as string, "up")} className="inline"><button disabled={i===0} className="rounded border px-2 py-1 disabled:opacity-50">Up</button></form>
                    <form action={moveCta.bind(null, c.id as string, "down")} className="inline"><button disabled={i===ctas.length-1} className="rounded border px-2 py-1 disabled:opacity-50">Down</button></form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Hero Slides</h1>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">{items.length} items</span>
          <a className="rounded border px-2 py-1" href={includeDeleted ? "/admin/hero" : "/admin/hero?showDeleted=1"}>{includeDeleted ? "Hide deleted" : "Show deleted"}</a>
        </div>
      </div>

      <form action={createSlide} className="rounded border p-4 space-y-3">
        <div className="text-sm font-medium">Create Slide</div>
        <div className="grid gap-3 sm:grid-cols-5">
          <input name="alt" placeholder="Alt (optional)" className="rounded border px-3 py-2" />
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
              <th className="px-3 py-2">Preview</th>
              <th className="px-3 py-2">Alt</th>
              <th className="px-3 py-2">Edit</th>
              <th className="px-3 py-2">Updated</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((n: any, i: number) => (
              <tr key={n.id} className={`border-t ${n.deleted_at ? "opacity-60" : ""}`}>
                <td className="px-3 py-2 whitespace-nowrap">{n.position}</td>
                <td className="px-3 py-2">{n.image_url ? (<img src={n.image_url} alt={n.alt ?? ""} className="h-12 w-20 rounded object-cover" />) : null}</td>
                <td className="px-3 py-2">{n.alt ?? ""}</td>
                <td className="px-3 py-2">
                  <form action={updateSlide} className="grid gap-2 sm:grid-cols-3">
                    <input type="hidden" name="id" defaultValue={n.id as string} />
                    <input name="alt" defaultValue={(n.alt ?? "") as string} className="rounded border px-2 py-1" />
                    <select name="is_enabled" defaultValue={String(!!n.is_enabled)} className="rounded border px-2 py-1">
                      <option value="true">Enabled</option>
                      <option value="false">Disabled</option>
                    </select>
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
