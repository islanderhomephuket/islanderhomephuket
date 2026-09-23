/**
 * Budget landing pages: `/buy/villas-under-15m`, `/rent/condos-under-20k`.
 *
 * People search a number before they search a place — "pool villa Phuket under
 * 10 million", "condo for rent Phuket 20k". Until these pages existed the only
 * answer was `/buy/villas`, which opens on a ฿48M listing and tells a ฿9M buyer
 * nothing. Each page is a real, filtered set with its own title.
 *
 * They live on the `/buy/[area]` and `/rent/[area]` routes next to areas and
 * types; areas win any collision (`assertNoBandCollision` fails the build if a
 * band ever shadows one). Sale bands are a capital price, rental bands a monthly
 * one, so the two lists are separate and never mix.
 */

import { AREAS } from "@/lib/constants";
import type { Property } from "@/lib/types";
import { PROPERTY_TYPE_PAGES, isPropertyTypeMatch } from "@/lib/property-type-pages";
import type { Intent } from "@/lib/seo";

export interface PriceBandPage {
  /** URL segment: /<intent>/<slug> */
  slug: string;
  intent: Intent;
  /** Property-type page this band filters, by its slug. */
  type: string;
  /** Inclusive ceiling, in baht — a sale price, or a rent per month. */
  max: number;
  /** "฿15M", "฿50K" — how the ceiling reads in a heading. */
  cap: string;
  /** One line of context for the page and its meta description. */
  blurb: string;
}

const SALE_BANDS: PriceBandPage[] = [
  {
    slug: "villas-under-10m",
    intent: "buy",
    type: "villas",
    max: 10_000_000,
    cap: "฿10M",
    blurb:
      "The entry band for a private-pool villa in Phuket — usually two or three bedrooms, inland from the beach, on a leasehold or company-held plot.",
  },
  {
    slug: "villas-under-15m",
    intent: "buy",
    type: "villas",
    max: 15_000_000,
    cap: "฿15M",
    blurb:
      "Where most family pool villas sit: three to four bedrooms in a gated estate, ten to twenty minutes from the west-coast beaches.",
  },
  {
    slug: "villas-under-20m",
    intent: "buy",
    type: "villas",
    max: 20_000_000,
    cap: "฿20M",
    blurb:
      "Larger and newer pool villas, and the first addresses close to Laguna, Bang Tao and Nai Harn.",
  },
  {
    slug: "houses-under-10m",
    intent: "buy",
    type: "houses",
    max: 10_000_000,
    cap: "฿10M",
    blurb:
      "Family houses in managed estates — the practical alternative to a villa when a private pool is not the point.",
  },
  {
    slug: "condos-under-3m",
    intent: "buy",
    type: "condos",
    max: 3_000_000,
    cap: "฿3M",
    blurb:
      "Studios and one-bedroom apartments — the cheapest way for a foreigner to own property in Phuket freehold, in their own name.",
  },
  {
    slug: "condos-under-5m",
    intent: "buy",
    type: "condos",
    max: 5_000_000,
    cap: "฿5M",
    blurb:
      "One- and two-bedroom apartments in managed buildings, the band most rental-yield buyers shop in.",
  },
  {
    slug: "condos-under-10m",
    intent: "buy",
    type: "condos",
    max: 10_000_000,
    cap: "฿10M",
    blurb:
      "Two- and three-bedroom apartments, sea-view floors and resort-managed residences.",
  },
];

const RENT_BANDS: PriceBandPage[] = [
  {
    slug: "villas-under-80k",
    intent: "rent",
    type: "villas",
    max: 80_000,
    cap: "฿80K",
    blurb:
      "The bottom of the private-pool villa market on a yearly contract — two and three bedrooms, mostly Chalong, Rawai and Thalang.",
  },
  {
    slug: "villas-under-100k",
    intent: "rent",
    type: "villas",
    max: 100_000,
    cap: "฿100K",
    blurb:
      "Three-bedroom pool villas with room for a family, within a short drive of an international school.",
  },
  {
    slug: "villas-under-150k",
    intent: "rent",
    type: "villas",
    max: 150_000,
    cap: "฿150K",
    blurb:
      "Larger and newer pool villas, and the first of the Bang Tao and Laguna addresses.",
  },
  {
    slug: "houses-under-40k",
    intent: "rent",
    type: "houses",
    max: 40_000,
    cap: "฿40K",
    blurb:
      "Family houses in gated estates — the band most long-stay families and teachers actually rent in.",
  },
  {
    slug: "houses-under-50k",
    intent: "rent",
    type: "houses",
    max: 50_000,
    cap: "฿50K",
    blurb:
      "Three- and four-bedroom houses, usually furnished, with a communal pool in the village.",
  },
  {
    slug: "houses-under-80k",
    intent: "rent",
    type: "houses",
    max: 80_000,
    cap: "฿80K",
    blurb:
      "Bigger houses and the ones with their own pool, in the estates around Koh Kaew, Kathu and Cherng Talay.",
  },
  {
    slug: "condos-under-20k",
    intent: "rent",
    type: "condos",
    max: 20_000,
    cap: "฿20K",
    blurb:
      "Studios and one-bedroom apartments on a yearly contract — the cheapest way to live on the island with a pool and a gym downstairs.",
  },
  {
    slug: "condos-under-30k",
    intent: "rent",
    type: "condos",
    max: 30_000,
    cap: "฿30K",
    blurb:
      "One- and two-bedroom apartments in managed buildings, furnished and ready to move into.",
  },
  {
    slug: "condos-under-50k",
    intent: "rent",
    type: "condos",
    max: 50_000,
    cap: "฿50K",
    blurb:
      "Two-bedroom and sea-view apartments, and the resort-managed residences near the west-coast beaches.",
  },
];

export const PRICE_BAND_PAGES: PriceBandPage[] = [...SALE_BANDS, ...RENT_BANDS];

export const bandsFor = (intent: Intent) =>
  PRICE_BAND_PAGES.filter((b) => b.intent === intent);

export const getPriceBandPage = (slug: string, intent: Intent) =>
  PRICE_BAND_PAGES.find((b) => b.slug === slug && b.intent === intent);

/** The property-type page a band filters. Every band names a real one. */
export const bandType = (band: PriceBandPage) => {
  const type = PROPERTY_TYPE_PAGES.find((t) => t.slug === band.type);
  if (!type) throw new Error(`Price band ${band.slug} names an unknown type: ${band.type}`);
  return type;
};

/**
 * Is this listing inside the band? Priced, of the right type, at or under the cap.
 *
 * Rental bands are per month, so a nightly or yearly rate is left out rather
 * than converted — "฿12,000" on a holiday villa is a night, and showing it
 * under "villas under ฿80K a month" would be a lie.
 */
export function isInPriceBand(property: Property, band: PriceBandPage): boolean {
  if (property.price == null || property.price <= 0) return false;
  if (band.intent === "rent" && (property.rent_period ?? "month") !== "month") return false;
  return property.price <= band.max && isPropertyTypeMatch(property, bandType(band));
}

/** "Villas for Sale in Phuket under ฿15M" / "Villas for Rent in Phuket under ฿80K a Month" */
export const bandHeading = (band: PriceBandPage) =>
  band.intent === "buy"
    ? `${bandType(band).plural} for Sale in Phuket under ${band.cap}`
    : `${bandType(band).plural} for Rent in Phuket under ${band.cap} a Month`;

/**
 * Guards the one way this design breaks: a band slug that is also an area or
 * type slug would shadow a live page. Called from generateStaticParams so a bad
 * slug fails the build instead of quietly hiding `/buy/villas`.
 */
export function assertNoBandCollision() {
  const taken = new Set([
    ...AREAS.map((a) => a.slug),
    ...PROPERTY_TYPE_PAGES.map((t) => t.slug),
  ]);
  const clash = PRICE_BAND_PAGES.filter((b) => taken.has(b.slug));
  if (clash.length > 0)
    throw new Error(
      `Price-band slug already used by an area or type: ${clash.map((c) => c.slug).join(", ")}`,
    );
  // Every band must name a type that exists; bandType throws if it does not.
  PRICE_BAND_PAGES.forEach(bandType);
}
