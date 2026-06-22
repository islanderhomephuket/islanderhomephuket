import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
