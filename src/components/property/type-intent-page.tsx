/**
 * `/buy/villas`, `/rent/condos` — one property type across the whole island.
 *
 * The listings are grouped by area rather than dumped in one grid, so the page
 * doubles as the link hub between the two axes a buyer actually uses: this type
 * here, that type in that area over there.
 */

import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { PropertyGrid } from "@/components/property/property-grid";
import { ButtonLink } from "@/components/ui/button";
import { AREAS, type AreaInfo } from "@/lib/constants";
import { getProperties } from "@/lib/data";
import { comboPath } from "@/lib/area-type-pages";
import { bandsFor } from "@/lib/price-band-pages";
import {
  isPropertyTypeMatch,
  PROPERTY_TYPE_PAGES,
  type PropertyTypePage,
} from "@/lib/property-type-pages";
import {
  breadcrumbJsonLd,
  listingItemListJsonLd,
  matchesIntent,
  priceRange,
  type Intent,
} from "@/lib/seo";
import type { Property } from "@/lib/types";

/** Cards shown per area before the reader is handed to that area's own page. */
const PER_AREA = 3;

export async function typeIntentProperties(
  type: PropertyTypePage,
  intent: Intent,
): Promise<Property[]> {
  const all = await getProperties();
  return all.filter((p) => matchesIntent(p, intent) && isPropertyTypeMatch(p, type));
}

/** How many of these have a private pool — stated, never assumed. */
export function poolCount(properties: Property[]): number {
  return properties.filter((p) =>
    /\bpool\b/i.test(`${p.title} ${p.description} ${p.features.join(" ")}`),
  ).length;
}

export function typeIntentHeading(type: PropertyTypePage, intent: Intent): string {
  return `${type.plural} for ${intent === "rent" ? "Rent" : "Sale"} in Phuket`;
}

export async function TypeIntentPage({
  type,
  intent,
  properties,
}: {
  type: PropertyTypePage;
  intent: Intent;
  properties: Property[];
}) {
  const heading = typeIntentHeading(type, intent);
  const verb = intent === "rent" ? "for rent" : "for sale";
  const other: Intent = intent === "rent" ? "buy" : "rent";
  const range = priceRange(properties, intent);
  const pools = poolCount(properties);

  const byArea = AREAS.map((area) => ({
    area,
    items: properties.filter((p) => p.area_slug === area.slug),
  }))
    .filter((g) => g.items.length > 0)
    .sort((a, b) => b.items.length - a.items.length);

  /**
   * Each area block hands over to the `/<intent>/<area>/<type>` page — the exact
   * phrase people search, rather than the area hub that mixes every type.
   */
  const areaHref = (area: AreaInfo) => comboPath(intent, { area, type });

  // Budget pages for this type on this side of the book.
  const bands = bandsFor(intent).filter(
    (b) =>
      b.type === type.slug &&
      properties.some((p) => p.price != null && p.price <= b.max),
  );

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: intent === "rent" ? "Rent" : "Buy", path: `/${intent}` },
    { name: type.plural, path: `/${intent}/${type.slug}` },
  ]);
  const itemList = listingItemListJsonLd(properties, heading, `/${intent}/${type.slug}`);

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

      {/* Header */}
      <section className="bg-ink pb-12 pt-32">
        <Container>
          <nav className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em] text-paper/50">
            <Link href="/" className="hover:text-gold">
              Home
            </Link>
            <span>/</span>
            <Link href={`/${intent}`} className="hover:text-gold">
              {intent === "rent" ? "Rent" : "Buy"}
            </Link>
            <span>/</span>
            <span className="text-paper/80">{type.plural}</span>
          </nav>
          <h1 className="display-caps mt-4 text-4xl text-paper sm:text-5xl">{heading}</h1>
          <p className="mt-4 max-w-2xl text-paper/75">
            {properties.length > 0 ? (
              <>
                {properties.length} {properties.length === 1 ? type.singular : `${type.singular}s`}{" "}
                {verb} across {byArea.length}{" "}
                {byArea.length === 1 ? "area" : "areas"} of Phuket
                {range ? `, ${range}` : ""}.
                {pools > 0 && (
                  <>
                    {" "}
                    {pools === properties.length
                      ? "Every one has a private pool."
                      : `${pools} of them have a private pool.`}
                  </>
                )}
              </>
            ) : (
              <>
                We have no {type.singular}s {verb} on the site right now — tell us what you
                are after and we will match you off-market.
              </>
            )}
          </p>
          <p className="mt-3 max-w-2xl text-sm text-paper/55">{type.blurb}</p>
        </Container>
      </section>

      {/* Listings, grouped by area */}
      <section className="bg-charcoal py-14">
        <Container>
          {byArea.length === 0 ? (
            <PropertyGrid
              properties={[]}
              emptyMessage={`No ${type.singular}s ${verb} at the moment. Send us your requirements and we will look off-market.`}
            />
          ) : (
            <div className="space-y-20">
              {byArea.map(({ area, items }) => (
                <div key={area.slug}>
                  <SectionHeading
                    kicker={`${items.length} ${items.length === 1 ? type.singular : `${type.singular}s`}`}
                    title={
                      <Link href={areaHref(area)} className="hover:text-gold">
                        {area.name}
                      </Link>
                    }
                    description={area.tagline}
                  />
                  <div className="mt-8">
                    <PropertyGrid properties={items.slice(0, PER_AREA)} />
                  </div>
                  <p className="mt-6">
                    <Link
                      href={areaHref(area)}
                      className="text-sm font-semibold uppercase tracking-[0.14em] text-gold hover:underline"
                    >
                      {items.length > PER_AREA
                        ? `See all ${items.length} ${type.singular}s in ${area.name}`
                        : `${type.plural} ${verb} in ${area.name}`}{" "}
                      →
                    </Link>
                  </p>
                </div>
              ))}
            </div>
          )}

          {type.notes && type.notes.length > 0 && (
            <div className="mt-14 max-w-3xl">
              <SectionHeading
                kicker="Before you enquire"
                title={`What to check on a Phuket ${type.singular}`}
              />
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-paper/70">
                {type.notes.map((n) => (
                  <p key={n.slice(0, 40)}>{n}</p>
                ))}
              </div>
              <p className="mt-6 text-xs text-paper/45">
                General information, not legal advice. We will introduce you to an
                independent Thai lawyer before you commit to anything.
              </p>
            </div>
          )}

          {bands.length > 0 && (
            <div className="mt-14">
              <SectionHeading kicker="By budget" title={`${type.plural} by price`} />
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {bands.map((b) => (
                  <li key={b.slug}>
                    <Link
                      href={`/${intent}/${b.slug}`}
                      className="text-paper/75 underline-offset-4 hover:text-gold hover:underline"
                    >
                      {type.plural} {verb} under {b.cap}
                      {intent === "rent" ? " a month" : ""}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-14 flex flex-wrap gap-4">
            <ButtonLink href={`/${other}/${type.slug}`} variant="outline">
              {type.plural} {other === "rent" ? "for rent" : "for sale"}
            </ButtonLink>
            <ButtonLink href={`/${intent}`} variant="outline">
              All property {verb}
            </ButtonLink>
            <ButtonLink href="/contact">Talk to us</ButtonLink>
          </div>
        </Container>
      </section>

      {/* Other types */}
      <section className="bg-ink py-16">
        <Container>
          <SectionHeading kicker="Other types" title={`More property ${verb} in Phuket`} />
          <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {PROPERTY_TYPE_PAGES.filter((t) => t.slug !== type.slug).map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/${intent}/${t.slug}`}
                  className="text-paper/75 underline-offset-4 hover:text-gold hover:underline"
                >
                  {t.plural} {verb} in Phuket
                </Link>
              </li>
            ))}
            {AREAS.slice(0, 6).map((a) => (
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
