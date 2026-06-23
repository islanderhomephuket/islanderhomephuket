/**
 * One-off prep for the "Kho kaew Kathu" Notion export.
 *
 * The export is a single CSV mixing Koh Kaew + Kathu listings, with column
 * names that differ from the main importer's schema. This script:
 *   1. detects each row's area (Kathu vs Koh Kaew) from its name + description,
 *   2. renames columns to what scripts/import-listings.mjs expects,
 *   3. drops ALL private landlord-contact columns (owner, whatsapp, line, …),
 *   4. writes data/notion/koh-kaew.csv and data/notion/kathu.csv.
 *
 * Then run: node scripts/import-listings.mjs  (regenerates src/lib/notion-data.ts)
 */
import { parse } from "csv-parse/sync";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const srcFile = path.join(root, ".notion-import", "listings.csv");
const outDir = path.join(root, "data", "notion");

const raw = fs.readFileSync(srcFile, "utf8");
const rows = parse(raw, {
  columns: (header) => header.map((h) => String(h).trim()),
  skip_empty_lines: true,
  relax_quotes: true,
  relax_column_count: true,
});

const cols = Object.keys(rows[0]);
const nameKey =
  cols.find((c) => c.replace(/[^A-Za-z]/g, "").toLowerCase() === "name") ||
  cols.find((c) => c.toLowerCase().includes("name"));
const descKey = cols.find((c) => c.toLowerCase().includes("description"));

/** Decide area from free text. Defaults to Koh Kaew (the file is mostly KK). */
function detectArea(text) {
  const t = text.toLowerCase();
  if (/kathu|กะทู้|patong/.test(t) && !/koh\s*kaew|kohkaew|kokaew|เกาะแก้ว/.test(t))
    return "kathu";
  if (/kathu|กะทู้/.test(t)) return "kathu";
  return "koh-kaew";
}

const OUT_HEADER = [
  "Name of Village",
  "Property Type",
  "Price Low Season",
  "Sale Price",
  "Description",
  "Listing Status",
];

const csvField = (v) => '"' + String(v ?? "").replace(/"/g, '""') + '"';

const buckets = { "koh-kaew": [], kathu: [] };

for (const r of rows) {
  const name = (r[nameKey] || "").trim();
  if (!name) continue;
  const desc = r[descKey] || "";
  const area = detectArea(`${name}\n${desc}`);
  buckets[area].push({
    "Name of Village": name,
    "Property Type": r["Property Type"] || "",
    "Price Low Season": r["Price Low Season"] || "",
    "Sale Price": r["Sale"] || "",
    Description: desc,
    "Listing Status": r["Status"] || "",
  });
}

fs.mkdirSync(outDir, { recursive: true });
for (const [area, list] of Object.entries(buckets)) {
  const lines = [OUT_HEADER.map(csvField).join(",")];
  for (const row of list)
    lines.push(OUT_HEADER.map((h) => csvField(row[h])).join(","));
  fs.writeFileSync(path.join(outDir, `${area}.csv`), lines.join("\n"), "utf8");
  console.log(`wrote data/notion/${area}.csv — ${list.length} listings`);
}
