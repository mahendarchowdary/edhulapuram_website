import { getServerSupabaseClient, getServiceSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const FIXED_PLATFORMS = ["Facebook", "Instagram", "Twitter", "Android", "Apple"] as const;

async function fetchSocials() {
  const supabase = await getServerSupabaseClient();
  const { data } = await supabase
    .from("site_social_links")
    .select("id,platform,icon,url,updated_at");
  return ((data as unknown as any[]) ?? []) as any[];
}

function normalizeHref(raw: string) {
  const t = (raw || "").trim();
  if (!t) return "#";
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
}

export default async function AdminSocialsPage({ searchParams }: { searchParams: Promise<{ success?: string }> }) {
  const rows: any[] = await fetchSocials();
  const sp = await searchParams;
  const successMsg = sp?.success ? decodeURIComponent(sp.success) : undefined;

  const byPlatform: Record<string, any> = Object.create(null);
  for (const r of rows) {
    if (r.platform) byPlatform[r.platform] = r;
  }

  async function updateLink(formData: FormData) {
    "use server";
    const platform = String(formData.get("platform") ?? "").trim();
    const icon = platform; // fixed icon equals platform name
    const url = String(formData.get("url") ?? "").trim();
    if (!platform) return;
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    // Manual upsert that works without a unique constraint
    let id: string | null = null;
    const sel1 = await supabase.from("site_social_links").select("id").eq("platform", platform).limit(1);
    if (sel1.data && sel1.data.length) {
      id = String(sel1.data[0].id);
    }
    const payload: any = { platform, icon, url: url ? normalizeHref(url) : "" };
    if (id) {
      const { error: updErr } = await supabase.from("site_social_links").update(payload).eq("id", id);
      if (updErr) redirect(`/admin/socials?success=${encodeURIComponent("Update failed: "+updErr.message)}`);
    } else {
      const { error: insErr } = await supabase.from("site_social_links").insert(payload);
      if (insErr) redirect(`/admin/socials?success=${encodeURIComponent("Insert failed: "+insErr.message)}`);
    }
    revalidatePath("/admin/socials");
    revalidatePath("/");
    redirect("/admin/socials?success=Links%20updated");
  }

  return (
    <div className="space-y-6">
      {successMsg ? (
        <div className="rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{successMsg}</div>
      ) : null}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Social Links</h1>
      </div>

      <section className="rounded border p-4 space-y-4">
        <div className="text-sm font-medium">Edit Links</div>
        <div className="overflow-auto rounded border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">URL</th>
                <th className="px-3 py-2">Updated</th>
              </tr>
            </thead>
            <tbody>
              {FIXED_PLATFORMS.map((p, i) => {
                const r = byPlatform[p] ?? {};
                return (
                  <tr key={p} className="border-t align-top">
                    <td className="px-3 py-2 whitespace-nowrap">{i + 1}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{p}</td>
                    <td className="px-3 py-2">
                      <form action={updateLink} className="grid gap-2 sm:grid-cols-3">
                        <input type="hidden" name="platform" value={p} />
                        <input name="url" defaultValue={r.url ?? ""} placeholder={`https://${p.toLowerCase()}.com/...`} className="rounded border px-2 py-1 sm:col-span-2" />
                        <button className="rounded bg-primary px-3 py-1 text-white">Save</button>
                      </form>
                      <div className="text-xs text-muted-foreground mt-1">Updated: {r.updated_at ? new Date(r.updated_at as string).toLocaleString() : ""}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
