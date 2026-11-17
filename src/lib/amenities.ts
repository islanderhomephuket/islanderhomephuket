/**
 * Amenity flags, derived from the text a listing already carries.
 *
 * Buyers search for a private pool, a furnished unit or a landlord who accepts
 * pets, and none of those is a column on `properties`. They are, however,
 * written into almost every listing's title, description or feature list, so
 * they are read out of that text once on the server and attached to the
 * listing as a short array of slugs.
 *
 * Deriving them on the server matters twice over: the browser filters on a
 * three-item array instead of a 900-word description, and `stripToCardFields`
 * can still drop the description from the payload without disabling the filter.
 *
 * Counted over the 892 live listings on 17/11/2026:
 *   private pool 332 · furnished 538 · pet-friendly 51 · gym 250 ·
 *   gated 205 · walk to beach 56 · sea view 47 · mountain view 105
 *
 * Only the first four are offered as filters. Sea view returns 47 against
 * FazWaz's 616 for the same island, which is a gap in how we record listings
 * rather than in what we hold — offering it as a filter would answer "we have
 * nothing" to a question we can actually answer, so it waits for the data.
 */
import type { Property } from "./types";

export type AmenityFlag =
  | "pool"
  | "furnished"
  | "pets"
  | "gym"
  | "gated"
  | "beach"
  | "sea-view"
  | "mountain-view";

/** The flags offered in the filter bar, in the order they appear there. */
export const FILTERABLE_AMENITIES: { flag: AmenityFlag; label: string }[] = [
  { flag: "pool", label: "Private pool" },
  { flag: "furnished", label: "Furnished" },
  { flag: "pets", label: "Pets OK" },
];

const RULES: { flag: AmenityFlag; test: RegExp; not?: RegExp }[] = [
  // "Pool villa" counts: the pool is the unit's own. A communal pool or "pool
  // access" does not, or the filter would answer with every condo in a block
  // that has one — 635 listings mention a pool, but only 332 have their own.
  { flag: "pool", test: /\b(private (swimming )?pool|own pool|pool villa|villa with pool|private-pool)\b/ },
  { flag: "furnished", test: /\b(fully furnished|furnished)\b/, not: /\bunfurnished|not furnished|un-furnished\b/ },
  { flag: "pets", test: /\b(pet[- ]friendly|pets allowed|pets considered|pets ok|pet friendly)\b/ },
  { flag: "gym", test: /\b(fitness|gym|gymnasium)\b/ },
  { flag: "gated", test: /\b(gated|24[- ]?hour security|24h security|security guard)\b/ },
  { flag: "beach", test: /\b(walk(ing)? (distance )?to [a-z ]{0,14}beach|minutes? (walk|from|to) [a-z ]{0,14}beach|near [a-z ]{0,14}beach|beachfront|beach front)\b/ },
  { flag: "sea-view", test: /\b(sea[- ]view|seaview|ocean view|sea views)\b/ },
  { flag: "mountain-view", test: /\b(mountain view|hill view|mountain views)\b/ },
];

/** Title + description + features, lowercased once per listing. */
function haystack(p: Pick<Property, "title" | "description" | "features">): string {
  return [p.title ?? "", p.description ?? "", (p.features ?? []).join(" ")]
    .join(" ")
    .toLowerCase();
}

export function deriveAmenities(
  p: Pick<Property, "title" | "description" | "features">,
): AmenityFlag[] {
  const text = haystack(p);
  const out: AmenityFlag[] = [];
  for (const r of RULES) {
    if (r.test.test(text) && !(r.not && r.not.test(text))) out.push(r.flag);
  }
  return out;
}

export function hasAmenity(p: Property, flag: AmenityFlag): boolean {
  // Fall back to deriving on the spot for any listing that reached the browser
  // without its flags — a demo listing, or a path that builds a Property by
  // hand — so the filter never silently drops a home that qualifies.
  return (p.amenities ?? deriveAmenities(p)).includes(flag);
}
