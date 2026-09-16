/**
 * Property-type landing pages: `/buy/villas`, `/rent/condos`, and so on.
 *
 * Renters search by area ("house for rent in Bang Tao"), but buyers search by
 * what the thing IS first — "pool villa for sale Phuket" — and three quarters of
 * the sale book is villas. Until these pages existed the only thing answering
 * that query was `/buy`, one generic page for every type at once.
 *
 * They share the `/buy/[area]` and `/rent/[area]` routes rather than sitting
 * under a `/type/` prefix, because `/buy/villas` is the URL worth having. Area
 * slugs win any collision; `assertNoSlugCollision` makes sure there isn't one.
 */

import { AREAS } from "@/lib/constants";
import type { Property } from "@/lib/types";

export interface PropertyTypePage {
  /** URL segment: /buy/<slug> */
  slug: string;
  /** Singular, for a sentence: "villa". */
  singular: string;
  /** Plural, for a heading: "Villas". */
  plural: string;
  /** `property_type` values this page collects. */
  match: string[];
  /** One line of area-agnostic context, used on the page and in the meta. */
  blurb: string;
}

export const PROPERTY_TYPE_PAGES: PropertyTypePage[] = [
  {
    slug: "villas",
    singular: "villa",
    plural: "Villas",
    match: ["Villa"],
    blurb:
      "Detached homes on their own land, nearly always with a private pool — the format most foreign buyers and long-stay families come to Phuket for.",
  },
  {
    slug: "houses",
    singular: "house",
    plural: "Houses",
    match: ["House"],
    blurb:
      "Family houses in gated estates and residential streets, usually without the price premium a private pool adds.",
  },
  {
    slug: "condos",
    singular: "condominium",
    plural: "Condominiums",
    match: ["Condominium", "Apartment"],
    blurb:
      "Apartments in managed buildings — the lowest entry price on the island, and the only type foreigners can own freehold in their own name.",
  },
  {
    slug: "townhouses",
    singular: "townhouse",
    plural: "Townhouses",
    match: ["Townhouse"],
    blurb:
      "Two- and three-storey terraced homes, the middle ground between a condo and a detached house.",
  },
];

export const getPropertyTypePage = (slug: string) =>
  PROPERTY_TYPE_PAGES.find((t) => t.slug === slug);

export const isPropertyTypeMatch = (property: Property, type: PropertyTypePage) =>
  type.match.includes(property.property_type);

/**
 * A `/buy/<slug>` or `/rent/<slug>` segment is either an area or a property
 * type. Areas take precedence so adding a type can never shadow a live area page.
 */
export function resolveIntentSegment(slug: string):
  | { kind: "area"; area: (typeof AREAS)[number] }
  | { kind: "type"; type: PropertyTypePage }
  | null {
  const area = AREAS.find((a) => a.slug === slug);
  if (area) return { kind: "area", area };
  const type = getPropertyTypePage(slug);
  if (type) return { kind: "type", type };
  return null;
}

/**
 * Guards the one way this design can break: a property-type slug that is also an
 * area slug would silently become unreachable. Called from generateStaticParams,
 * so it fails the build rather than shipping a dead page.
 */
export function assertNoSlugCollision() {
  const areaSlugs = new Set(AREAS.map((a) => a.slug));
  const clash = PROPERTY_TYPE_PAGES.filter((t) => areaSlugs.has(t.slug));
  if (clash.length > 0) {
    throw new Error(
      `Property-type slug also used by an area: ${clash.map((c) => c.slug).join(", ")}. ` +
        "Rename the type page — areas win the route.",
    );
  }
}
