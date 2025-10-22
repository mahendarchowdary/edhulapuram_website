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
  const { data, error } = await supabase
    .from("key_officials")
    .select("id,name,designation,description,image_url,position,deleted_at")
    .is("deleted_at", null)
    .order("position", { ascending: true });
  if (error) throw error;
  return data ?? [];
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
