// Contact-click report: `node scripts/clicks-report.mjs [days]` (default 30).
// Reads contact_clicks with the service key from C:\Users\User\islander.env.
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync("C:/Users/User/islander.env", "utf8")
    .split(/\r?\n/)
    .filter((l) => /^[A-Z_]+=/.test(l))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()]),
);
const days = Number(process.argv[2] ?? 30);
const since = new Date(Date.now() - days * 864e5).toISOString();
const res = await fetch(
  `${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/contact_clicks?select=*&created_at=gte.${since}&placement=neq.test&limit=10000`,
  { headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` } },
);
if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
const rows = await res.json();

const tally = (key) =>
  Object.entries(rows.reduce((m, r) => ((m[key(r) ?? "—"] = (m[key(r) ?? "—"] ?? 0) + 1), m), {}))
    .sort((a, b) => b[1] - a[1]);
const show = (title, key, n = 15) => {
  console.log(`\n${title}`);
  for (const [k, v] of tally(key).slice(0, n)) console.log(`  ${String(v).padStart(4)}  ${k}`);
};

console.log(`Contact clicks, last ${days} days: ${rows.length}`);
show("By campaign (RENT / BUY)", (r) => r.intent);
show("By channel", (r) => r.channel);
show("By source of the visit", (r) => r.source);
show("Organic (google/bing) landing pages that led to a click", (r) =>
  ["google", "bing", "duckduckgo", "yahoo"].includes(r.source) ? `${r.intent.toUpperCase()}  ${r.landing_path}` : null,
);
show("Page the click happened on", (r) => r.path);
show("Listings enquired about", (r) => r.property_ref);
show("Button placement", (r) => r.placement);
show("Device", (r) => r.device);
