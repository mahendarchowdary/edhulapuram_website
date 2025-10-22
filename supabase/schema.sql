-- Supabase schema for Edulapuram Municipality CMS
-- Run sections incrementally inside the Supabase SQL editor.

create extension if not exists "uuid-ossp";

-- =====================================================
--  Auth helpers
-- =====================================================
create table if not exists public.admin_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index if not exists admin_profiles_user_id_key on public.admin_profiles(user_id);

-- =====================================================
--  Site configuration
-- =====================================================
create table if not exists public.site_settings (
  id uuid primary key default uuid_generate_v4(),
  site_name text not null,
  short_name text,
  contact_phone text,
  contact_email text,
  updated_at timestamptz default now()
);

create table if not exists public.site_social_links (
  id uuid primary key default uuid_generate_v4(),
  platform text not null,
  url text not null,
  icon text,
  position int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =====================================================
--  Navigation
-- =====================================================
create table if not exists public.navigation_items (
  id uuid primary key default uuid_generate_v4(),
  label text not null,
  href text,
  icon text,
  external boolean default false,
  parent_id uuid references public.navigation_items(id) on delete cascade,
  position int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =====================================================
--  Hero
-- =====================================================
create table if not exists public.hero_sections (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  subtitle text,
  background_image_url text,
  updated_at timestamptz default now()
);

create table if not exists public.hero_ctas (
  id uuid primary key default uuid_generate_v4(),
  hero_id uuid not null references public.hero_sections(id) on delete cascade,
  text text not null,
  href text not null,
  variant text default 'default',
  position int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =====================================================
--  News ticker
-- =====================================================
create table if not exists public.news_items (
  id uuid primary key default uuid_generate_v4(),
  title_en text not null,
  title_te text,
  is_published boolean default true,
  position int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =====================================================
--  Quick stats
-- =====================================================
create table if not exists public.quick_stats (
  id uuid primary key default uuid_generate_v4(),
  label text not null,
  value numeric,
  value_text text,
  icon text,
  position int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =====================================================
--  Services
-- =====================================================
create table if not exists public.service_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  position int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.citizen_services (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references public.service_categories(id) on delete set null,
  title text not null,
  href text not null,
  icon text,
  external boolean default true,
  position int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =====================================================
--  Events & Gallery
-- =====================================================
create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  event_date date,
  description text,
  cover_image_url text,
  position int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.event_gallery (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references public.events(id) on delete cascade,
  image_url text not null,
  image_hint text,
  description text,
  position int default 0,
  created_at timestamptz default now()
);

-- =====================================================
--  Projects
-- =====================================================
create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  description text,
  cost text,
  completion int,
  status text,
  icon text,
  timeline text,
  position int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.project_gallery (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  image_url text not null,
  image_hint text,
  description text,
  position int default 0,
  created_at timestamptz default now()
);

-- =====================================================
--  Key officials
-- =====================================================
create table if not exists public.key_officials (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  designation text not null,
  bio text,
  image_url text,
  image_hint text,
  description text,
  position int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =====================================================
--  Staff directory
-- =====================================================
create table if not exists public.staff_members (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  designation text not null,
  phone text,
  priority numeric default 99,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =====================================================
--  About page
-- =====================================================
create table if not exists public.about_basic_info (
  id uuid primary key default uuid_generate_v4(),
  label text not null,
  value_text text,
  value_numeric numeric,
  icon text,
  position int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.about_villages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  position int default 0,
  created_at timestamptz default now()
);

create table if not exists public.about_infrastructure_sections (
  id uuid primary key default uuid_generate_v4(),
  section text not null,
  title text not null,
  icon text,
  position int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.about_infrastructure_details (
  id uuid primary key default uuid_generate_v4(),
  section_id uuid not null references public.about_infrastructure_sections(id) on delete cascade,
  label text not null,
  value text not null,
  position int default 0,
  created_at timestamptz default now()
);

create table if not exists public.about_sanitation_stats (
  id uuid primary key default uuid_generate_v4(),
  label text not null,
  value_text text,
  icon text,
  position int default 0,
  created_at timestamptz default now()
);

create table if not exists public.about_sanitation_vehicles (
  id uuid primary key default uuid_generate_v4(),
  label text not null,
  quantity numeric,
  position int default 0,
  created_at timestamptz default now()
);

create table if not exists public.about_financials (
  id uuid primary key default uuid_generate_v4(),
  category text not null,
  metric text not null,
  value_numeric numeric,
  value_text text,
  extra jsonb,
  position int default 0,
  created_at timestamptz default now()
);

create table if not exists public.about_assets (
  id uuid primary key default uuid_generate_v4(),
  label text not null,
  value_numeric numeric,
  icon text,
  position int default 0,
  created_at timestamptz default now()
);

-- =====================================================
--  Contacts
-- =====================================================
create table if not exists public.contact_sections (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  icon text,
  position int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.contact_numbers (
  id uuid primary key default uuid_generate_v4(),
  section_id uuid not null references public.contact_sections(id) on delete cascade,
  label text not null,
  number text not null,
  position int default 0,
  created_at timestamptz default now()
);

-- =====================================================
--  Footer
-- =====================================================
create table if not exists public.footer_links (
  id uuid primary key default uuid_generate_v4(),
  category text not null,
  label text not null,
  href text not null,
  position int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.footer_metadata (
  id uuid primary key default uuid_generate_v4(),
  last_updated text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =====================================================
--  Media assets (optional helper table)
-- =====================================================
create table if not exists public.media_assets (
  id uuid primary key default uuid_generate_v4(),
  file_path text not null,
  alt_text text,
  description text,
  created_at timestamptz default now(),
  uploaded_by uuid references auth.users(id)
);

-- =====================================================
--  Row Level Security Policies (examples)
-- =====================================================
alter table public.admin_profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.site_social_links enable row level security;
alter table public.navigation_items enable row level security;
alter table public.hero_sections enable row level security;
alter table public.hero_ctas enable row level security;
alter table public.news_items enable row level security;
alter table public.quick_stats enable row level security;
alter table public.service_categories enable row level security;
alter table public.citizen_services enable row level security;
alter table public.events enable row level security;
alter table public.event_gallery enable row level security;
alter table public.projects enable row level security;
alter table public.project_gallery enable row level security;
alter table public.key_officials enable row level security;
alter table public.staff_members enable row level security;
alter table public.about_basic_info enable row level security;
alter table public.about_villages enable row level security;
alter table public.about_infrastructure_sections enable row level security;
alter table public.about_infrastructure_details enable row level security;
alter table public.about_sanitation_stats enable row level security;
alter table public.about_sanitation_vehicles enable row level security;
alter table public.about_financials enable row level security;
alter table public.about_assets enable row level security;
alter table public.contact_sections enable row level security;
alter table public.contact_numbers enable row level security;
alter table public.footer_links enable row level security;
alter table public.footer_metadata enable row level security;
alter table public.media_assets enable row level security;

-- Replace `authenticated` with specific roles when ready.
create policy "Allow read for all" on public.navigation_items for select using (true);
create policy "Allow read for all" on public.hero_sections for select using (true);
create policy "Allow read for all" on public.hero_ctas for select using (true);
create policy "Allow read for all" on public.news_items for select using (true);
create policy "Allow read for all" on public.quick_stats for select using (true);
create policy "Allow read for all" on public.service_categories for select using (true);
create policy "Allow read for all" on public.citizen_services for select using (true);
create policy "Allow read for all" on public.events for select using (true);
create policy "Allow read for all" on public.event_gallery for select using (true);
create policy "Allow read for all" on public.projects for select using (true);
create policy "Allow read for all" on public.project_gallery for select using (true);
create policy "Allow read for all" on public.key_officials for select using (true);
create policy "Allow read for all" on public.staff_members for select using (true);
create policy "Allow read for all" on public.about_basic_info for select using (true);
create policy "Allow read for all" on public.about_villages for select using (true);
create policy "Allow read for all" on public.about_infrastructure_sections for select using (true);
create policy "Allow read for all" on public.about_infrastructure_details for select using (true);
create policy "Allow read for all" on public.about_sanitation_stats for select using (true);
create policy "Allow read for all" on public.about_sanitation_vehicles for select using (true);
create policy "Allow read for all" on public.about_financials for select using (true);
create policy "Allow read for all" on public.about_assets for select using (true);
create policy "Allow read for all" on public.contact_sections for select using (true);
create policy "Allow read for all" on public.contact_numbers for select using (true);
create policy "Allow read for all" on public.footer_links for select using (true);
create policy "Allow read for all" on public.footer_metadata for select using (true);
create policy "Allow read for all" on public.site_settings for select using (true);
create policy "Allow read for all" on public.site_social_links for select using (true);
create policy "Allow read for all" on public.media_assets for select using (true);

create policy "Admins manage content" on public.navigation_items for all using (
  exists (select 1 from public.admin_profiles ap where ap.user_id = auth.uid())
) with check (
  exists (select 1 from public.admin_profiles ap where ap.user_id = auth.uid())
);

create policy "Admins manage content" on public.hero_sections for all using (
  exists (select 1 from public.admin_profiles ap where ap.user_id = auth.uid())
) with check (
  exists (select 1 from public.admin_profiles ap where ap.user_id = auth.uid())
);

-- Repeat the "Admins manage content" policy for each table as needed.

