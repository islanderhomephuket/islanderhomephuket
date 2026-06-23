/**
 * Import Islander Home property listings from Notion CSV exports.
 *
 * Reads every CSV in  data/notion/<area>.csv  and generates
 * src/lib/notion-data.ts  with a typed NOTION_PROPERTIES array.
 *
 * PRIVACY: the landlord-contact columns (Owner / Co, Whatsapp, Line,
 * Facebook, Original Post Facebook, Select) are NEVER read into the output.
 * Only public marketing fields are used.
 */
import { parse } from "csv-parse/sync";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const inDir = path.join(root, "data", "notion");
const outFile = path.join(root, "src", "lib", "notion-data.ts");

// Map an export filename (first token) to a site area slug.
const AREA_MAP = {
  thalang: "thalang",
  "koh-kaew": "koh-kaew",
  kohkaew: "koh-kaew",
  "bang-tao": "bang-tao",
  bangtao: "bang-tao",
  "phuket-town": "phuket-town",
  phukettown: "phuket-town",
  chalong: "chalong",
  rawai: "rawai",
  kathu: "kathu",
};

const VILLA_IMAGES = Array.from({ length: 8 }, (_, i) => `/properties/villa-${i + 1}.png`);
const INTERIOR_IMAGES = Array.from({ length: 18 }, (_, i) => `/properties/interior-${i + 1}.jpg`);

const listingsDir = path.join(root, "public", "listings");

/** Load real photo sets copied by scripts/import-photos.mjs. */
function loadPhotoSets() {
  const sets = {};
  if (!fs.existsSync(listingsDir)) return sets;
  for (const slug of fs.readdirSync(listingsDir)) {
    const dir = path.join(listingsDir, slug);
    if (!fs.statSync(dir).isDirectory()) continue;
    const files = fs
      .readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
      .sort((a, b) => parseInt(a) - parseInt(b));
    if (files.length) sets[slug] = files.map((f) => `/listings/${slug}/${f}`);
  }
  return sets;
}

/**
 * Match a real photo folder to a Notion row.
 * Each test must identify exactly ONE listing. Ambiguous folders
 * (th-house-35k, th-villa-145m) are intentionally left for manual confirmation.
 * `r` = { name, type, pl, sale, desc } from the raw CSV row.
 */
const PHOTO_MATCHERS = [
  ["th-bella-40-50k", (r) => /bella/i.test(r.name) && /40\s*50/.test(r.pl)],
  ["th-bella-68k", (r) => /bella/i.test(r.name) && /68/.test(r.pl)],
  ["th-poolvilla-65k", (r) => /villa/i.test(r.type) && /(^|\D)65k?(\D|$)/i.test(r.pl)],
  ["th-primo-50k", (r) => /primo/i.test(r.name) && /(^|\D)50(\D|$)/.test(r.pl)],
  ["th-anasiri-55k", (r) => /anasiri/i.test(r.name) && /^\s*55k\s*$/i.test(r.pl)],
  ["th-the-place", (r) => /the\s*place\s*thalang/i.test(r.name)],
  ["th-smileville-40k", (r) => /smileville/i.test(r.desc)],
  ["th-gardenhouse-40k", (r) => /บ้านสวนอยู่เจริญ/.test(r.name)],
];

/* ─────────── helpers ─────────── */

const titleCase = (s) =>
  s.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());

const GENERIC_NAMES = new Set(["thalang", "house", "", "-", "may", "wa"]);

function cleanName(raw) {
  return (raw || "").replace(/\s+/g, " ").trim();
}

// Parse a monthly rent value from messy text like "26K", "40 50K", "55K65K80K", "88".
function parseRent(raw) {
  if (!raw) return null;
  const m = String(raw).replace(/,/g, "").match(/(\d+(?:\.\d+)?)\s*([kK])?/);
  if (!m) return null;
  let n = parseFloat(m[1]);
  if (m[2]) n *= 1000;
  else if (n < 1000) n *= 1000; // "88" -> 88,000
  return Math.round(n);
}

// Parse a sale price from text like "16 nego", "20 MB", "16.9 MB", "39".
function parseSale(raw) {
  if (!raw) return null;
  const m = String(raw).replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  if (!m) return null;
  let n = parseFloat(m[1]);
  if (n < 1000) n *= 1_000_000; // "16" / "16.9" -> millions
  return Math.round(n);
}

function intMatch(text, re) {
  const m = text.match(re);
  return m ? parseInt(m[1], 10) : 0;
}

function parseBeds(text) {
  return intMatch(text, /(\d+)\s*(?:\(\+?\d+\))?\s*(?:bed|bedroom|br\b)/i);
}
function parseBaths(text) {
  return intMatch(text, /(\d+)\s*(?:bath|bathroom)/i);
}

// Living/land area in m² (convert sq.wah -> m² when that's all we have).
function parseArea(text) {
  const sqm = text.match(/([\d,.]+)\s*(?:sq\.?\s*m|sqm|sq\.m\.|ตาราง?เมตร)/i);
  if (sqm) return Math.round(parseFloat(sqm[1].replace(/,/g, "")));
  const wah = text.match(/([\d,.]+)\s*sq\.?\s*wah/i);
  if (wah) return Math.round(parseFloat(wah[1].replace(/,/g, "")) * 4);
  return null;
}

const FEATURE_RULES = [
  [/private\s*pool|pool\s*villa|swimming\s*pool|salt\s*\/?\s*overflow|infinity/i, "Private/communal pool"],
  [/jacuzzi/i, "Jacuzzi"],
  [/sea\s*view|seaview|ocean\s*view/i, "Sea view"],
  [/mountain\s*view/i, "Mountain view"],
  [/fully\s*furnished|furnished/i, "Fully furnished"],
  [/wi-?fi|internet/i, "WiFi included"],
  [/pet[\s-]*friendly|pets?\s*(allowed|welcome)/i, "Pet friendly"],
  [/no\s*pets|pets?\s*not\s*allowed/i, "No pets"],
  [/parking|car\s*park|carport|garage/i, "Parking"],
  [/gym|fitness/i, "Fitness center"],
  [/cctv|24[\s-]*hour|24\/7|security/i, "24h security"],
  [/garden|yard|lawn/i, "Garden"],
  [/air\s*con|a\/c|air-?condition/i, "Air conditioning"],
  [/maid|cleaning\s*service|housekeep/i, "Cleaning service"],
  [/solar/i, "Solar power"],
  [/smart\s*home|smart\s*tv/i, "Smart home / Smart TV"],
  [/uwc|international\s*school|british\s*international|bis\b/i, "Near international schools"],
  [/beach/i, "Near the beach"],
];

function extractFeatures(text) {
  const out = [];
  for (const [re, label] of FEATURE_RULES) {
    if (re.test(text) && !out.includes(label)) out.push(label);
  }
  return out.slice(0, 10);
}

// Remove the contact footer + hashtags from a marketing description.
function cleanDescription(raw) {
  if (!raw) return "";
  let text = raw.replace(/\r/g, "");
  const cutMarkers = [
    /📩/, /📱/, /📲/, /wa\.me/i, /whats?app/i, /line\s*id/i,
    /line:/i, /facebook\s*page/i, /facebook:/i, /contact\s*k\.?\s*thanya/i,
    /สนใจเข้าชม/, /for\s*(private\s*)?viewing/i,
  ];
  let cut = text.length;
  for (const re of cutMarkers) {
    const m = text.match(re);
    if (m && m.index < cut) cut = m.index;
  }
  text = text.slice(0, cut);
  // Drop hashtag lines and collapse blank lines.
  text = text
    .split("\n")
    .filter((l) => !l.trim().startsWith("#"))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return text;
}

function slugify(s, i) {
  const base = s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base || "listing"}-${i}`;
}

/* ─────────── transform one row ─────────── */

function rowToProperty(row, area, idx, counters, photoSets, usedSlugs) {
  const name = cleanName(row["Name of Village"]);
  const typeRaw = (row["Property Type"] || "").trim();
  const priceLow = row["Price Low Season"];
  const priceHigh = row["Price High season"];
  const saleRaw = row["Sale Price"];
  const descRaw = row["Description"] || "";
  const statusRaw = (row["Listing Status"] || "").trim().toLowerCase();

  const description = cleanDescription(descRaw);
  const fullText = `${name}\n${descRaw}`;

  // Skip clearly-empty rows (no description and no price at all).
  if (!description && !priceLow && !saleRaw && !priceHigh) return null;

  const isVilla = /villa/i.test(typeRaw);
  const propertyType = isVilla
    ? "Villa"
    : /town/i.test(typeRaw + descRaw)
      ? "Townhouse"
      : "House";

  const rent = parseRent(priceLow) ?? parseRent(priceHigh);
  const sale = parseSale(saleRaw);

  // Listing type: rent unless it's sale-only.
  const listing_type = rent ? "rent" : sale ? "sale" : "rent";
  const price = listing_type === "rent" ? rent : sale;

  const beds = parseBeds(fullText);
  const baths = parseBaths(fullText);
  const areaM2 = parseArea(fullText);

  const features = extractFeatures(fullText);
  if (sale && listing_type === "rent") {
    features.unshift(`Also for sale: ฿${(sale / 1_000_000).toFixed(1)}M`);
  }

  // Title
  let displayName = name;
  if (GENERIC_NAMES.has(name.toLowerCase())) {
    displayName = `${propertyType === "Villa" ? "Pool Villa" : propertyType}`;
  } else if (/^[\x00-\x7F]+$/.test(name)) {
    displayName = titleCase(name);
  }
  const areaLabel = area
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
  const title = GENERIC_NAMES.has(name.toLowerCase())
    ? `${displayName} in ${areaLabel}`
    : `${displayName} — ${propertyType} in ${areaLabel}`;

  // Images: prefer a matched set of REAL photos; otherwise type-based placeholders.
  let picks = null;
  const matchCtx = { name, type: typeRaw, pl: String(priceLow || ""), sale: String(saleRaw || ""), desc: descRaw };
  for (const [slug, test] of PHOTO_MATCHERS) {
    if (!usedSlugs.has(slug) && photoSets[slug] && test(matchCtx)) {
      picks = photoSets[slug];
      usedSlugs.add(slug);
      counters.matched = (counters.matched || 0) + 1;
      break;
    }
  }
  if (!picks) {
    // No real photos yet → neutral "Photos coming soon" placeholder (not a
    // misleading stock villa). Replaced per-listing once real photos arrive.
    picks = ["/coming-soon.jpg"];
  }
  void VILLA_IMAGES;
  void INTERIOR_IMAGES;

  const n = ++counters.total;
  const ref = `IHP-${area.slice(0, 2).toUpperCase()}-${String(n).padStart(3, "0")}`;
  const id = `n-${area}-${String(n).padStart(3, "0")}`;
  const slug = slugify(`${displayName}-${areaLabel}`, n);

  const finalDesc =
    description ||
    `${displayName} available in ${areaLabel}, Phuket. Contact Islander Home for full details and a private viewing.`;

  return {
    id,
    slug,
    title,
    description: finalDesc,
    listing_type,
    status: statusRaw === "available" ? "available" : "available",
    property_type: propertyType,
    area_slug: area,
    price: price ?? null,
    rent_period: listing_type === "rent" ? "month" : null,
    bedrooms: beds,
    bathrooms: baths,
    living_area: areaM2,
    land_area: isVilla ? areaM2 : null,
    address: `${areaLabel}, Phuket`,
    latitude: null,
    longitude: null,
    features,
    is_featured: isVilla,
    reference: ref,
    created_at: "2026-06-01T09:00:00.000Z",
    updated_at: "2026-06-01T09:00:00.000Z",
    images: picks.map((url, i) => ({
      id: `${id}-img-${i}`,
      property_id: id,
      url,
      alt: title,
      sort_order: i,
      is_cover: i === 0,
    })),
  };
}

/* ─────────── main ─────────── */

function inferArea(file) {
  const token = path.basename(file).split(/[\s_.]/)[0].toLowerCase();
  return AREA_MAP[token] || "thalang";
}

function main() {
  if (!fs.existsSync(inDir)) {
    console.error(`No input dir: ${inDir}`);
    process.exit(1);
  }
  const files = fs
    .readdirSync(inDir)
    .filter((f) => f.toLowerCase().endsWith(".csv") && !f.toLowerCase().includes("_all"));

  const counters = { total: 0, villa: 0, house: 0, matched: 0 };
  const photoSets = loadPhotoSets();
  const usedSlugs = new Set();
  const all = [];

  for (const file of files) {
    const area = inferArea(file);
    const csv = fs.readFileSync(path.join(inDir, file), "utf8");
    const rows = parse(csv, {
      columns: (header) => header.map((h) => String(h).trim()),
      skip_empty_lines: true,
      relax_column_count: true,
    });
    let kept = 0;
    for (let i = 0; i < rows.length; i++) {
      const prop = rowToProperty(rows[i], area, i, counters, photoSets, usedSlugs);
      if (prop) {
        all.push(prop);
        kept++;
      }
    }
    console.log(`  ${file} → ${area}: ${kept}/${rows.length} listings`);
  }

  const unusedPhotos = Object.keys(photoSets).filter((s) => !usedSlugs.has(s));
  console.log(`  Real photo sets attached: ${usedSlugs.size}`);
  if (unusedPhotos.length)
    console.log(`  Photo sets NOT matched (need manual assignment): ${unusedPhotos.join(", ")}`);

  const header = `// AUTO-GENERATED by scripts/import-listings.mjs — do not edit by hand.
// Source: Notion CSV exports in data/notion/. Landlord-contact columns are excluded.
import type { Property } from "./types";

export const NOTION_PROPERTIES: Property[] = ${JSON.stringify(all, null, 2)};
`;
  fs.writeFileSync(outFile, header);
  console.log(`\n✓ Wrote ${all.length} listings to ${path.relative(root, outFile)}`);
}

main();
