-- Contact-button clicks (WhatsApp / LINE / Facebook / phone / email).
-- No cookies, no IP, no user agent: page, campaign label and where the visit came from.
create table if not exists public.contact_clicks (
  id             bigint generated always as identity primary key,
  created_at     timestamptz not null default now(),
  channel        text not null check (channel in ('whatsapp','line','facebook','phone','email')),
  intent         text not null check (intent in ('rent','buy','other')),
  placement      text check (char_length(placement) <= 30),
  path           text not null check (char_length(path) <= 300),
  property_ref   text check (char_length(property_ref) <= 60),
  landing_path   text check (char_length(landing_path) <= 300),
  source         text check (char_length(source) <= 100),
  device         text check (device in ('mobile','desktop'))
);
create index if not exists contact_clicks_created_idx on public.contact_clicks(created_at desc);
alter table public.contact_clicks enable row level security;
drop policy if exists "public insert contact clicks" on public.contact_clicks;
create policy "public insert contact clicks" on public.contact_clicks for insert with check (true);
drop policy if exists "auth read contact clicks" on public.contact_clicks;
create policy "auth read contact clicks" on public.contact_clicks for select to authenticated using (true);
