/**
 * The `/rent/<area>` and `/buy/<area>` landing pages.
 *
 * These carry the searches that actually convert — "villa for rent in Bang Tao",
 * "house for sale Rawai" — which the island-wide /rent and /buy pages can never
 * rank for, and which the /areas guides dilute by mixing sale and rental stock.
 */

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { PropertyGrid } from "@/components/property/property-grid";
import { AreaPropertyFilters } from "@/components/property/area-property-filters";
import { ButtonLink } from "@/components/ui/button";
import { AREAS, type AreaInfo } from "@/lib/constants";
import { getPropertiesByArea } from "@/lib/data";
import { comboPath } from "@/lib/area-type-pages";
import {
  PROPERTY_TYPE_PAGES,
  isPropertyTypeMatch,
} from "@/lib/property-type-pages";
import {
  areaIntentHeading,
  breadcrumbJsonLd,
  listingItemListJsonLd,
  matchesIntent,
  priceRange,
  typeLabel,
  type Intent,
} from "@/lib/seo";
import type { Property } from "@/lib/types";

/** Listings for one area and one intent, newest first. */
export async function areaIntentProperties(
  area: AreaInfo,
  intent: Intent,
): Promise<Property[]> {
  const all = await getPropertiesByArea(area.slug);
  return all.filter((p) => matchesIntent(p, intent));
}

/** Type breakdown used for the on-page "browse by type" copy. */
function typeCounts(properties: Property[]) {
  const counts = new Map<string, number>();
  for (const p of properties) {
    const t = typeLabel(p);
    counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

export type AreaFilters = {
  propertyType?: string;
  bedrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price-asc" | "price-desc";
};

type RawParams = { [key: string]: string | string[] | undefined };

function str(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}
function num(v: string | string[] | undefined): number | undefined {
  const s = str(v);
  if (!s) return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

/** The area page's own query params — no `area`, that's fixed by the route. */
export function parseAreaFilters(searchParams: RawParams): AreaFilters {
  return {
    propertyType: str(searchParams.propertyType),
    bedrooms: num(searchParams.bedrooms),
    minPrice: num(searchParams.minPrice),
    maxPrice: num(searchParams.maxPrice),
    sort: (str(searchParams.sort) as AreaFilters["sort"]) || "newest",
  };
}

function applyAreaFilters(properties: Property[], f: AreaFilters): Property[] {
  let out = properties;
  if (f.propertyType) out = out.filter((p) => p.property_type === f.propertyType);
  if (f.bedrooms != null) out = out.filter((p) => p.bedrooms >= f.bedrooms!);
  if (f.minPrice != null) out = out.filter((p) => (p.price ?? 0) >= f.minPrice!);
  if (f.maxPrice != null) out = out.filter((p) => (p.price ?? 0) <= f.maxPrice!);

  if (f.sort === "price-asc") out = [...out].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  else if (f.sort === "price-desc") out = [...out].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
  return out;
}

export async function AreaIntentPage({
  area,
  intent,
  properties,
  filters = {},
}: {
  area: AreaInfo;
  intent: Intent;
  properties: Property[];
  filters?: AreaFilters;
}) {
  const other: Intent = intent === "rent" ? "buy" : "rent";
  const heading = areaIntentHeading(area, intent, properties);
  const range = priceRange(properties, intent);
  const types = typeCounts(properties);
  const verb = intent === "rent" ? "for rent" : "for sale";

  const filtered = applyAreaFilters(properties, filters);
  const isFiltering = Boolean(
    filters.propertyType ||
      filters.bedrooms ||
      filters.minPrice != null ||
      filters.maxPrice != null ||
      (filters.sort && filters.sort !== "newest"),
  );

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: intent === "rent" ? "Rent" : "Buy", path: `/${intent}` },
    { name: area.name, path: `/${intent}/${area.slug}` },
  ]);
  const itemList = listingItemListJsonLd(properties, heading, `/${intent}/${area.slug}`);

  // Sibling areas that actually have stock for this intent, for the footer links.
  const siblings = AREAS.filter((a) => a.slug !== area.slug);

  // Area × type pages, for the combinations that have real stock on this side.
  const typePages = PROPERTY_TYPE_PAGES.map((type) => ({
    type,
    count: properties.filter((p) => isPropertyTypeMatch(p, type)).length,
  })).filter((r) => r.count > 0);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {properties.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
        />
      )}

      {/* Hero */}
      <section className="relative flex min-h-[46vh] items-end overflow-hidden pb-10 pt-32">
        <Image
          src={area.image}
          alt={`${area.name}, Phuket`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/40" />
        <Container className="relative">
          <nav className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em] text-paper/60">
            <Link href="/" className="hover:text-gold">
              Home
            </Link>
            <span>/</span>
            <Link href={`/${intent}`} className="hover:text-gold">
              {intent === "rent" ? "Rent" : "Buy"}
            </Link>
            <span>/</span>
            <span className="text-paper/85">{area.name}</span>
          </nav>
          <h1 className="display-caps mt-4 text-4xl text-paper sm:text-5xl">{heading}</h1>
          <p className="mt-4 max-w-2xl text-paper/80">
            {properties.length > 0 ? (
              <>
                {properties.length}{" "}
                {properties.length === 1 ? "property" : "properties"} {verb} in{" "}
                {area.name}
                {range ? `, ${range}` : ""}. {area.tagline}.
              </>
            ) : (
              <>
                We have no {area.name} listings {verb} on the site right now — tell us
                what you are looking for and we will match you off-market.
              </>
            )}
          </p>
        </Container>
      </section>

      {/* Listings */}
      <section className="bg-charcoal py-16">
        <Container>
          <SectionHeading
            kicker={intent === "rent" ? "Available rentals" : "Available now"}
            title={`${area.name} ${intent === "rent" ? "rentals" : "property for sale"}`}
            description={area.blurb}
          />

          <div className="mt-8">
            <AreaPropertyFilters listingType={intent === "rent" ? "rent" : "sale"} />
          </div>
          {properties.length > 0 && (
            <p className="mt-6 text-sm text-paper/60">
              <span className="font-semibold text-paper">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "property" : "properties"}{" "}
              {isFiltering ? "found" : verb}
            </p>
          )}

          <div className="mt-6">
            <PropertyGrid
              properties={filtered}
              emptyMessage={
                isFiltering
                  ? `No ${area.name} listings match those filters. Try widening your search, or clear the filters above.`
                  : `No ${area.name} listings ${verb} at the moment. Browse the other areas below, or send us your requirements.`
              }
            />
          </div>

          {types.length > 0 && (
            <p className="mt-10 text-sm text-paper/65">
              Currently {verb} in {area.name}:{" "}
              {types
                .map(([t, n]) => `${n} ${t.toLowerCase()}${n === 1 ? "" : "s"}`)
                .join(", ")}
              .
            </p>
          )}

          {/* The filter bar is for this visit; these are pages of their own, and
              they carry the phrase people search: "villas for sale in Rawai". */}
          {typePages.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {typePages.map(({ type, count }) => (
                <li key={type.slug}>
                  <Link
                    href={comboPath(intent, { area, type })}
                    className="text-paper/75 underline-offset-4 hover:text-gold hover:underline"
                  >
                    {type.plural} {verb} in {area.name}{" "}
                    <span className="text-paper/40">({count})</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink href={`/${other}/${area.slug}`} variant="outline">
              {other === "rent"
                ? `Rentals in ${area.name}`
                : `Property for sale in ${area.name}`}
            </ButtonLink>
            <ButtonLink href={`/areas/${area.slug}`} variant="outline">
              {area.name} area guide
            </ButtonLink>
            <ButtonLink href="/contact">Ask about {area.name}</ButtonLink>
          </div>
        </Container>
      </section>

      {/* Internal links: every other area, both intents */}
      <section className="bg-ink py-16">
        <Container>
          <SectionHeading
            kicker="Keep looking"
            title={`Other Phuket areas ${verb}`}
          />
          <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {siblings.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/${intent}/${a.slug}`}
                  className="text-paper/75 underline-offset-4 hover:text-gold hover:underline"
                >
                  {a.name} property {verb}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
