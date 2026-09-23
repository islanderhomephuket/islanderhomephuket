/**
 * `/buy/villas-under-15m`, `/rent/condos-under-20k` — the book filtered to a budget.
 *
 * People arrive with a ceiling, not an area, and the phrase they search carries
 * the number: "pool villa Phuket under 10 million", "condo for rent Phuket 20k".
 * This page is that phrase, with the listings that actually clear the ceiling
 * and links across to the other bands so nobody hits a dead end.
 */

import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { PropertyGrid } from "@/components/property/property-grid";
import { ButtonLink } from "@/components/ui/button";
import { AREAS } from "@/lib/constants";
import {
  bandsFor,
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
  const intent = band.intent;
  const type = bandType(band);
  const heading = bandHeading(band);
  const path = `/${intent}/${band.slug}`;
  const range = priceRange(properties, intent);
  const verb = intent === "rent" ? "for rent" : "for sale";
  const per = intent === "rent" ? " a month" : "";

  const byArea = AREAS.map((area) => ({
    area,
    items: properties.filter((p) => p.area_slug === area.slug),
  }))
    .filter((g) => g.items.length > 0)
    .sort((a, b) => b.items.length - a.items.length);

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: intent === "rent" ? "Rent" : "Buy", path: `/${intent}` },
    { name: type.plural, path: `/${intent}/${type.slug}` },
    { name: `Under ${band.cap}`, path },
  ]);
  const itemList = listingItemListJsonLd(properties, heading, path);

  // The other bands, cheapest first — the same type's neighbours first.
  const siblings = bandsFor(intent)
    .filter((b) => b.slug !== band.slug)
    .sort((a, b) =>
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
            <Link href={`/${intent}`} className="hover:text-gold">
              {intent === "rent" ? "Rent" : "Buy"}
            </Link>
            <span>/</span>
            <Link href={`/${intent}/${type.slug}`} className="hover:text-gold">
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
                books at or under {band.cap}{per}
                {range ? `, ${range}` : ""}, across {byArea.length}{" "}
                {byArea.length === 1 ? "area" : "areas"}.
              </>
            ) : (
              <>
                Nothing is on the books under {band.cap}{per} today. Tell us the budget and
                the area and we will watch for it — stock at this level moves fast and
                often {intent === "rent" ? "is taken" : "sells"} before it is advertised.
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
            emptyMessage={`No ${type.singular}s under ${band.cap}${per} at the moment.`}
          />

          {byArea.length > 1 && (
            <div className="mt-12">
              <SectionHeading
                kicker="Where they are"
                title={`Under ${band.cap}${per} by area`}
              />
              <ul className="mt-6 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                {byArea.map(({ area, items }) => (
                  <li key={area.slug}>
                    <Link
                      href={comboPath(intent, { area, type })}
                      className="flex items-baseline justify-between gap-3 text-sm text-paper/75 underline-offset-4 hover:text-gold hover:underline"
                    >
                      <span>
                        {type.plural} {verb} in {area.name}
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
            <ButtonLink href={`/${intent}/${type.slug}`} variant="outline">
              All {type.plural.toLowerCase()} {verb}
            </ButtonLink>
            {intent === "buy" && (
              <ButtonLink
                href="/blog/buying-property-in-phuket-guide-for-foreigners"
                variant="outline"
              >
                Foreign buyer&rsquo;s guide
              </ButtonLink>
            )}
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
                  href={`/${intent}/${b.slug}`}
                  className="text-paper/75 underline-offset-4 hover:text-gold hover:underline"
                >
                  {bandType(b).plural} {verb} under {b.cap}
                  {per}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
