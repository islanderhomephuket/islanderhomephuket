/**
 * `/buy/pool-villas`, `/rent/pet-friendly` — the book filtered to one thing
 * people search by name rather than by place or price.
 *
 * Built to the same shape as the budget pages: the phrase as the `<h1>`, the
 * listings that actually qualify, a breakdown by area so nobody hits a dead
 * end, and links across to the sibling pages.
 */

import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { PropertyGrid } from "@/components/property/property-grid";
import { ButtonLink } from "@/components/ui/button";
import { AREAS } from "@/lib/constants";
import { amenityPagesFor, type AmenityPage } from "@/lib/amenity-pages";
import { breadcrumbJsonLd, listingItemListJsonLd, priceRange } from "@/lib/seo";
import type { Property } from "@/lib/types";

export function AmenityIntentPage({
  page,
  properties,
}: {
  page: AmenityPage;
  properties: Property[];
}) {
  const intent = page.intent;
  const path = `/${intent}/${page.slug}`;
  const range = priceRange(properties, intent);

  const byArea = AREAS.map((area) => ({
    area,
    items: properties.filter((p) => p.area_slug === area.slug),
  }))
    .filter((g) => g.items.length > 0)
    .sort((a, b) => b.items.length - a.items.length);

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: intent === "rent" ? "Rent" : "Buy", path: `/${intent}` },
    { name: page.heading, path },
  ]);
  const itemList = listingItemListJsonLd(properties, page.heading, path);

  const siblings = amenityPagesFor(intent).filter((p) => p.slug !== page.slug);

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
            <span className="text-paper/80">{page.heading}</span>
          </nav>
          <h1 className="display-caps mt-4 text-4xl text-paper sm:text-5xl">
            {page.heading}
          </h1>
          <p className="mt-4 max-w-2xl text-paper/75">
            {properties.length > 0 ? (
              <>
                {/* priceRange already ends "per month" for a rental. */}
                {properties.length} {page.noun} on the books
                {range ? `, ${range}` : ""}, across {byArea.length}{" "}
                {byArea.length === 1 ? "area" : "areas"}.
              </>
            ) : (
              <>
                Nothing matching on the books today. Tell us what you are looking
                for and we will watch for it — this is the kind of home that
                usually {intent === "rent" ? "goes" : "sells"} before it is
                advertised.
              </>
            )}
          </p>
          <p className="mt-3 max-w-2xl text-sm text-paper/55">{page.blurb}</p>
        </Container>
      </section>

      <section className="bg-charcoal py-14">
        <Container>
          <PropertyGrid
            properties={properties}
            emptyMessage={`No ${page.noun} on the books at the moment.`}
          />

          {byArea.length > 1 && (
            <div className="mt-12">
              <SectionHeading
                kicker="Where they are"
                title={`${page.noun[0].toUpperCase()}${page.noun.slice(1)} by area`}
              />
              <ul className="mt-6 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                {byArea.map(({ area, items }) => (
                  <li key={area.slug}>
                    <Link
                      href={`/${intent}/${area.slug}`}
                      className="flex items-baseline justify-between gap-3 border-b border-paper/10 py-2 text-paper/75 transition-colors hover:text-paper"
                    >
                      <span>{area.name}</span>
                      <span className="text-sm tabular-nums text-paper/45">
                        {items.length}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {siblings.length > 0 && (
            <div className="mt-14">
              <SectionHeading
                kicker="Also on the books"
                title={intent === "rent" ? "Other rentals by feature" : "Other homes by feature"}
              />
              <div className="mt-6 flex flex-wrap gap-3">
                {siblings.map((s) => (
                  <ButtonLink
                    key={`${s.intent}-${s.slug}`}
                    href={`/${s.intent}/${s.slug}`}
                    variant="outline"
                  >
                    {s.heading}
                  </ButtonLink>
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
