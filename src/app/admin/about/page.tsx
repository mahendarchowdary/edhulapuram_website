import { getServerSupabaseClient, getServiceSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { IconPicker } from "@/components/admin/icon-picker.client";

async function fetchData() {
  const supabase = await getServerSupabaseClient();
  const [{ data: basic }, { data: villages }, { data: infraSections }] = await Promise.all([
    supabase
      .from("about_basic_info")
      .select("id,label,value_numeric,value_text,icon,position,updated_at")
      .order("position", { ascending: true }),
    supabase
      .from("about_villages")
      .select("id,name,position")
      .order("position", { ascending: true }),
    supabase
      .from("about_infrastructure_sections")
      .select("id,section,title,icon,position")
      .order("position", { ascending: true }),
  ]);
  // load details per section
  const sections = (infraSections ?? []) as Array<{ id: string; section: string; title: string; icon: string | null; position: number | null }>;
  const infra: Array<{ id: string; section: string; title: string; icon: string | null; position: number | null; details: Array<{ id: string; label: string; value: string; position: number | null }> }> = [];
  for (const s of sections) {
    const { data: details } = await supabase
      .from("about_infrastructure_details")
      .select("id,label,value,position")
      .eq("section_id", s.id)
      .order("position", { ascending: true });
    infra.push({ id: s.id, section: s.section, title: s.title, icon: s.icon, position: s.position, details: (details ?? []) as any });
  }

  return { basic: basic ?? [], villages: villages ?? [], infrastructure: infra } as {
    basic: Array<{ id: string; label: string; value_numeric: number | null; value_text: string | null; icon: string | null; position: number | null; updated_at: string | null }>;
    villages: Array<{ id: string; name: string; position: number | null }>;
    infrastructure: Array<{ id: string; section: string; title: string; icon: string | null; position: number | null; details: Array<{ id: string; label: string; value: string; position: number | null }> }>;
  };
}

export default async function AdminAboutPage({ searchParams }: { searchParams: Promise<{ success?: string }> }) {
  const { basic, villages, infrastructure } = await fetchData();
  const sp = await searchParams;
  const successMsg = sp?.success ? decodeURIComponent(sp.success) : undefined;

  async function createBasic(formData: FormData) {
    "use server";
    const label = String(formData.get("label") ?? "").trim();
    const value_numeric_str = String(formData.get("value_numeric") ?? "").trim();
    const value_text = String(formData.get("value_text") ?? "").trim() || null;
    const icon = String(formData.get("icon") ?? "").trim() || null;
    const value_numeric = value_numeric_str ? Number(value_numeric_str) : null;
    if (!label) return;
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    const { data: maxRows } = await supabase
      .from("about_basic_info")
      .select("position")
      .order("position", { ascending: false })
      .limit(1);
    const nextPos = (maxRows?.[0]?.position ?? 0) + 1;
    await supabase.from("about_basic_info").insert({ label, value_numeric, value_text, icon, position: nextPos });
    revalidatePath("/admin/about");
    revalidatePath("/about");
    redirect("/admin/about?success=Basic%20info%20created");
  }

  // Infrastructure: sections
  async function createInfraSection(formData: FormData) {
    "use server";
    const section = String(formData.get("section") ?? "").trim();
    const title = String(formData.get("title") ?? "").trim();
    const icon = String(formData.get("icon") ?? "").trim() || null;
    if (!section || !title) return;
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    const { data: maxRows } = await supabase
      .from("about_infrastructure_sections")
      .select("position")
      .order("position", { ascending: false })
      .limit(1);
    const nextPos = (maxRows?.[0]?.position ?? 0) + 1;
    await supabase.from("about_infrastructure_sections").insert({ section, title, icon, position: nextPos });
    revalidatePath("/admin/about");
    revalidatePath("/about");
    redirect("/admin/about?success=Section%20created");
  }

  async function updateInfraSection(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "").trim();
    const section = String(formData.get("section") ?? "").trim();
    const title = String(formData.get("title") ?? "").trim();
    const icon = String(formData.get("icon") ?? "").trim() || null;
    if (!id || !section || !title) return;
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    await supabase.from("about_infrastructure_sections").update({ section, title, icon }).eq("id", id);
    revalidatePath("/admin/about");
    revalidatePath("/about");
    redirect("/admin/about?success=Section%20updated");
  }

  async function moveInfraSection(id: string, dir: "up" | "down") {
    "use server";
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    const { data: rows } = await supabase
      .from("about_infrastructure_sections")
      .select("id,position")
      .order("position", { ascending: true });
    if (!rows) return;
    const idx = rows.findIndex((r) => r.id === id);
    if (idx < 0) return;
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= rows.length) return;
    const a = rows[idx]!;
    const b = rows[swapIdx]!;
    await supabase.from("about_infrastructure_sections").update({ position: b.position }).eq("id", a.id);
    await supabase.from("about_infrastructure_sections").update({ position: a.position }).eq("id", b.id);
    revalidatePath("/admin/about");
    revalidatePath("/about");
    redirect("/admin/about?success=Sections%20reordered");
  }

  async function deleteInfraSection(id: string) {
    "use server";
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    await supabase.from("about_infrastructure_sections").delete().eq("id", id);
    await supabase.from("about_infrastructure_details").delete().eq("section_id", id);
    revalidatePath("/admin/about");
    revalidatePath("/about");
    redirect("/admin/about?success=Section%20deleted");
  }

  // Infrastructure: details
  async function createInfraDetail(formData: FormData) {
    "use server";
    const section_id = String(formData.get("section_id") ?? "").trim();
    const label = String(formData.get("label") ?? "").trim();
    const value = String(formData.get("value") ?? "").trim();
    if (!section_id || !label) return;
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    const { data: maxRows } = await supabase
      .from("about_infrastructure_details")
      .select("position")
      .eq("section_id", section_id)
      .order("position", { ascending: false })
      .limit(1);
    const nextPos = (maxRows?.[0]?.position ?? 0) + 1;
    await supabase.from("about_infrastructure_details").insert({ section_id, label, value, position: nextPos });
    revalidatePath("/admin/about");
    revalidatePath("/about");
    redirect("/admin/about?success=Detail%20added");
  }

  async function updateInfraDetail(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "").trim();
    const label = String(formData.get("label") ?? "").trim();
    const value = String(formData.get("value") ?? "").trim();
    if (!id || !label) return;
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    await supabase.from("about_infrastructure_details").update({ label, value }).eq("id", id);
    revalidatePath("/admin/about");
    revalidatePath("/about");
    redirect("/admin/about?success=Detail%20updated");
  }

  async function moveInfraDetail(section_id: string, id: string, dir: "up" | "down") {
    "use server";
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    const { data: rows } = await supabase
      .from("about_infrastructure_details")
      .select("id,position")
      .eq("section_id", section_id)
      .order("position", { ascending: true });
    if (!rows) return;
    const idx = rows.findIndex((r) => r.id === id);
    if (idx < 0) return;
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= rows.length) return;
    const a = rows[idx]!;
    const b = rows[swapIdx]!;
    await supabase.from("about_infrastructure_details").update({ position: b.position }).eq("id", a.id);
    await supabase.from("about_infrastructure_details").update({ position: a.position }).eq("id", b.id);
    revalidatePath("/admin/about");
    revalidatePath("/about");
    redirect("/admin/about?success=Details%20reordered");
  }

  async function deleteInfraDetail(id: string) {
    "use server";
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    await supabase.from("about_infrastructure_details").delete().eq("id", id);
    revalidatePath("/admin/about");
    revalidatePath("/about");
    redirect("/admin/about?success=Detail%20deleted");
  }

  async function updateVillage(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    if (!id || !name) return;
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    await supabase.from("about_villages").update({ name }).eq("id", id);
    revalidatePath("/admin/about");
    revalidatePath("/about");
    redirect("/admin/about?success=Village%20updated");
  }

  async function updateBasic(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "").trim();
    const label = String(formData.get("label") ?? "").trim();
    const value_numeric_str = String(formData.get("value_numeric") ?? "").trim();
    const value_text = String(formData.get("value_text") ?? "").trim() || null;
    const icon = String(formData.get("icon") ?? "").trim() || null;
    const value_numeric = value_numeric_str ? Number(value_numeric_str) : null;
    if (!id || !label) return;
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    await supabase
      .from("about_basic_info")
      .update({ label, value_numeric, value_text, icon })
      .eq("id", id);
    revalidatePath("/admin/about");
    revalidatePath("/about");
    redirect("/admin/about?success=Basic%20info%20updated");
  }

  async function deleteBasic(id: string) {
    "use server";
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    await supabase.from("about_basic_info").delete().eq("id", id);
    revalidatePath("/admin/about");
    revalidatePath("/about");
    redirect("/admin/about?success=Basic%20info%20deleted");
  }

  async function moveBasic(id: string, dir: "up" | "down") {
    "use server";
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    const { data: rows } = await supabase
      .from("about_basic_info")
      .select("id,position")
      .order("position", { ascending: true });
    if (!rows) return;
    const idx = rows.findIndex((r) => r.id === id);
    if (idx < 0) return;
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= rows.length) return;
    const a = rows[idx]!;
    const b = rows[swapIdx]!;
    await supabase.from("about_basic_info").update({ position: b.position }).eq("id", a.id);
    await supabase.from("about_basic_info").update({ position: a.position }).eq("id", b.id);
    revalidatePath("/admin/about");
    revalidatePath("/about");
    redirect("/admin/about?success=Basic%20info%20reordered");
  }

  async function createVillage(formData: FormData) {
    "use server";
    const name = String(formData.get("name") ?? "").trim();
    if (!name) return;
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    const { data: maxRows } = await supabase
      .from("about_villages")
      .select("position")
      .order("position", { ascending: false })
      .limit(1);
    const nextPos = (maxRows?.[0]?.position ?? 0) + 1;
    await supabase.from("about_villages").insert({ name, position: nextPos });
    revalidatePath("/admin/about");
    revalidatePath("/about");
    redirect("/admin/about?success=Village%20added");
  }

  async function deleteVillage(id: string) {
    "use server";
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    await supabase.from("about_villages").delete().eq("id", id);
    revalidatePath("/admin/about");
    revalidatePath("/about");
    redirect("/admin/about?success=Village%20deleted");
  }

  async function moveVillage(id: string, dir: "up" | "down") {
    "use server";
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    const { data: rows } = await supabase
      .from("about_villages")
      .select("id,position")
      .order("position", { ascending: true });
    if (!rows) return;
    const idx = rows.findIndex((r) => r.id === id);
    if (idx < 0) return;
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= rows.length) return;
    const a = rows[idx]!;
    const b = rows[swapIdx]!;
    await supabase.from("about_villages").update({ position: b.position }).eq("id", a.id);
    await supabase.from("about_villages").update({ position: a.position }).eq("id", b.id);
    revalidatePath("/admin/about");
    revalidatePath("/about");
    redirect("/admin/about?success=Villages%20reordered");
  }

  return (
    <div className="space-y-6">
      {successMsg ? (
        <div className="rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{successMsg}</div>
      ) : null}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">About Page</h1>
      </div>

      {/* Basic Info */}
      <section className="rounded border p-4 space-y-4">
        <div className="text-sm font-medium">Basic Information</div>
        <form action={createBasic} className="grid gap-2 sm:grid-cols-5">
          <input name="label" placeholder="Label" className="rounded border px-2 py-1" required />
          <input name="value_numeric" placeholder="Value (number)" className="rounded border px-2 py-1" />
          <input name="value_text" placeholder="Value (text)" className="rounded border px-2 py-1" />
          <IconPicker name="icon" label="Icon (optional)" />
          <button className="rounded bg-primary px-3 py-1 text-white">Add</button>
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
              {basic.map((b, i) => (
                <tr key={b.id} className="border-t align-top">
                  <td className="px-3 py-2 whitespace-nowrap">{b.position ?? i + 1}</td>
                  <td colSpan={4} className="px-3 py-2">
                    <form action={updateBasic} className="grid gap-2 sm:grid-cols-5">
                      <input type="hidden" name="id" defaultValue={b.id} />
                      <input name="label" defaultValue={b.label} className="rounded border px-2 py-1" />
                      <input name="value_numeric" defaultValue={(b.value_numeric ?? "") as any} placeholder="Value (number)" className="rounded border px-2 py-1" />
                      <input name="value_text" defaultValue={b.value_text ?? ""} placeholder="Value (text)" className="rounded border px-2 py-1" />
                      <IconPicker name="icon" defaultValue={b.icon ?? ''} label="Icon" />
                      <button className="rounded bg-primary px-3 py-1 text-white">Save</button>
                    </form>
                    <div className="text-xs text-muted-foreground mt-1">Updated: {b.updated_at ? new Date(b.updated_at).toLocaleString() : ""}</div>
                  </td>
                  <td className="px-3 py-2 space-x-2 whitespace-nowrap">
                    <form action={moveBasic.bind(null, b.id, "up")} className="inline"><button className="rounded border px-2 py-1">Up</button></form>
                    <form action={moveBasic.bind(null, b.id, "down")} className="inline"><button className="rounded border px-2 py-1">Down</button></form>
                    <form action={deleteBasic.bind(null, b.id)} className="inline"><button className="rounded border px-2 py-1">Delete</button></form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="rounded border p-4 space-y-4">
        <div className="text-sm font-medium">Infrastructure Sections</div>
        <form action={createInfraSection} className="grid gap-2 sm:grid-cols-4">
          <input name="section" placeholder="Section key" className="rounded border px-2 py-1" required />
          <input name="title" placeholder="Title" className="rounded border px-2 py-1" required />
          <IconPicker name="icon" label="Icon (optional)" />
          <button className="rounded bg-primary px-3 py-1 text-white">Add Section</button>
        </form>
        <div className="space-y-4">
          {infrastructure.map((s) => (
            <div key={s.id} className="rounded border p-3">
              <form action={updateInfraSection} className="grid gap-2 sm:grid-cols-4 items-center">
                <input type="hidden" name="id" defaultValue={s.id} />
                <input name="section" defaultValue={s.section} className="rounded border px-2 py-1" />
                <input name="title" defaultValue={s.title} className="rounded border px-2 py-1" />
                <IconPicker name="icon" defaultValue={s.icon ?? ''} label="Icon" />
                <button className="rounded bg-primary px-3 py-1 text-white">Save</button>
              </form>
              <div className="mt-2 space-x-2">
                <form action={moveInfraSection.bind(null, s.id, 'up')} className="inline"><button className="rounded border px-2 py-1 text-xs">Up</button></form>
                <form action={moveInfraSection.bind(null, s.id, 'down')} className="inline"><button className="rounded border px-2 py-1 text-xs">Down</button></form>
                <form action={deleteInfraSection.bind(null, s.id)} className="inline"><button className="rounded border px-2 py-1 text-xs">Delete</button></form>
              </div>
              <div className="mt-3">
                <div className="text-xs font-medium mb-1">Details</div>
                <form action={createInfraDetail} className="grid gap-2 sm:grid-cols-3">
                  <input type="hidden" name="section_id" defaultValue={s.id} />
                  <input name="label" placeholder="Label" className="rounded border px-2 py-1" required />
                  <input name="value" placeholder="Value" className="rounded border px-2 py-1" required />
                  <button className="rounded border px-3 py-1">Add Detail</button>
                </form>
                <ul className="mt-2 space-y-2">
                  {s.details.map((d, idx) => (
                    <li key={d.id} className="flex items-center gap-2">
                      <form action={updateInfraDetail} className="flex items-center gap-2 flex-1">
                        <input type="hidden" name="id" defaultValue={d.id} />
                        <input name="label" defaultValue={d.label} className="rounded border px-2 py-1 flex-1" />
                        <input name="value" defaultValue={d.value} className="rounded border px-2 py-1 flex-1" />
                        <button className="rounded bg-primary px-3 py-1 text-white text-xs">Save</button>
                      </form>
                      <div className="ml-auto space-x-2">
                        <form action={moveInfraDetail.bind(null, s.id, d.id, 'up')} className="inline"><button className="rounded border px-2 py-1 text-xs">Up</button></form>
                        <form action={moveInfraDetail.bind(null, s.id, d.id, 'down')} className="inline"><button className="rounded border px-2 py-1 text-xs">Down</button></form>
                        <form action={deleteInfraDetail.bind(null, d.id)} className="inline"><button className="rounded border px-2 py-1 text-xs">Delete</button></form>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Villages */}
      <section className="rounded border p-4 space-y-4">
        <div className="text-sm font-medium">Merged Villages</div>
        <form action={createVillage} className="flex items-center gap-2">
          <input name="name" placeholder="Village name" className="rounded border px-2 py-1" required />
          <button className="rounded bg-primary px-3 py-1 text-white">Add</button>
        </form>
        <ul className="divide-y rounded border">
          {villages.map((v, i) => (
            <li key={v.id} className="flex items-center gap-2 px-3 py-2">
              <span className="text-xs text-muted-foreground">#{v.position ?? i + 1}</span>
              <form action={updateVillage} className="flex items-center gap-2 flex-1">
                <input type="hidden" name="id" defaultValue={v.id} />
                <input name="name" defaultValue={v.name} className="rounded border px-2 py-1 flex-1" />
                <button className="rounded bg-primary px-3 py-1 text-white text-xs">Save</button>
              </form>
              <div className="ml-auto space-x-2">
                <form action={moveVillage.bind(null, v.id, "up")} className="inline"><button className="rounded border px-2 py-1 text-xs">Up</button></form>
                <form action={moveVillage.bind(null, v.id, "down")} className="inline"><button className="rounded border px-2 py-1 text-xs">Down</button></form>
                <form action={deleteVillage.bind(null, v.id)} className="inline"><button className="rounded border px-2 py-1 text-xs">Delete</button></form>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
