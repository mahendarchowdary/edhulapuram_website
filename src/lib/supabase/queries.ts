import { getServiceSupabaseClient } from "./server";
import type { Database } from "./types";

export async function getNewsItems() {
  const supabase = getServiceSupabaseClient();
  const { data, error } = await supabase
    .from("news_items")
    .select("id,title_en,title_te,position,is_published")
    .eq("is_published", true)
    .order("position", { ascending: true });
  if (error) throw error;
  return (
    data?.map((n) => ({ id: n.id, en: n.title_en, te: n.title_te ?? "" })) ?? []
  );
}

// Social links (header icons)
export async function getSocialLinks(): Promise<Array<{ name: string; icon: string; url: string }>> {
  try {
    const supabase = getServiceSupabaseClient();
    const { data, error } = await supabase
      .from("site_social_links")
      .select("platform,icon,url");
    if (error) throw error;
    const rows = (data as unknown as any[]) ?? [];
    return rows
      .map((r: any) => ({
        name: String(r.platform || ""),
        icon: String((r.icon ?? r.platform) || ""),
        url: String(r.url ?? ""),
      }))
      .filter((r: any) => r.name && !!r.url);
  } catch (e) {
    return [];
  }
}

// About page queries
export async function getAboutBasicInfo() {
  const supabase = getServiceSupabaseClient();
  const { data, error } = await supabase
    .from("about_basic_info")
    .select("label,value_numeric,value_text,icon,position")
    .order("position", { ascending: true });
  if (error) throw error;
  return (
    data ?? []
  ) as Array<{ label: string; value_numeric: number | null; value_text: string | null; icon: string | null; position: number | null }>;
}

export async function getAboutVillages() {
  const supabase = getServiceSupabaseClient();
  const { data, error } = await supabase
    .from("about_villages")
    .select("name,position")
    .order("position", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Array<{ name: string; position: number | null }>;
}

export async function getAboutInfrastructure() {
  const supabase = getServiceSupabaseClient();
  const { data: sections, error } = await supabase
    .from("about_infrastructure_sections")
    .select("id,section,title,icon,position")
    .order("position", { ascending: true });
  if (error) throw error;
  const out: Array<{ id: string; section: string; title: string; icon: string | null; position: number | null; details: Array<{ label: string; value: string; position: number | null }> }>=[];
  for (const s of sections ?? []) {
    const { data: details } = await supabase
      .from("about_infrastructure_details")
      .select("label,value,position")
      .eq("section_id", s.id)
      .order("position", { ascending: true });
    out.push({
      id: s.id as string,
      section: (s as any).section as string,
      title: (s as any).title as string,
      icon: (s as any).icon ?? null,
      position: (s as any).position ?? null,
      details: (details ?? []) as Array<{ label: string; value: string; position: number | null }>,
    });
  }
  return out;
}

export async function getAboutSanitation() {
  const supabase = getServiceSupabaseClient();
  const { data: stats } = await supabase
    .from("about_sanitation_stats")
    .select("label,value_text,icon,position")
    .order("position", { ascending: true });
  const { data: vehicles } = await supabase
    .from("about_sanitation_vehicles")
    .select("label,quantity,position")
    .order("position", { ascending: true });
  return {
    stats: (stats ?? []) as Array<{ label: string; value_text: string | null; icon: string | null; position: number | null }>,
    vehicles: (vehicles ?? []) as Array<{ label: string; quantity: number | null; position: number | null }>,
  };
}

export async function getAboutFinancials() {
  const supabase = getServiceSupabaseClient();
  const { data } = await supabase
    .from("about_financials")
    .select("category,metric,value_numeric,value_text,position,extra")
    .order("position", { ascending: true });
  // Split into revenue chart and account summary based on category
  const revenue = (data ?? []).filter((r) => r.category === 'revenue');
  const account = (data ?? []).filter((r) => r.category === 'account');
  const revenueData = revenue.map((r) => ({ name: r.metric, Demand: (r.extra as any)?.demand ?? null, Collection: (r.extra as any)?.collection ?? null, Balance: (r.extra as any)?.balance ?? null }));
  const accountSummary = account.map((r) => ({ name: r.metric, value: r.value_numeric ?? null }));
  return { revenueData, accountSummary } as { revenueData: Array<{ name: string; Demand: number | null; Collection: number | null; Balance: number | null }>; accountSummary: Array<{ name: string; value: number | null }> };
}

export async function getAboutAssets() {
  const supabase = getServiceSupabaseClient();
  const { data, error } = await supabase
    .from("about_assets")
    .select("label,value_numeric,icon,position")
    .order("position", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Array<{ label: string; value_numeric: number | null; icon: string | null; position: number | null }>;
}
export async function getHeroSlides() {
  const supabase = getServiceSupabaseClient();
  const { data, error } = await (supabase as any)
    .from("hero_slides")
    .select("id,image_url,alt,position,deleted_at,is_enabled")
    .is("deleted_at", null)
    .eq("is_enabled", true)
    .order("position", { ascending: true });
  if (error) throw error;
  return (
    (data as any[])?.map((r) => ({ id: r.id, image_url: r.image_url as string, alt: (r as any).alt ?? "" })) ?? []
  );
}

export async function getKeyOfficials() {
  const supabase = getServiceSupabaseClient();
  const { data, error } = await (supabase as any)
    .from("key_officials")
    .select("id,name,designation,description,image_url,position,deleted_at")
    .is("deleted_at", null)
    .order("position", { ascending: true });
  if (error) throw error;
  return (data as any[]) ?? [];
}

export async function getEvents() {
  const supabase = getServiceSupabaseClient();
  const { data: events, error } = await supabase
    .from("events")
    .select("id,title,event_date,description,cover_image_url,position")
    .order("position", { ascending: true });
  if (error) throw error;

  const result = [] as Array<{
    id: string;
    title: string;
    date: string | null;
    description: string | null;
    cover_image_url: string | null;
  }>;

  for (const e of events ?? []) {
    let cover = e.cover_image_url as string | null;
    if (!cover) {
      const { data: gallery } = await supabase
        .from("event_gallery")
        .select("image_url, position")
        .eq("event_id", e.id)
        .order("position", { ascending: true })
        .limit(1);
      if (gallery && gallery.length) cover = gallery[0].image_url as string;
    }
    result.push({
      id: e.id as string,
      title: e.title as string,
      date: (e as any).event_date ?? null,
      description: (e as any).description ?? null,
      cover_image_url: cover ?? null,
    });
  }

  return result;
}

export async function getProjects() {
  const supabase = getServiceSupabaseClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("id,slug,name,description,cost,completion,status,position")
    .order("position", { ascending: true });
  if (error) throw error;

  const out = [] as Array<{
    id: string;
    slug: string;
    name: string;
    description: string | null;
    cost: string | null;
    completion: number | null;
    status: string | null;
    cover?: { image_url: string; description?: string | null; image_hint?: string | null } | null;
  }>;

  for (const p of projects ?? []) {
    const { data: gallery } = await supabase
      .from("project_gallery")
      .select("image_url, description, image_hint, position")
      .eq("project_id", p.id)
      .order("position", { ascending: true })
      .limit(1);
    out.push({
      id: p.id as string,
      slug: p.slug as string,
      name: p.name as string,
      description: (p as any).description ?? null,
      cost: (p as any).cost ?? null,
      completion: (p as any).completion ?? null,
      status: (p as any).status ?? null,
      cover: gallery && gallery.length ? { image_url: gallery[0].image_url, description: gallery[0].description, image_hint: (gallery[0] as any).image_hint ?? null } : null,
    });
  }

  return out;
}

export async function getQuickStats() {
  const supabase = getServiceSupabaseClient();
  const { data, error } = await supabase
    .from("quick_stats")
    .select("id,label,value,icon,position")
    .order("position", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getStaffMembers() {
  const supabase = getServiceSupabaseClient();
  const { data, error } = await supabase
    .from("staff_members")
    .select("id,name,designation,phone,priority,created_at,updated_at")
    .order("priority", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getHero() {
  const supabase = getServiceSupabaseClient();
  const { data: hero, error: heroError } = await supabase
    .from("hero_sections")
    .select("id,title,subtitle,background_image_url,updated_at")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (heroError) throw heroError;

  if (!hero) return null;

  const { data: ctas, error: ctaError } = await supabase
    .from("hero_ctas")
    .select("text,href,variant,position")
    .eq("hero_id", hero.id)
    .order("position", { ascending: true });
  if (ctaError) throw ctaError;

  return {
    title: hero.title,
    subtitle: hero.subtitle ?? "",
    background_image_url: hero.background_image_url ?? "",
    ctas: ctas ?? [],
  };
}
