/**
 * `/buy/villas-under-15m` and friends — the sale book filtered to a budget.
 *
 * Buyers arrive with a ceiling, not an area, and the phrase they search carries
 * the number: "pool villa Phuket under 10 million". This page is that phrase,
 * with the listings that actually clear the ceiling and links down to the next
 * band so nobody who can stretch further hits a dead end.
 */

import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { PropertyGrid } from "@/components/property/property-grid";
import { ButtonLink } from "@/components/ui/button";
import { AREAS } from "@/lib/constants";
import {
  PRICE_BAND_PAGES,
  bandHeading,
  bandType,
  type PriceBandPage,
} from "@/lib/price-band-pages";
import { comboPath } from "@/lib/area-type-pages";
import { breadcrumbJsonLd, listingItemListJsonLd, priceRange } from "@/lib/seo";
import type { Property } from "@/lib/types";

export function BandIntentPage({
  band,
  properties,
}: {
  band: PriceBandPage;
  properties: Property[];
}) {
  const type = bandType(band);
  const heading = bandHeading(band);
  const path = `/buy/${band.slug}`;
  const range = priceRange(properties, "buy");

  const byArea = AREAS.map((area) => ({
    area,
    items: properties.filter((p) => p.area_slug === area.slug),
  }))
    .filter((g) => g.items.length > 0)
    .sort((a, b) => b.items.length - a.items.length);

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Buy", path: "/buy" },
    { name: type.plural, path: `/buy/${type.slug}` },
    { name: `Under ${band.cap}`, path },
  ]);
  const itemList = listingItemListJsonLd(properties, heading, path);

  // The other bands, cheapest first — the same type's neighbours first.
  const siblings = PRICE_BAND_PAGES.filter((b) => b.slug !== band.slug).sort((a, b) =>
    a.type === band.type && b.type !== band.type ? -1 : a.max - b.max,
  );

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

      <section className="bg-ink pb-12 pt-32">
        <Container>
          <nav className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em] text-paper/50">
            <Link href="/" className="hover:text-gold">
              Home
            </Link>
            <span>/</span>
            <Link href="/buy" className="hover:text-gold">
              Buy
            </Link>
            <span>/</span>
            <Link href={`/buy/${type.slug}`} className="hover:text-gold">
              {type.plural}
            </Link>
            <span>/</span>
            <span className="text-paper/80">Under {band.cap}</span>
          </nav>
          <h1 className="display-caps mt-4 text-4xl text-paper sm:text-5xl">{heading}</h1>
          <p className="mt-4 max-w-2xl text-paper/75">
            {properties.length > 0 ? (
              <>
                {properties.length}{" "}
                {properties.length === 1 ? type.singular : `${type.singular}s`} on the
                books at or under {band.cap}
                {range ? `, ${range}` : ""}, across {byArea.length}{" "}
                {byArea.length === 1 ? "area" : "areas"}.
              </>
            ) : (
              <>
                Nothing is on the books under {band.cap} today. Tell us the budget and
                the area and we will watch for it — stock at this level moves fast and
                often sells before it is advertised.
              </>
            )}
          </p>
          <p className="mt-3 max-w-2xl text-sm text-paper/55">{band.blurb}</p>
        </Container>
      </section>

      <section className="bg-charcoal py-14">
        <Container>
          <PropertyGrid
            properties={properties}
            emptyMessage={`No ${type.singular}s under ${band.cap} at the moment.`}
          />

          {byArea.length > 1 && (
            <div className="mt-12">
              <SectionHeading
                kicker="Where they are"
                title={`Under ${band.cap} by area`}
              />
              <ul className="mt-6 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                {byArea.map(({ area, items }) => (
                  <li key={area.slug}>
                    <Link
                      href={comboPath("buy", { area, type })}
                      className="flex items-baseline justify-between gap-3 text-sm text-paper/75 underline-offset-4 hover:text-gold hover:underline"
                    >
                      <span>
                        {type.plural} for sale in {area.name}
                      </span>
                      <span className="shrink-0 text-xs text-paper/40">
                        {items.length}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-12 flex flex-wrap gap-4">
            <ButtonLink href={`/buy/${type.slug}`} variant="outline">
              All {type.plural.toLowerCase()} for sale
            </ButtonLink>
            <ButtonLink href="/blog/buying-property-in-phuket-guide-for-foreigners" variant="outline">
              Foreign buyer&rsquo;s guide
            </ButtonLink>
            <ButtonLink href="/contact">Send us your budget</ButtonLink>
          </div>
        </Container>
      </section>

      <section className="bg-ink py-16">
        <Container>
          <SectionHeading kicker="Other budgets" title="Browse by price" />
          <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {siblings.map((b) => (
              <li key={b.slug}>
                <Link
                  href={`/buy/${b.slug}`}
                  className="text-paper/75 underline-offset-4 hover:text-gold hover:underline"
                >
                  {bandType(b).plural} for sale under {b.cap}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
