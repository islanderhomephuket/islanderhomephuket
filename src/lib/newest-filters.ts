/**
 * Sale/rent split and price bands for the Newest list.
 *
 * The Newest page is one stream of everything published in the window, and at
 * ~65 listings a week (53 of them rentals) that stream buries the 12 sale
 * listings underneath it. A buyer scrolling for a villa has to read past forty
 * condo rentals to find out there are five. These filters refine the list the
 * page already holds — they are applied in the browser, not by a new query, so
 * the full unfiltered set still renders into the HTML for Google.
 *
 * Price bands are deliberately separate per intent: a rental band is a month
 * and a sale band is a capital price, so "฿20K" and "฿20M" can never share a
 * selector. That is also why the price control only appears once For Sale or
 * For Rent is chosen — there is no single price axis across both.
 */

import type { Property } from "@/lib/types";

export type NewestIntent = "all" | "sale" | "rent";

export interface NewestPriceBand {
  /** URL value and React key. */
  id: string;
  /** How it reads in the selector. */
  label: string;
  /** Inclusive floor, in baht. */
  min: number;
  /** Exclusive ceiling, in baht; omitted means open-ended. */
  max?: number;
}

/**
 * Bands follow where the stock actually sits rather than round numbers for
 * their own sake: over the last 30 days two thirds of the sale book was under
 * ฿5M, and the rental median was ฿35K/month.
 */
export const NEWEST_SALE_BANDS: NewestPriceBand[] = [
  { id: "under-3m", label: "Under ฿3M", min: 0, max: 3_000_000 },
  { id: "3m-5m", label: "฿3M – ฿5M", min: 3_000_000, max: 5_000_000 },
  { id: "5m-10m", label: "฿5M – ฿10M", min: 5_000_000, max: 10_000_000 },
  { id: "10m-20m", label: "฿10M – ฿20M", min: 10_000_000, max: 20_000_000 },
  { id: "20m-50m", label: "฿20M – ฿50M", min: 20_000_000, max: 50_000_000 },
  { id: "over-50m", label: "฿50M and above", min: 50_000_000 },
];

export const NEWEST_RENT_BANDS: NewestPriceBand[] = [
  { id: "under-15k", label: "Under ฿15K / month", min: 0, max: 15_000 },
  { id: "15k-25k", label: "฿15K – ฿25K / month", min: 15_000, max: 25_000 },
  { id: "25k-40k", label: "฿25K – ฿40K / month", min: 25_000, max: 40_000 },
  { id: "40k-60k", label: "฿40K – ฿60K / month", min: 40_000, max: 60_000 },
  { id: "60k-100k", label: "฿60K – ฿100K / month", min: 60_000, max: 100_000 },
  { id: "over-100k", label: "฿100K and above", min: 100_000 },
];

export const bandsForIntent = (intent: NewestIntent): NewestPriceBand[] =>
  intent === "sale"
    ? NEWEST_SALE_BANDS
    : intent === "rent"
      ? NEWEST_RENT_BANDS
      : [];

export const getNewestBand = (intent: NewestIntent, id: string | null) =>
  id ? bandsForIntent(intent).find((b) => b.id === id) : undefined;

export const isForSale = (p: Property) =>
  p.listing_type === "sale" || p.listing_type === "both";

export const isForRent = (p: Property) =>
  p.listing_type === "rent" || p.listing_type === "both";

/**
 * The number this listing should be banded on, or null when it has none to
 * band — unpriced, or a rent quoted by the night or the year, which must not be
 * compared against a monthly band. `rent_price` only carries a value on a
 * "both" listing; a pure rental keeps its monthly rent in `price`.
 */
export function newestBandPrice(
  p: Property,
  intent: "sale" | "rent",
): number | null {
  if (intent === "sale") return p.price && p.price > 0 ? p.price : null;
  if ((p.rent_period ?? "month") !== "month") return null;
  const rent = p.listing_type === "both" ? (p.rent_price ?? p.price) : p.price;
  return rent && rent > 0 ? rent : null;
}

export const matchesNewestBand = (
  p: Property,
  intent: "sale" | "rent",
  band: NewestPriceBand,
) => {
  const price = newestBandPrice(p, intent);
  if (price == null) return false;
  return price >= band.min && (band.max == null || price < band.max);
};

/** The sale/rent split only — the counts shown on the intent tabs. */
export function filterNewestByIntent(
  properties: Property[],
  intent: NewestIntent,
): Property[] {
  if (intent === "all") return properties;
  return properties.filter(intent === "sale" ? isForSale : isForRent);
}

/** Intent, then price. A band is ignored when the intent is "all". */
export function filterNewest(
  properties: Property[],
  intent: NewestIntent,
  bandId: string | null,
): Property[] {
  const byIntent = filterNewestByIntent(properties, intent);
  if (intent === "all") return byIntent;
  const band = getNewestBand(intent, bandId);
  if (!band) return byIntent;
  return byIntent.filter((p) => matchesNewestBand(p, intent, band));
}
