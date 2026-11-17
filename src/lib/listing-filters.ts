/**
 * Filtering for the /rent, /buy and /rent/<area>, /buy/<area> listing pages,
 * run in the browser.
 *
 * These pages used to read `searchParams` on the server, which forces Next.js to
 * render them on EVERY request — no cache at all — and the bare /rent and /buy
 * pages paid that too, filters or not. With ~900 listings and crawlers walking
 * every hub page, that was the bulk of the server CPU, and on 14/11/2026 Vercel
 * paused the whole site for exceeding the Hobby plan's fair-use CPU limit.
 *
 * Now the pages are static (ISR) and ship the listing set once; the filter bar
 * still writes the same query string, and these functions apply it client-side.
 * Old links with ?area=… keep working — the query is simply read in the browser.
 */
import { normalizePropertyType } from "./property-type-pages";
import { FILTERABLE_AMENITIES, hasAmenity, type AmenityFlag } from "./amenities";
import type { Property } from "./types";

type Sort = "newest" | "price-asc" | "price-desc";

export type ListingFilters = {
  area?: string;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  query?: string;
  sort?: Sort;
  /** Amenity slugs that must ALL be present — "pool", "furnished", "pets". */
  amenities?: AmenityFlag[];
};

/** `?has=pool,furnished` — one parameter, so the URL stays short. */
const AMENITY_PARAM = "has";
const KNOWN_AMENITIES = new Set(FILTERABLE_AMENITIES.map((a) => a.flag));

function amenityList(v: string | null): AmenityFlag[] | undefined {
  if (!v) return undefined;
  const out = v
    .split(",")
    .map((s) => s.trim())
    .filter((s): s is AmenityFlag => KNOWN_AMENITIES.has(s as AmenityFlag));
  return out.length ? out : undefined;
}

function num(v: string | null): number | undefined {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export function parseListingFilters(params: URLSearchParams): ListingFilters {
  return {
    area: params.get("area") || undefined,
    propertyType: params.get("propertyType") || undefined,
    bedrooms: num(params.get("bedrooms")),
    bathrooms: num(params.get("bathrooms")),
    minPrice: num(params.get("minPrice")),
    maxPrice: num(params.get("maxPrice")),
    query: params.get("q") || undefined,
    sort: (params.get("sort") as Sort) || "newest",
    amenities: amenityList(params.get(AMENITY_PARAM)),
  };
}

export function isFiltering(f: ListingFilters): boolean {
  return Boolean(
    f.area ||
      f.propertyType ||
      f.bedrooms ||
      f.bathrooms ||
      f.minPrice != null ||
      f.maxPrice != null ||
      f.query ||
      f.amenities?.length ||
      (f.sort && f.sort !== "newest"),
  );
}

/** Price relevant to the page (sale vs rent) for listings that are both. */
function effectivePrice(p: Property, listingType: "sale" | "rent"): number {
  if (p.listing_type === "both" && listingType === "rent") return p.rent_price ?? 0;
  return p.price ?? 0;
}

export function applyListingFilters(
  list: Property[],
  f: ListingFilters,
  listingType: "sale" | "rent",
): Property[] {
  let out = list;
  if (f.area) out = out.filter((p) => p.area_slug === f.area);
  if (f.propertyType) {
    const want = normalizePropertyType(f.propertyType);
    out = out.filter((p) => normalizePropertyType(p.property_type) === want);
  }
  if (f.bedrooms != null) out = out.filter((p) => p.bedrooms >= f.bedrooms!);
  if (f.bathrooms != null) out = out.filter((p) => p.bathrooms >= f.bathrooms!);
  if (f.amenities?.length)
    out = out.filter((p) => f.amenities!.every((a) => hasAmenity(p, a)));
  if (f.minPrice != null)
    out = out.filter((p) => effectivePrice(p, listingType) >= f.minPrice!);
  if (f.maxPrice != null)
    out = out.filter((p) => effectivePrice(p, listingType) <= f.maxPrice!);
  if (f.query) {
    const q = f.query.toLowerCase();
    out = out.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.area_slug.toLowerCase().includes(q) ||
        (p.reference ?? "").toLowerCase().includes(q),
    );
  }
  if (f.sort === "price-asc")
    out = [...out].sort((a, b) => effectivePrice(a, listingType) - effectivePrice(b, listingType));
  else if (f.sort === "price-desc")
    out = [...out].sort((a, b) => effectivePrice(b, listingType) - effectivePrice(a, listingType));
  return out;
}
