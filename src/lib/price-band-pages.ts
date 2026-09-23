/**
 * Budget landing pages for the sale book: `/buy/villas-under-15m`, `/buy/condos-under-5m`.
 *
 * Buyers search a number before they search a place — "pool villa Phuket under
 * 10 million", "condo for sale Phuket 3 million". Until these pages existed the
 * only answer we had was `/buy/villas`, which opens on a ฿48M listing and tells
 * a ฿9M buyer nothing. Each page is a real, filtered set with its own title.
 *
 * They live on the `/buy/[area]` route next to areas and types; areas win any
 * collision (see `resolveIntentSegment`). Sale only — renters search a monthly
 * budget, which is a different set of bands and a different page.
 */

import { AREAS } from "@/lib/constants";
import type { Property } from "@/lib/types";
import { PROPERTY_TYPE_PAGES, isPropertyTypeMatch } from "@/lib/property-type-pages";

export interface PriceBandPage {
  /** URL segment: /buy/<slug> */
  slug: string;
  /** Property-type page this band filters, by its slug. */
  type: string;
  /** Inclusive ceiling, in baht. */
  max: number;
  /** "฿15M" — how the ceiling reads in a heading. */
  cap: string;
  /** One line of context for the page and its meta description. */
  blurb: string;
}

export const PRICE_BAND_PAGES: PriceBandPage[] = [
  {
    slug: "villas-under-10m",
    type: "villas",
    max: 10_000_000,
    cap: "฿10M",
    blurb:
      "The entry band for a private-pool villa in Phuket — usually two or three bedrooms, inland from the beach, on a leasehold or company-held plot.",
  },
  {
    slug: "villas-under-15m",
    type: "villas",
    max: 15_000_000,
    cap: "฿15M",
    blurb:
      "Where most family pool villas sit: three to four bedrooms in a gated estate, ten to twenty minutes from the west-coast beaches.",
  },
  {
    slug: "villas-under-20m",
    type: "villas",
    max: 20_000_000,
    cap: "฿20M",
    blurb:
      "Larger and newer pool villas, and the first addresses close to Laguna, Bang Tao and Nai Harn.",
  },
  {
    slug: "houses-under-10m",
    type: "houses",
    max: 10_000_000,
    cap: "฿10M",
    blurb:
      "Family houses in managed estates — the practical alternative to a villa when a private pool is not the point.",
  },
  {
    slug: "condos-under-3m",
    type: "condos",
    max: 3_000_000,
    cap: "฿3M",
    blurb:
      "Studios and one-bedroom apartments — the cheapest way for a foreigner to own property in Phuket freehold, in their own name.",
  },
  {
    slug: "condos-under-5m",
    type: "condos",
    max: 5_000_000,
    cap: "฿5M",
    blurb:
      "One- and two-bedroom apartments in managed buildings, the band most rental-yield buyers shop in.",
  },
  {
    slug: "condos-under-10m",
    type: "condos",
    max: 10_000_000,
    cap: "฿10M",
    blurb:
      "Two- and three-bedroom apartments, sea-view floors and resort-managed residences.",
  },
];

export const getPriceBandPage = (slug: string) =>
  PRICE_BAND_PAGES.find((b) => b.slug === slug);

/** The property-type page a band filters. Every band names a real one. */
export const bandType = (band: PriceBandPage) => {
  const type = PROPERTY_TYPE_PAGES.find((t) => t.slug === band.type);
  if (!type) throw new Error(`Price band ${band.slug} names an unknown type: ${band.type}`);
  return type;
};

/** Is this listing inside the band? Priced, of the right type, at or under the cap. */
export function isInPriceBand(property: Property, band: PriceBandPage): boolean {
  if (property.price == null || property.price <= 0) return false;
  return property.price <= band.max && isPropertyTypeMatch(property, bandType(band));
}

/** "Villas for Sale in Phuket under ฿15M" */
export const bandHeading = (band: PriceBandPage) =>
  `${bandType(band).plural} for Sale in Phuket under ${band.cap}`;

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
