# Islander Home Phuket — Luxury Real Estate

A production-ready Next.js 16 website for **Islander Home Phuket**, a boutique
luxury real-estate agency. Black / gold / white minimalist design, full property
CMS, search & filters, lead capture, blog, and an admin dashboard.

> **Runs out of the box in DEMO mode** with rich sample data and real photos.
> Connect Supabase to make it fully live and persistent.

---

## Tech stack

| Layer       | Choice                                            |
| ----------- | ------------------------------------------------- |
| Framework   | Next.js 16 (App Router, Turbopack, React 19)      |
| Language    | TypeScript                                        |
| Styling     | Tailwind CSS v4 (custom luxury theme)             |
| Database    | Supabase (Postgres + Storage + RLS)               |
| Icons       | lucide-react + custom brand SVGs                  |
| Deployment  | Vercel                                            |

## Features

- **Homepage** — cinematic hero with buy/rent search, featured listings, areas, why-choose-us, journal, CTA
- **Buy / Rent** — URL-driven search & filters (area, type, beds, price band, sort)
- **Area pages** — Koh Kaew, Bang Tao, Phuket Town, Chalong, Rawai, Thalang (guides + map + listings)
- **Property detail** — gallery + lightbox, specs, features, Google Map, sticky enquiry form, similar properties, JSON-LD
- **About / Contact** — brand story, stats, values; contact form + WhatsApp/LINE/Facebook
- **Blog** — listing + article pages (HTML content)
- **Admin dashboard** — password-gated; CRUD properties, manage leads, blog editor
- **Lead capture** — `/api/leads` route + Supabase persistence (logs in demo mode)
- **SEO** — per-page metadata, OpenGraph, `sitemap.xml`, `robots.txt`, JSON-LD, image optimization
- **Floating WhatsApp / LINE / Facebook** buttons site-wide, mobile-first

---

## Getting started

```bash
npm install
cp .env.example .env.local   # optional — site runs without it (demo mode)
npm run dev                  # http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

### Admin

Visit **`/admin`** → you'll be sent to `/admin/login`.
Default password is `changeme` — change it via `ADMIN_PASSWORD` in `.env.local`.

---

## Connecting Supabase (going live)

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run [`supabase/schema.sql`](supabase/schema.sql)
   (creates tables, indexes, RLS policies, storage bucket and seeds areas/categories).
3. Copy `.env.example` → `.env.local` and fill in:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...     # server-only, for admin writes
   ADMIN_PASSWORD=your-strong-password
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   NEXT_PUBLIC_GOOGLE_MAPS_KEY=...   # optional; keyless embed used otherwise
   ```

4. Restart. The site automatically switches from demo data to your live database.
   The admin badge shows **Live · Supabase** when connected.

> **Data model** — `properties`, `property_images`, `areas`, `categories`,
> `leads`, `blog_posts`. See the SQL file for the full schema and policies.

### Images

- Demo photos live in `public/properties/`.
- For live listings, upload to the `property-media` Supabase Storage bucket and
  paste the public URLs into the admin property form (one per line, first = cover),
  or reference any remote URL allowed in `next.config.ts`.

---

## Deploying to Vercel

1. Push to a Git repo and import it into Vercel.
2. Add the environment variables from `.env.example` in the Vercel dashboard.
3. Deploy. `npm run build` is used automatically.

---

## Project structure

```
src/
├─ app/
│  ├─ (site)/            # public site (Header + Footer + floating contact)
│  │  ├─ page.tsx        # homepage
│  │  ├─ buy, rent/      # listings
│  │  ├─ areas/[slug]/   # area guides
│  │  ├─ properties/[slug]/
│  │  ├─ about, contact, blog/
│  ├─ admin/
│  │  ├─ login/          # password gate
│  │  ├─ (dashboard)/    # protected: dashboard, properties, leads, blog
│  │  └─ actions.ts      # server actions (auth + CRUD)
│  ├─ api/leads/route.ts # lead submission
│  ├─ sitemap.ts, robots.ts
├─ components/           # ui, layout, brand, property, area, blog, home, admin, forms
└─ lib/
   ├─ data.ts            # data access (Supabase ⇄ mock fallback)
   ├─ mock-data.ts       # demo dataset
   ├─ supabase/          # client/server/admin + config
   ├─ types.ts, constants.ts, utils.ts, auth.ts
supabase/schema.sql      # full DB schema + RLS + seed
```

## Customising

- **Brand / contacts / areas** → `src/lib/constants.ts`
- **Colours / fonts** → `src/app/globals.css` (`@theme`) and `src/app/layout.tsx`
- **Logo** → `src/components/brand/logo.tsx` (inline SVG wordmark + emblem)

---

© Islander Home Phuket. Built with Next.js + Supabase.
