/**
 * Search-facing copy and structured data.
 *
 * Listing titles in the database are written for humans ("Renovated Townhome —
 * Baan Chanakan, Naka"); nobody types that into Google. Everything here rebuilds
 * the same listing as the phrase people actually search — intent, bedrooms,
 * property type, area — while keeping the human title for the H1 and the body.
 */

import { AREAS, SITE, getArea, type AreaInfo } from "@/lib/constants";
import type { Property } from "@/lib/types";

/** Canonical origin, without a trailing slash. Must match what Vercel serves. */
export const BASE_URL = SITE.url.replace(/\/$/, "");

export const abs = (path: string) =>
  `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/* ───────────────────────── Phrasing helpers ───────────────────────── */

/** "Villa" → "villa"; keeps multi-word types readable in a sentence. */
const lower = (s: string) => s.toLowerCase();

/** How a listing's type reads in a search phrase. */
export function typeLabel(property: Pick<Property, "property_type">): string {
  const t = (property.property_type || "Property").trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/** "3-Bedroom", "78-Room", "Studio", or "" when the bedroom count tells us nothing. */
export function bedroomLabel(property: Pick<Property, "bedrooms" | "property_type">): string {
  const t = lower(property.property_type || "");
  // A hotel is searched and valued by its room count; "78-Bedroom Hotel" reads as
  // a mistake, and nobody types it.
  if (t.includes("hotel")) return property.bedrooms > 0 ? `${property.bedrooms}-Room` : "";
  if (property.bedrooms > 0) return `${property.bedrooms}-Bedroom`;
  // 0 bedrooms on a condo/apartment is a studio; on land or a shophouse it is unknown.
  if (t.includes("condo") || t.includes("apartment")) return "Studio";
  return "";
}

export const isRental = (p: Pick<Property, "listing_type">) => p.listing_type === "rent";

/** "for Rent" / "for Sale" — "both" listings are sold first, rented second. */
export const intentLabel = (p: Pick<Property, "listing_type">) =>
  isRental(p) ? "for Rent" : "for Sale";

/** Compact price for a title: "฿12.5M" or "฿35,000/mo". */
export function compactPrice(property: Property): string {
  const amount = property.price;
  if (amount == null) return "";
  if (isRental(property)) {
    const period = property.rent_period === "year" ? "yr" : property.rent_period === "day" ? "day" : "mo";
    return `฿${amount.toLocaleString("en-US")}/${period}`;
  }
  if (amount >= 1_000_000) {
    const m = amount / 1_000_000;
    return `฿${m % 1 === 0 ? m.toFixed(0) : m.toFixed(2).replace(/0$/, "")}M`;
  }
  return `฿${amount.toLocaleString("en-US")}`;
}

/** Full price for a sentence: "฿35,000 per month" / "฿12,500,000". */
export function spelledPrice(property: Property): string {
  if (property.price == null) return "price on request";
  const n = `฿${property.price.toLocaleString("en-US")}`;
  return isRental(property) ? `${n} per ${property.rent_period ?? "month"}` : n;
}

export const areaName = (slug: string) => getArea(slug)?.name ?? "Phuket";

/* ───────────────────────── Property pages ───────────────────────── */

/**
 * The keyword phrase for a listing, without the price:
 * "3-Bedroom Villa for Rent in Bang Tao, Phuket".
 */
export function propertyPhrase(property: Property): string {
  const beds = bedroomLabel(property);
  const head = [beds, typeLabel(property)].filter(Boolean).join(" ");
  const area = areaName(property.area_slug);
  // "Phuket Town, Phuket" reads badly and wastes title characters — areas whose
  // own name already carries "Phuket" stand alone.
  const where = area.includes("Phuket") ? area : `${area}, Phuket`;
  return `${head} ${intentLabel(property)} in ${where}`;
}

/**
 * `<title>`. Keyword phrase first, price last so near-identical listings in the
 * same area still get distinct titles. Set as an absolute title — the site-wide
 * " | Islander Home Phuket" suffix would push this past what Google displays.
 */
export function propertyTitle(property: Property): string {
  const price = compactPrice(property);
  return price ? `${propertyPhrase(property)} — ${price}` : propertyPhrase(property);
}

/** First real sentence of the listing copy, collapsed onto one line. */
function firstSentence(text: string, max = 90): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (!flat) return "";
  const stop = flat.search(/[.!?](\s|$)/);
  const sentence = stop === -1 ? flat : flat.slice(0, stop + 1);
  if (sentence.length <= max) return sentence;
  return `${sentence.slice(0, sentence.lastIndexOf(" ", max)).trimEnd()}…`;
}

/**
 * `<meta name="description">`. The raw listing copy was being sliced at 160
 * characters mid-word, newlines and all; this leads with the facts a searcher
 * is scanning for and only then borrows from the copy.
 */
export function propertyDescription(property: Property): string {
  const beds = bedroomLabel(property);
  const head = [lower(beds), lower(typeLabel(property))].filter(Boolean).join(" ");
  const area = areaName(property.area_slug);
  const verb = isRental(property) ? "for rent" : "for sale";
  const where = area.includes("Phuket") ? area : `${area}, Phuket`;
  const bits = [`${head.charAt(0).toUpperCase()}${head.slice(1)} ${verb} in ${where} at ${spelledPrice(property)}.`];

  const extra = firstSentence(property.description, 100);
  if (extra) bits.push(extra);

  let out = bits.join(" ");
  const tail = " Enquire with Islander Home Phuket.";
  if (out.length + tail.length <= 158) out += tail;
  return out.length > 158 ? `${out.slice(0, 157).trimEnd()}…` : out;
}

/** Rental period → UN/CEFACT unit code, for the Offer's price specification. */
const RENT_UNIT: Record<string, string> = { day: "DAY", week: "WEE", month: "MON", year: "ANN" };

/** Schema.org type that best matches the listing. */
function residenceType(property: Property): string {
  const t = lower(property.property_type || "");
  // Checked before "house" — "hotel" does not contain it, but the intent is that
  // a commercial lease is a LodgingBusiness, never a dwelling.
  if (t.includes("hotel")) return "Hotel";
  if (t.includes("condo")) return "Apartment";
  if (t.includes("apartment")) return "Apartment";
  if (t.includes("townhouse")) return "SingleFamilyResidence";
  if (t.includes("villa") || t.includes("house")) return "SingleFamilyResidence";
  return "Residence";
}

/**
 * RealEstateListing describing the page, with the dwelling itself under `about`
 * and the price under `offers`. Deliberately NOT Product schema — Google's
 * merchant rich results are for retail pages and would be a mismatch here.
 */
export function propertyJsonLd(property: Property) {
  const url = abs(`/properties/${property.slug}`);
  const area = getArea(property.area_slug);
  const images = (property.images ?? [])
    .slice(0, 12)
    .map((i) => i.url)
    .filter(Boolean);

  const residence: Record<string, unknown> = {
    "@type": residenceType(property),
    name: property.title,
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address ?? undefined,
      addressLocality: area?.name ?? "Phuket",
      addressRegion: "Phuket",
      addressCountry: "TH",
    },
  };
  if (property.bedrooms > 0) residence.numberOfBedrooms = property.bedrooms;
  if (property.bathrooms > 0) residence.numberOfBathroomsTotal = property.bathrooms;
  if (property.living_area)
    residence.floorSize = {
      "@type": "QuantitativeValue",
      value: property.living_area,
      unitCode: "MTK",
    };
  if (property.land_area)
    residence.lotSize = {
      "@type": "QuantitativeValue",
      value: property.land_area,
      unitCode: "MTK",
    };
  const lat = property.latitude ?? area?.coords.lat;
  const lng = property.longitude ?? area?.coords.lng;
  if (lat != null && lng != null)
    residence.geo = { "@type": "GeoCoordinates", latitude: lat, longitude: lng };
  if (property.features.length) residence.amenityFeature = property.features.map((f) => ({
    "@type": "LocationFeatureSpecification",
    name: f,
    value: true,
  }));

  const offer: Record<string, unknown> | undefined =
    property.price == null
      ? undefined
      : {
          "@type": "Offer",
          price: property.price,
          priceCurrency: "THB",
          availability:
            property.status === "available"
              ? "https://schema.org/InStock"
              : "https://schema.org/SoldOut",
          url,
          // Renting out vs selling — the distinction Google needs to tell the two apart.
          businessFunction: isRental(property)
            ? "http://purl.org/goodrelations/v1#LeaseOut"
            : "http://purl.org/goodrelations/v1#Sell",
          ...(isRental(property)
            ? {
                priceSpecification: {
                  "@type": "UnitPriceSpecification",
                  price: property.price,
                  priceCurrency: "THB",
                  // UN/CEFACT codes — a nightly holiday rate is not a monthly one.
                  unitCode: RENT_UNIT[property.rent_period ?? "month"] ?? "MON",
                },
              }
            : {}),
        };

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `${url}#listing`,
    url,
    name: propertyPhrase(property),
    headline: property.title,
    description: property.description,
    datePosted: property.created_at,
    ...(images.length ? { image: images } : {}),
    about: residence,
    ...(offer ? { offers: offer } : {}),
    provider: {
      "@type": "RealEstateAgent",
      name: SITE.name,
      url: BASE_URL,
      telephone: SITE.phoneDisplay,
    },
  };
}

/* ───────────────────────── Breadcrumbs ───────────────────────── */

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: step.name,
      item: abs(step.path),
    })),
  };
}

/** Home → Rent/Buy → area hub → this listing. */
export function propertyBreadcrumb(property: Property) {
  const intent = isRental(property) ? "rent" : "buy";
  const area = getArea(property.area_slug);
  const trail = [
    { name: "Home", path: "/" },
    { name: isRental(property) ? "Rent" : "Buy", path: `/${intent}` },
  ];
  if (area)
    trail.push({
      name: `${area.name} ${isRental(property) ? "rentals" : "property for sale"}`,
      path: `/${intent}/${area.slug}`,
    });
  trail.push({ name: property.title, path: `/properties/${property.slug}` });
  return breadcrumbJsonLd(trail);
}

/* ───────────────────────── Area landing pages ───────────────────────── */

export type Intent = "rent" | "buy";

/** Listings that belong on an intent page — "both" counts as for sale. */
export function matchesIntent(property: Property, intent: Intent): boolean {
  return intent === "rent"
    ? property.listing_type === "rent"
    : property.listing_type === "sale" || property.listing_type === "both";
}

/** "Villas & Houses for Rent in Bang Tao, Phuket" — built from real inventory. */
export function areaIntentHeading(area: AreaInfo, intent: Intent, properties: Property[]): string {
  const counts = new Map<string, number>();
  for (const p of properties) {
    const t = typeLabel(p);
    counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([t]) => plural(t));
  const what = top.length === 0 ? "Property" : top.join(" & ");
  const where = area.name.includes("Phuket") ? area.name : `${area.name}, Phuket`;
  return `${what} ${intent === "rent" ? "for Rent" : "for Sale"} in ${where}`;
}

function plural(type: string): string {
  if (/(s|x|ch|sh)$/i.test(type)) return `${type}es`;
  if (/y$/i.test(type)) return `${type.slice(0, -1)}ies`;
  return `${type}s`;
}

/** "฿25,000 – ฿250,000 per month" / "฿4.5M – ฿48M". */
export function priceRange(properties: Property[], intent: Intent): string {
  const prices = properties.map((p) => p.price).filter((n): n is number => n != null && n > 0);
  if (!prices.length) return "";
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const fmt = (n: number) =>
    intent === "rent"
      ? `฿${n.toLocaleString("en-US")}`
      : n >= 1_000_000
        ? `฿${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`
        : `฿${n.toLocaleString("en-US")}`;
  const span = min === max ? fmt(min) : `${fmt(min)} – ${fmt(max)}`;
  return intent === "rent" ? `${span} per month` : span;
}

export function areaIntentDescription(
  area: AreaInfo,
  intent: Intent,
  properties: Property[],
): string {
  const n = properties.length;
  const verb = intent === "rent" ? "for rent" : "for sale";
  if (n === 0)
    return `${area.name} property ${verb} in Phuket. ${firstSentence(area.blurb, 90)} Enquire with Islander Home Phuket.`;
  const range = priceRange(properties, intent);
  const head = `${n} ${n === 1 ? "property" : "properties"} ${verb} in ${area.name}, Phuket`;
  const withRange = range ? `${head} — ${range}.` : `${head}.`;
  const tail = " Villas, houses and condos from Islander Home Phuket.";
  return `${withRange}${withRange.length + tail.length <= 158 ? tail : ""}`;
}

/** ItemList so Google can see the page is a real, ordered set of listings. */
export function listingItemListJsonLd(properties: Property[], name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url: abs(path),
    numberOfItems: properties.length,
    itemListElement: properties.slice(0, 60).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: abs(`/properties/${p.slug}`),
      name: propertyPhrase(p),
    })),
  };
}

/**
 * Areas worth a landing page for this intent. Below the threshold the page would
 * be thin — it still renders (so nothing 404s) but it is kept out of the index.
 */
export const INDEXABLE_MIN_LISTINGS = 3;

export const areaIntentPaths = () =>
  AREAS.flatMap((a) => [`/rent/${a.slug}`, `/buy/${a.slug}`]);

/* ───────────────────────── Blog ───────────────────────── */

/** BlogPosting so articles are eligible for article treatment in Search. */
export function blogPostJsonLd(post: {
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string | null;
  author: string;
  published_at: string | null;
  updated_at: string;
  tags: string[];
}) {
  const url = abs(`/blog/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#post`,
    url,
    mainEntityOfPage: url,
    headline: post.title,
    description: post.excerpt,
    ...(post.cover_image ? { image: [post.cover_image] } : {}),
    ...(post.published_at ? { datePublished: post.published_at } : {}),
    dateModified: post.updated_at,
    inLanguage: /[฀-๿]/.test(post.title) ? "th" : "en",
    keywords: post.tags.join(", "),
    author: { "@type": "Organization", name: post.author || SITE.name },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: abs("/logo.png") },
    },
  };
}
