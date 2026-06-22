-- ============================================================
-- Islander Home Phuket — Supabase schema
-- Run in the Supabase SQL editor (or `supabase db push`).
-- Includes: tables, indexes, RLS policies, storage bucket, seed.
-- ============================================================

create extension if not exists "pgcrypto";

-- ─────────────── Areas (reference) ───────────────
create table if not exists public.areas (
  slug        text primary key,
  name        text not null,
  tagline     text,
  blurb       text,
  highlights  text[] default '{}',
  latitude    double precision,
  longitude   double precision,
  image       text,
  sort_order  int default 0
);

-- ─────────────── Categories (property types) ───────────────
create table if not exists public.categories (
  slug        text primary key,
  name        text not null,
  sort_order  int default 0
);

-- ─────────────── Properties ───────────────
create table if not exists public.properties (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  description   text not null default '',
  listing_type  text not null check (listing_type in ('sale','rent')),
  status        text not null default 'available'
                check (status in ('available','reserved','sold','rented','draft')),
  property_type text not null,
  area_slug     text references public.areas(slug) on delete set null,
  price         numeric,
  rent_period   text,
  bedrooms      int not null default 0,
  bathrooms     int not null default 0,
  living_area   numeric,
  land_area     numeric,
  address       text,
  latitude      double precision,
  longitude     double precision,
  features      text[] not null default '{}',
  is_featured   boolean not null default false,
  reference     text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists properties_listing_type_idx on public.properties(listing_type);
create index if not exists properties_area_idx on public.properties(area_slug);
create index if not exists properties_status_idx on public.properties(status);
create index if not exists properties_featured_idx on public.properties(is_featured);

-- ─────────────── Property images ───────────────
create table if not exists public.property_images (
  id          uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  url         text not null,
  alt         text,
  sort_order  int not null default 0,
  is_cover    boolean not null default false
);
create index if not exists property_images_property_idx on public.property_images(property_id);

-- ─────────────── Leads ───────────────
create table if not exists public.leads (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  email          text not null,
  phone          text,
  message        text,
  property_id    uuid references public.properties(id) on delete set null,
  property_title text,
  source         text not null default 'website',
  status         text not null default 'new'
                 check (status in ('new','contacted','qualified','closed')),
  created_at     timestamptz not null default now()
);
create index if not exists leads_status_idx on public.leads(status);
create index if not exists leads_created_idx on public.leads(created_at desc);

-- ─────────────── Blog posts ───────────────
create table if not exists public.blog_posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  excerpt      text not null default '',
  content      text not null default '',
  cover_image  text,
  author       text not null default 'Islander Home Team',
  tags         text[] not null default '{}',
  published    boolean not null default false,
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists blog_published_idx on public.blog_posts(published);

-- ─────────────── updated_at trigger ───────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists properties_updated_at on public.properties;
create trigger properties_updated_at before update on public.properties
  for each row execute function public.set_updated_at();

drop trigger if exists blog_updated_at on public.blog_posts;
create trigger blog_updated_at before update on public.blog_posts
  for each row execute function public.set_updated_at();

-- ============================================================
-- Row Level Security
-- Public read for published content; writes require auth /
-- the service-role key (used by the admin server actions).
-- ============================================================
alter table public.areas            enable row level security;
alter table public.categories       enable row level security;
alter table public.properties       enable row level security;
alter table public.property_images  enable row level security;
alter table public.blog_posts       enable row level security;
alter table public.leads            enable row level security;

-- Public read
create policy "public read areas" on public.areas for select using (true);
create policy "public read categories" on public.categories for select using (true);
create policy "public read properties" on public.properties
  for select using (status <> 'draft');
create policy "public read property images" on public.property_images
  for select using (true);
create policy "public read published posts" on public.blog_posts
  for select using (published = true);

-- Anyone can submit a lead (insert only)
create policy "public insert leads" on public.leads
  for insert with check (true);

-- Authenticated users (admins) can do everything
create policy "auth all areas" on public.areas for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth all categories" on public.categories for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth all properties" on public.properties for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth all property images" on public.property_images for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth all posts" on public.blog_posts for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth read leads" on public.leads for select
  using (auth.role() = 'authenticated');
create policy "auth update leads" on public.leads for update
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ─────────────── Storage bucket for property media ───────────────
insert into storage.buckets (id, name, public)
values ('property-media', 'property-media', true)
on conflict (id) do nothing;

create policy "public read property media" on storage.objects
  for select using (bucket_id = 'property-media');
create policy "auth upload property media" on storage.objects
  for insert with check (bucket_id = 'property-media' and auth.role() = 'authenticated');
create policy "auth update property media" on storage.objects
  for update using (bucket_id = 'property-media' and auth.role() = 'authenticated');
create policy "auth delete property media" on storage.objects
  for delete using (bucket_id = 'property-media' and auth.role() = 'authenticated');

-- ============================================================
-- Seed: areas & categories
-- (Properties / posts can be seeded from the app or admin panel.)
-- ============================================================
insert into public.areas (slug, name, tagline, sort_order) values
  ('koh-kaew', 'Koh Kaew', 'Connected, green & family-friendly', 1),
  ('bang-tao', 'Bang Tao', 'Beachfront luxury & Laguna living', 2),
  ('phuket-town', 'Phuket Town', 'Sino-Portuguese heritage & culture', 3),
  ('chalong', 'Chalong', 'Hillside views & island gateway', 4),
  ('rawai', 'Rawai', 'Bohemian seaside & expat haven', 5),
  ('thalang', 'Thalang', 'Nature, space & smart investment', 6)
on conflict (slug) do nothing;

insert into public.categories (slug, name, sort_order) values
  ('villa', 'Villa', 1),
  ('condominium', 'Condominium', 2),
  ('townhouse', 'Townhouse', 3),
  ('house', 'House', 4),
  ('apartment', 'Apartment', 5),
  ('land', 'Land', 6)
on conflict (slug) do nothing;
