import { config as loadEnv } from "dotenv";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const moduleDir = fileURLToPath(new URL(".", import.meta.url));
const envCandidates = [
  resolve(process.cwd(), ".env.local"),
  resolve(process.cwd(), ".env"),
  resolve(moduleDir, "../.env.local"),
  resolve(moduleDir, "../.env"),
  resolve(moduleDir, "../../.env.local"),
  resolve(moduleDir, "../../.env"),
];

for (const path of envCandidates) {
  loadEnv({ path, override: false });
}
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import {
  siteConfig,
  navigationData,
  heroData,
  newsTickerData,
  quickStatsData,
  servicesData,
  eventsData,
  projectsData,
  keyOfficialsData,
  footerData,
} from "@/app/content/data";
import { aboutPageData } from "@/app/content/about-data";
import { contactData } from "@/app/content/contact-data";
import staffMembers from "@/data/staff";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  throw new Error("Supabase credentials missing");
}

const supabase = createClient<Database>(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function seedSiteSettings() {
  await supabase.from("site_settings").delete().neq("id", "");
  await supabase.from("site_settings").insert({
    site_name: siteConfig.name,
    short_name: siteConfig.shortName,
    contact_phone: siteConfig.contact.phone,
    contact_email: siteConfig.contact.email,
    updated_at: new Date().toISOString(),
  });

  await supabase.from("site_social_links").delete().neq("id", "");
  if (siteConfig.socials?.length) {
    await supabase.from("site_social_links").insert(
      siteConfig.socials.map((item, index) => ({
        platform: item.name,
        url: item.url,
        icon: item.icon,
        position: index,
      }))
    );
  }
}

async function seedNavigation() {
  await supabase.from("navigation_items").delete().neq("id", "");

  for (let position = 0; position < navigationData.length; position += 1) {
    const parent = navigationData[position];
    const { data: parentRow, error: parentError } = await supabase
      .from("navigation_items")
      .insert({
        label: parent.label,
        href: parent.href ?? null,
        icon: parent.icon ?? null,
        external: parent.external ?? false,
        position,
      })
      .select()
      .single();

    if (parentError) {
      throw parentError;
    }

    if (!parentRow) continue;

    if (parent.links?.length) {
      await supabase.from("navigation_items").insert(
        parent.links.map((link, linkPos) => ({
          label: link.title,
          href: link.href,
          external: link.external ?? false,
          position: linkPos,
          parent_id: parentRow.id,
        }))
      );
    }

    if (parent.groups?.length) {
      for (const group of parent.groups) {
        const { data: groupRow, error: groupError } = await supabase
          .from("navigation_items")
          .insert({
            label: group.title ?? parent.label,
            position: parentRow.position ?? 0,
            parent_id: parentRow.id,
          })
          .select()
          .single();

        if (groupError) {
          throw groupError;
        }

        if (!groupRow) continue;

        await supabase.from("navigation_items").insert(
          group.links.map((link, linkPos) => ({
            label: link.title,
            href: link.href,
            external: link.external ?? false,
            position: linkPos,
            parent_id: groupRow.id,
          }))
        );
      }
    }
  }
}

async function seedHero() {
  await supabase.from("hero_sections").delete().neq("id", "");

  const { data: heroRow, error: heroError } = await supabase
    .from("hero_sections")
    .insert({
      title: heroData.title,
      subtitle: heroData.subtitle,
      background_image_url: heroData.backgroundImage?.imageUrl ?? null,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (heroError) {
    throw heroError;
  }

  if (!heroRow) return;

  await supabase.from("hero_ctas").delete().eq("hero_id", heroRow.id);

  await supabase.from("hero_ctas").insert(
    heroData.ctas.map((cta, position) => ({
      hero_id: heroRow.id,
      text: cta.text,
      href: cta.href,
      variant: cta.variant,
      position,
    }))
  );
}

async function seedNewsTicker() {
  await supabase.from("news_items").delete().neq("id", "");
  await supabase.from("news_items").insert(
    newsTickerData.news.map((item, position) => ({
      title_en: item.en,
      title_te: item.te,
      position,
      is_published: true,
    }))
  );
}

async function seedQuickStats() {
  await supabase.from("quick_stats").delete().neq("id", "");
  await supabase.from("quick_stats").insert(
    quickStatsData.stats.map((stat, position) => ({
      label: stat.label,
      value: stat.value,
      icon: stat.icon,
      position,
    }))
  );
}

async function seedServices() {
  await supabase.from("service_categories").delete().neq("id", "");
  await supabase.from("citizen_services").delete().neq("id", "");

  const { data: mainCategory } = await supabase
    .from("service_categories")
    .insert({ name: servicesData.title, position: 0 })
    .select()
    .single();

  if (mainCategory) {
    await supabase.from("citizen_services").insert(
      servicesData.services.map((service, index) => ({
        category_id: mainCategory.id,
        title: service.title,
        href: service.href,
        icon: service.icon,
        external: true,
        position: index,
      }))
    );
  }
}

async function seedEvents() {
  await supabase.from("event_gallery").delete().neq("id", "");
  await supabase.from("events").delete().neq("id", "");

  for (const [position, event] of eventsData.events.entries()) {
    const { data: eventRow, error: eventError } = await supabase
      .from("events")
      .insert({
        title: event.title,
        event_date: event.date ?? null,
        cover_image_url: event.imageUrl,
        description: event.description ?? null,
        position,
      })
      .select()
      .single();

    if (eventError) {
      throw eventError;
    }

    if (!eventRow) continue;
  }
}

async function seedProjects() {
  await supabase.from("project_gallery").delete().neq("id", "");
  await supabase.from("projects").delete().neq("id", "");

  for (const [position, project] of projectsData.projects.entries()) {
    const { data: projectRow, error: projectError } = await supabase
      .from("projects")
      .insert({
        slug: project.slug,
        name: project.name,
        description: project.description,
        cost: project.cost,
        completion: project.completion,
        status: project.status,
        icon: project.icon,
        timeline: project.timeline,
        position,
      })
      .select()
      .single();

    if (projectError) {
      throw projectError;
    }

    if (!projectRow) continue;

    await supabase.from("project_gallery").insert(
      project.gallery.map((image, index) => ({
        project_id: projectRow.id,
        image_url: image.imageUrl,
        image_hint: image.imageHint,
        description: image.description,
        position: index,
      }))
    );
  }
}

async function seedOfficials() {
  await supabase.from("key_officials").delete().neq("id", "");

  await supabase.from("key_officials").insert(
    keyOfficialsData.officials.map((official, position) => ({
      name: official.name,
      designation: official.designation,
      bio: official.bio ?? null,
      image_url: official.imageUrl,
      image_hint: official.imageHint,
      description: official.description ?? null,
      position,
    }))
  );
}

async function seedStaff() {
  await supabase.from("staff_members").delete().neq("id", "");

  await supabase.from("staff_members").insert(
    staffMembers.map((member, position) => ({
      name: member.name,
      designation: member.designation,
      phone: member.phone ?? null,
      priority: member.priority ?? position + 1,
    }))
  );
}

async function seedAbout() {
  await supabase.from("about_basic_info").delete().neq("id", "");
  await supabase.from("about_villages").delete().neq("id", "");
  await supabase.from("about_infrastructure_details").delete().neq("id", "");
  await supabase.from("about_infrastructure_sections").delete().neq("id", "");
  await supabase.from("about_sanitation_stats").delete().neq("id", "");
  await supabase.from("about_sanitation_vehicles").delete().neq("id", "");
  await supabase.from("about_financials").delete().neq("id", "");
  await supabase.from("about_assets").delete().neq("id", "");

  await supabase.from("about_basic_info").insert(
    aboutPageData.basicInfo.map((item, position) => ({
      label: item.label,
      value_numeric: typeof item.value === "number" ? item.value : null,
      value_text: typeof item.value === "string" ? item.value : null,
      icon: item.icon,
      position,
    }))
  );

  await supabase.from("about_villages").insert(
    aboutPageData.mergedVillages.map((village, position) => ({ name: village, position }))
  );

  const sectionIds = new Map<string, string>();

  for (const [sectionKey, sectionData] of Object.entries(aboutPageData.infrastructure)) {
    const { data: sectionRow, error: sectionError } = await supabase
      .from("about_infrastructure_sections")
      .insert({
        section: sectionKey,
        title: sectionData.title,
        icon: sectionData.icon,
      })
      .select()
      .single();

    if (sectionError) {
      throw sectionError;
    }

    if (!sectionRow) continue;

    sectionIds.set(sectionKey, sectionRow.id);

    await supabase.from("about_infrastructure_details").insert(
      Object.entries(sectionData.details).map(([label, value], position) => ({
        section_id: sectionRow.id,
        label,
        value,
        position,
      }))
    );
  }

  await supabase.from("about_sanitation_stats").insert(
    aboutPageData.sanitation.stats.map((stat, position) => ({
      label: stat.label,
      value_text: typeof stat.value === "string" ? stat.value : `${stat.value}`,
      icon: stat.icon,
      position,
    }))
  );

  await supabase.from("about_sanitation_vehicles").insert(
    Object.entries(aboutPageData.sanitation.vehicles).map(([label, quantity], position) => ({
      label,
      quantity,
      position,
    }))
  );

  const financialRows: Database["public"]["Tables"]["about_financials"]["Insert"][] = [];

  Object.entries(aboutPageData.financials).forEach(([category, data], categoryIndex) => {
    if (typeof data !== "object" || data === null) {
      return;
    }

    if ("data" in data && Array.isArray(data.data)) {
      data.data.forEach((item, position) => {
        financialRows.push({
          category,
          metric: item.name ?? `Metric ${position + 1}`,
          value_numeric: typeof item.Demand === "number" ? item.Demand : null,
          value_text: JSON.stringify(item),
          position: categoryIndex * 100 + position,
        });
      });
    }

    Object.entries(data).forEach(([metric, value], position) => {
      if (metric === "data") {
        return;
      }

      financialRows.push({
        category,
        metric,
        value_numeric: typeof value === "number" ? value : null,
        value_text: typeof value === "string" ? value : value != null ? JSON.stringify(value) : null,
        position: categoryIndex * 100 + 50 + position,
      });
    });
  });

  if (financialRows.length) {
    await supabase.from("about_financials").insert(financialRows);
  }

  await supabase.from("about_assets").insert(
    aboutPageData.communityAssets.map((asset, position) => ({
      label: asset.label,
      value_numeric: typeof asset.value === "number" ? asset.value : null,
      icon: asset.icon,
      position,
    }))
  );
}

async function seedContacts() {
  await supabase.from("contact_numbers").delete().neq("id", "");
  await supabase.from("contact_sections").delete().neq("id", "");

  for (const [position, section] of contactData.entries()) {
    const { data: sectionRow, error: sectionError } = await supabase
      .from("contact_sections")
      .insert({
        name: section.name,
        icon: section.icon,
        position,
      })
      .select()
      .single();

    if (sectionError) {
      throw sectionError;
    }

    if (!sectionRow) continue;

    await supabase.from("contact_numbers").insert(
      section.contacts.map((contact, index) => ({
        section_id: sectionRow.id,
        label: contact.label,
        number: contact.number,
        position: index,
      }))
    );
  }
}

async function seedFooter() {
  await supabase.from("footer_links").delete().neq("id", "");
  await supabase.from("footer_metadata").delete().neq("id", "");

  const usefulLinks = footerData.usefulLinks.map((link, position) => ({
    category: "useful" as const,
    label: link.text,
    href: link.href,
    position,
  }));

  const governmentLinks = footerData.governmentLinks.map((link, position) => ({
    category: "government" as const,
    label: link.text,
    href: link.href,
    position: usefulLinks.length + position,
  }));

  await supabase.from("footer_links").insert([...usefulLinks, ...governmentLinks]);

  await supabase.from("footer_metadata").insert({
    last_updated: footerData.lastUpdated,
  });
}

async function run() {
  await seedSiteSettings();
  await seedNavigation();
  await seedHero();
  await seedNewsTicker();
  await seedQuickStats();
  await seedServices();
  await seedEvents();
  await seedProjects();
  await seedOfficials();
  await seedStaff();
  await seedAbout();
  await seedContacts();
  await seedFooter();

  console.log("Supabase seeding completed");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
