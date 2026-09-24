#!/usr/bin/env node
/**
 * Replace a blog post's cover image.
 *
 *   node scripts/set-cover.mjs <image> <post-slug>
 *
 * Resizes the image to 1200x630 (the ratio the blog hero and cards show whole),
 * uploads it to Storage as `blog-covers/<slug>-<yyyymmdd>.jpg` — a new name, so
 * no CDN copy of the old cover is served and the old file stays as a fallback —
 * then points `blog_posts.cover_image` at it and writes the same URL into the
 * post's JSON in content/posts, so a later publish-post.mjs run keeps it.
 *
 * Credentials come from C:\Users\User\islander.env (or the environment).
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { argv, exit } from "node:process";
import sharp from "sharp";

const ENV_FILE = "C:/Users/User/islander.env";
const env = { ...process.env };
try {
  for (const line of readFileSync(ENV_FILE, "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line);
    if (m && !env[m[1]]) env[m[1]] = m[2].trim();
  }
} catch {}
const URL_ = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL_ || !KEY) { console.error("Missing Supabase credentials"); exit(1); }

const [image, slug] = argv.slice(2);
if (!image || !slug) { console.error("usage: set-cover.mjs <image> <post-slug>"); exit(1); }

const headers = { apikey: KEY, Authorization: `Bearer ${KEY}` };

// The post must exist before anything is uploaded.
const found = await fetch(`${URL_}/rest/v1/blog_posts?slug=eq.${encodeURIComponent(slug)}&select=slug,cover_image`, { headers }).then((r) => r.json());
if (!Array.isArray(found) || found.length !== 1) { console.error(`No post with slug ${slug}`); exit(1); }

const jpg = await sharp(image).resize(1200, 630, { fit: "cover" }).jpeg({ quality: 86, mozjpeg: true, progressive: true }).toBuffer();
const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
const path = `blog-covers/${slug}-${stamp}.jpg`;

const up = await fetch(`${URL_}/storage/v1/object/property-media/${path}`, {
  method: "POST",
  headers: { ...headers, "Content-Type": "image/jpeg", "x-upsert": "true", "Cache-Control": "max-age=31536000" },
  body: jpg,
});
if (!up.ok) { console.error("upload failed", up.status, await up.text()); exit(1); }
const publicUrl = `${URL_}/storage/v1/object/public/property-media/${path}`;

const head = await fetch(publicUrl, { method: "HEAD" });
if (!head.ok) { console.error("uploaded file is not public", head.status); exit(1); }

const patch = await fetch(`${URL_}/rest/v1/blog_posts?slug=eq.${encodeURIComponent(slug)}`, {
  method: "PATCH",
  headers: { ...headers, "Content-Type": "application/json", Prefer: "return=minimal" },
  body: JSON.stringify({ cover_image: publicUrl }),
});
if (!patch.ok) { console.error("db update failed", patch.status, await patch.text()); exit(1); }

// Keep the source JSON in step, or the next publish would put the old cover back.
const dir = new URL("../content/posts/", import.meta.url);
let jsonFile = null;
for (const f of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
  const j = JSON.parse(readFileSync(new URL(f, dir), "utf8"));
  if (j.slug === slug) {
    j.cover_image = publicUrl;
    writeFileSync(new URL(f, dir), JSON.stringify(j, null, 2) + "\n");
    jsonFile = f;
  }
}

console.log(`cover set: ${slug}`);
console.log(`  was  ${found[0].cover_image}`);
console.log(`  now  ${publicUrl} (${Math.round(jpg.length / 1024)} KB)`);
console.log(`  json ${jsonFile ?? "(no matching file in content/posts)"}`);
