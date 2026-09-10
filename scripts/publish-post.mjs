#!/usr/bin/env node
/**
 * Publish (or update) a blog post in Supabase `blog_posts`.
 *
 *   node scripts/publish-post.mjs posts/my-post.json [--draft]
 *
 * The JSON file is one post: { slug, title, excerpt, content, cover_image?,
 * author?, tags?, published_at? }. `content` is raw HTML — the blog page renders
 * it with dangerouslySetInnerHTML, so keep it to prose tags and internal links.
 *
 * Upserts on `slug`, so re-running after an edit updates the post in place
 * instead of creating a duplicate.
 *
 * Credentials come from C:\Users\User\islander.env (or the environment).
 */

import { readFileSync } from "node:fs";
import { argv, exit } from "node:process";

const ENV_FILE = "C:/Users/User/islander.env";

function loadEnv() {
  const env = { ...process.env };
  try {
    for (const line of readFileSync(ENV_FILE, "utf8").split(/\r?\n/)) {
      const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line);
      if (m && !env[m[1]]) env[m[1]] = m[2].trim();
    }
  } catch {
    // Environment-only is fine.
  }
  return env;
}

const env = loadEnv();
const URL_ = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL_ || !KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  exit(1);
}

const file = argv[2];
if (!file) {
  console.error("usage: node scripts/publish-post.mjs <post.json> [--draft]");
  exit(1);
}
const draft = argv.includes("--draft");

const post = JSON.parse(readFileSync(file, "utf8"));
for (const required of ["slug", "title", "excerpt", "content"]) {
  if (!post[required]) {
    console.error(`post is missing "${required}"`);
    exit(1);
  }
}

/**
 * The site publishes only the agency contact. A post that somehow picked up an
 * owner's LINE/WhatsApp/phone must never reach the public site, so refuse rather
 * than publish and clean up afterwards.
 */
const OWNER_CONTACT = [
  /\bwa\.me\/(?!66659594299)/i,
  /line\.me\/ti\/p\/(?!7Cr_f-bvBX)/i,
  /\b0[689]\d[- ]?\d{3}[- ]?\d{4}\b/,
  /\+66\s?(?!65\s?959\s?4299)\d/,
];
for (const re of OWNER_CONTACT) {
  const hit = re.exec(`${post.content}\n${post.excerpt}\n${post.title}`);
  if (hit) {
    console.error(`refusing to publish: looks like a private contact — ${hit[0]}`);
    exit(1);
  }
}

const body = {
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt,
  content: post.content,
  cover_image: post.cover_image ?? null,
  author: post.author ?? "Islander Home Team",
  tags: post.tags ?? [],
  published: !draft,
  published_at: post.published_at ?? new Date().toISOString(),
};

const headers = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  "Content-Type": "application/json",
  Prefer: "resolution=merge-duplicates,return=representation",
};

const res = await fetch(`${URL_}/rest/v1/blog_posts?on_conflict=slug`, {
  method: "POST",
  headers,
  body: JSON.stringify(body),
});

const text = await res.text();
if (!res.ok) {
  console.error(`HTTP ${res.status}: ${text}`);
  exit(1);
}
const [row] = text ? JSON.parse(text) : [{}];
console.log(
  `${draft ? "drafted" : "published"}  /blog/${row.slug ?? post.slug}  "${post.title}"`,
);
