/**
 * `/buy/<area>/<type>` — the two axes a buyer actually combines.
 *
 * "Pool villa for sale in Rawai", "condo for sale Patong", "house for sale Koh
 * Kaew": one area, one type, nothing else on the page. `/buy/rawai` answers the
 * area half and `/buy/villas` the type half, but neither can rank for the phrase
 * that has both, and that phrase is the one an actual buyer types.
 *
 * A combination with almost nothing behind it is a doorway page, so the page
 * still renders (links never dead-end) but stays out of the index until the
 * stock is real — the same `INDEXABLE_MIN_LISTINGS` rule the hubs use.
 */

import { AREAS, type AreaInfo } from "@/lib/constants";
import {
  PROPERTY_TYPE_PAGES,
  isPropertyTypeMatch,
  type PropertyTypePage,
} from "@/lib/property-type-pages";
import { matchesIntent, priceRange, type Intent } from "@/lib/seo";
import type { Property } from "@/lib/types";

export interface AreaTypeCombo {
  area: AreaInfo;
  type: PropertyTypePage;
}

export function resolveAreaTypeCombo(
  areaSlug: string,
  typeSlug: string,
): AreaTypeCombo | null {
  const area = AREAS.find((a) => a.slug === areaSlug);
  const type = PROPERTY_TYPE_PAGES.find((t) => t.slug === typeSlug);
  return area && type ? { area, type } : null;
}

export const comboPath = (intent: Intent, { area, type }: AreaTypeCombo) =>
  `/${intent}/${area.slug}/${type.slug}`;

export function comboProperties(
  all: Property[],
  { area, type }: AreaTypeCombo,
  intent: Intent,
): Property[] {
  return all.filter(
    (p) =>
      p.area_slug === area.slug &&
      matchesIntent(p, intent) &&
      isPropertyTypeMatch(p, type),
  );
}

/** "Villas for Sale in Rawai, Phuket" — area names that carry "Phuket" stand alone. */
export function comboHeading({ area, type }: AreaTypeCombo, intent: Intent): string {
  const where = area.name.includes("Phuket") ? area.name : `${area.name}, Phuket`;
  return `${type.plural} for ${intent === "rent" ? "Rent" : "Sale"} in ${where}`;
}

export function comboDescription(
  combo: AreaTypeCombo,
  intent: Intent,
  properties: Property[],
): string {
  const { area, type } = combo;
  const verb = intent === "rent" ? "for rent" : "for sale";
  const n = properties.length;
  if (n === 0)
    return `${type.plural} ${verb} in ${area.name}, Phuket. ${type.blurb}`.slice(0, 158);
  const range = priceRange(properties, intent);
  const head = `${n} ${n === 1 ? type.singular : `${type.singular}s`} ${verb} in ${area.name}, Phuket${range ? ` — ${range}` : ""}.`;
  const tail = " Current listings from Islander Home Phuket.";
  return (head.length + tail.length <= 158 ? head + tail : head).slice(0, 158);
}

/** Every combination, for generateStaticParams and the sitemap. */
export const allCombos = (): AreaTypeCombo[] =>
  AREAS.flatMap((area) => PROPERTY_TYPE_PAGES.map((type) => ({ area, type })));
