/**
 * Amenity landing pages: `/buy/pool-villas`, `/rent/pet-friendly`.
 *
 * The filter bar can already answer "private pool" and "pets allowed", but a
 * filtered URL is a query string: it canonicalises back to the bare hub, so
 * Google never sees it and nobody can link to it from outside. These pages are
 * the same answer as a real, indexable URL with its own title — the pattern the
 * price bands already use, and the one PhuketBuyHouse ranks on with its
 * "Property Selections" (Sea View 616, Pet Friendly 120, Beachfront 75).
 *
 * They live on the `/buy/[area]` and `/rent/[area]` routes beside areas, types
 * and bands. Areas win any collision; `assertNoAmenityCollision` fails the
 * build if a slug ever shadows one.
 *
 * Only combinations with real stock get a page. Counted over the 420 available
 * listings on 17/11/2026: pool villas for sale 134, pool villas to rent 45,
 * furnished condos to rent 54, pet-friendly rentals 15. Gated estates (39 rent,
 * 26 sale) and pet-friendly sales (4) are deliberately left out — the first is
 * not a phrase people search, the second has nothing behind it.
 */

import { AREAS } from "@/lib/constants";
import type { Property } from "@/lib/types";
import { hasAmenity, type AmenityFlag } from "@/lib/amenities";
import { PROPERTY_TYPE_PAGES, isPropertyTypeMatch } from "@/lib/property-type-pages";
import { PRICE_BAND_PAGES } from "@/lib/price-band-pages";
import type { Intent } from "@/lib/seo";

export interface AmenityPage {
  /** URL segment: /<intent>/<slug> */
  slug: string;
  intent: Intent;
  /** Every one of these must be present on a listing. */
  amenities: AmenityFlag[];
  /** Optional property-type page to narrow to, by its slug. */
  type?: string;
  /** The `<h1>` and title tag. */
  heading: string;
  /** Plural noun for sentences: "pool villas", "pet-friendly rentals". */
  noun: string;
  /** One line of context for the page and its meta description. */
  blurb: string;
}

export const AMENITY_PAGES: AmenityPage[] = [
  {
    slug: "pool-villas",
    intent: "buy",
    amenities: ["pool"],
    type: "villas",
    heading: "Pool Villas for Sale in Phuket",
    noun: "pool villas",
    blurb:
      "Villas with their own pool, not a shared one. A private pool is the single thing most buyers come to Phuket for, and it is what separates a villa from a house on the same plot.",
  },
  {
    slug: "pool-villas",
    intent: "rent",
    amenities: ["pool"],
    type: "villas",
    heading: "Pool Villas for Rent in Phuket",
    noun: "pool villas",
    blurb:
      "Long-term rentals with a pool of their own. Pool care and garden maintenance are normally included in the rent — ask before you sign, because it is the one running cost tenants forget.",
  },
  {
    slug: "furnished-condos",
    intent: "rent",
    amenities: ["furnished"],
    type: "condos",
    heading: "Furnished Condos for Rent in Phuket",
    noun: "furnished condos",
    blurb:
      "Apartments you can move into with a suitcase. Everything here is listed as furnished by the owner — beds, white goods and kitchen included.",
  },
  {
    slug: "pet-friendly",
    intent: "rent",
    amenities: ["pets"],
    heading: "Pet-Friendly Rentals in Phuket",
    // "pet-friendly rentals for rent" reads badly in the meta description,
    // which appends the intent — so the noun says "homes".
    noun: "pet-friendly homes",
    blurb:
      "Homes whose owners accept pets. Most ask for a refundable pet deposit and some set conditions on size or number, so tell us about the animal when you enquire.",
  },
];

export const amenityPagesFor = (intent: Intent) =>
  AMENITY_PAGES.filter((p) => p.intent === intent);

export const getAmenityPage = (slug: string, intent: Intent) =>
  AMENITY_PAGES.find((p) => p.slug === slug && p.intent === intent);

/** Does this listing belong on the page? Every amenity, and the type if set. */
export function isOnAmenityPage(property: Property, page: AmenityPage): boolean {
  if (!page.amenities.every((a) => hasAmenity(property, a))) return false;
  if (!page.type) return true;
  const type = PROPERTY_TYPE_PAGES.find((t) => t.slug === page.type);
  return type ? isPropertyTypeMatch(property, type) : true;
}

/**
 * An amenity slug must never shadow an area, a property type or a price band —
 * the route resolves areas first, so a collision would silently hide the page.
 * Called from generateStaticParams, which runs at build time.
 */
export function assertNoAmenityCollision() {
  const taken = new Set<string>([
    ...AREAS.map((a) => a.slug),
    ...PROPERTY_TYPE_PAGES.map((t) => t.slug),
  ]);
  for (const page of AMENITY_PAGES) {
    if (taken.has(page.slug)) {
      throw new Error(
        `Amenity page "${page.slug}" collides with an area or property-type slug.`,
      );
    }
    if (PRICE_BAND_PAGES.some((b) => b.slug === page.slug && b.intent === page.intent)) {
      throw new Error(
        `Amenity page "/${page.intent}/${page.slug}" collides with a price band.`,
      );
    }
  }
}
