#!/usr/bin/env node
/**
 * Mark listings as re-checked today, so the "Updated" date on the site means
 * something.
 *
 *   node scripts/touch-listing.mjs BTA-094 RW-30 CND-182
 *   node scripts/touch-listing.mjs --area bang-tao --rent      (whole set)
 *   node scripts/touch-listing.mjs --dry BTA-094               (show, change nothing)
 *
 * Every card and property page prints `updated_at`. That column also moves on
 * any bulk edit, which is why it currently reads 6 or 14 November on most of
 * the book — those were site-wide rewrites, not checks with the owners. Run
 * this after confirming with an owner that a listing is still available at the
 * stated price, and its date becomes a real one.
 *
 * Credentials come from C:\Users\User\islander.env (or the environment).
 */

import { readFileSync } from "node:fs";
import { argv, exit } from "node:process";

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
if (!URL_ || !KEY) {
  console.error("Missing Supabase credentials");
  exit(1);
}

const headers = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  "Content-Type": "application/json",
};

const args = argv.slice(2);
const dry = args.includes("--dry");
const areaIdx = args.indexOf("--area");
const area = areaIdx === -1 ? null : args[areaIdx + 1];
const intent = args.includes("--rent") ? "rent" : args.includes("--sale") ? "sale" : null;
const refs = args.filter(
  (a, i) => !a.startsWith("--") && !(areaIdx !== -1 && i === areaIdx + 1),
);

if (refs.length === 0 && !area) {
  console.error(
    "Name at least one reference, or a set:\n" +
      "  node scripts/touch-listing.mjs BTA-094 RW-30\n" +
      "  node scripts/touch-listing.mjs --area bang-tao --rent",
  );
  exit(1);
}

const q = async (path, init) => {
  const res = await fetch(`${URL_}/rest/v1/${path}`, { headers, ...init });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

// Build the filter once; the same one selects the preview and runs the update.
const filters = [];
if (refs.length) filters.push(`reference=in.(${refs.map(encodeURIComponent).join(",")})`);
if (area) filters.push(`area_slug=eq.${encodeURIComponent(area)}`);
if (intent) filters.push(`listing_type=eq.${intent}`);
// Sold and rented listings are history; re-checking them means nothing.
filters.push("status=eq.available");
const where = filters.join("&");

const found = await q(
  `properties?${where}&select=reference,slug,title,updated_at&order=reference`,
);

if (found.length === 0) {
  console.log("Nothing matched — no listing was changed.");
  exit(0);
}

if (refs.length) {
  const missing = refs.filter((r) => !found.some((f) => f.reference === r));
  if (missing.length)
    console.warn(`Not found or not available: ${missing.join(", ")}`);
}

const now = new Date().toISOString();
for (const p of found) {
  console.log(
    `${dry ? "would touch" : "touched"}  ${String(p.reference).padEnd(10)} ` +
      `${String(p.updated_at).slice(0, 10)} → ${now.slice(0, 10)}  ${p.title}`,
  );
}

if (dry) {
  console.log(`\n${found.length} listing(s) matched. Nothing written (--dry).`);
  exit(0);
}

await q(`properties?${where}`, {
  method: "PATCH",
  headers: { ...headers, Prefer: "return=minimal" },
  body: JSON.stringify({ updated_at: now }),
});

console.log(
  `\n${found.length} listing(s) now read "Updated ${new Date(now).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}".\n` +
    "The site is served from the build, so run `npm run deploy` for it to show.",
);
