import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Property } from "@/lib/types";

/** Merge Tailwind classes with conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as Thai Baht. */
export function formatTHB(amount: number | null | undefined): string {
  if (amount == null) return "Price on request";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format a rental price with a period suffix. */
export function formatRent(
  amount: number | null | undefined,
  period: string | null | undefined = "month",
): string {
  if (amount == null) return "Price on request";
  return `${formatTHB(amount)}/${period ?? "month"}`;
}

/** Compact area in square metres. */
export function formatArea(sqm: number | null | undefined): string {
  if (!sqm) return "—";
  return `${new Intl.NumberFormat("en-US").format(sqm)} m²`;
}

/** Human-friendly date. */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Slugify a string for URLs. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Truncate text to a word boundary. */
export function excerpt(text: string, maxLength = 160): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, text.lastIndexOf(" ", maxLength)).trimEnd() + "…";
}

/**
 * True if the listing text itself offers a lease shorter than a year (a
 * quoted month count under 12, a nightly/weekly/daily rate, or "short term"
 * wording), or if it's priced by day/week. Used to decide whether a rental
 * can be labelled "1 Year Lease Only".
 */
export function hasShortTermOption(
  description: string,
  rentPeriod?: string | null,
): boolean {
  if (rentPeriod === "day" || rentPeriod === "week") return true;
  const text = description.toLowerCase();
  if (
    /short[\s-]?term|short[\s-]?stay|short\s*let|flexible\s+(lease|term|contract)|nightly|per\s*night|\/\s*night|per\s*day|\/\s*day|daily\s*rate|weekly\s*rate|per\s*week|\/\s*week/.test(
      text,
    )
  ) {
    return true;
  }
  for (const m of text.matchAll(/(\d{1,2})\s*[-\s]?\s*month/g)) {
    const n = parseInt(m[1], 10);
    if (n > 0 && n < 12) return true;
  }
  return false;
}

/** True if a rental listing should show "1 Year Lease Only" — no shorter option is quoted anywhere in the text. */
export function oneYearLeaseOnly(property: Property): boolean {
  const isRental =
    property.listing_type === "rent" || property.listing_type === "both";
  if (!isRental) return false;
  return !hasShortTermOption(property.description, property.rent_period);
}

/**
 * Pick a representative photo for an area from current inventory.
 * Prefers a featured listing so the area grid leads with the best photography.
 */
export function areaCoverImage(
  properties: { area_slug: string; cover_image?: string; is_featured: boolean }[],
  areaSlug: string,
): string | undefined {
  const inArea = properties.filter((p) => p.area_slug === areaSlug && p.cover_image);
  return (inArea.find((p) => p.is_featured) ?? inArea[0])?.cover_image;
}
