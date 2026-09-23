/**
 * `/buy/<area>/<type>` — one type, one area, and the links out to its neighbours.
 *
 * The grid is the whole page on purpose: someone who searched "condo for sale
 * Patong" wants the condos in Patong, not an essay. What sits under it is the
 * rest of the crawl — the other types in this area, this type in the other
 * areas — so the combination layer is connected rather than orphaned.
 */

import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { PropertyGrid } from "@/components/property/property-grid";
import { ButtonLink } from "@/components/ui/button";
import { AREAS } from "@/lib/constants";
import {
  comboHeading,
  comboPath,
  comboProperties,
  type AreaTypeCombo,
} from "@/lib/area-type-pages";
import { PROPERTY_TYPE_PAGES } from "@/lib/property-type-pages";
import {
  breadcrumbJsonLd,
  listingItemListJsonLd,
  priceRange,
  type Intent,
} from "@/lib/seo";
import type { Property } from "@/lib/types";

export function ComboIntentPage({
  combo,
  intent,
  properties,
  all,
}: {
  combo: AreaTypeCombo;
  intent: Intent;
  properties: Property[];
  /** Every listing, for the sibling counts in the link blocks. */
  all: Property[];
}) {
  const { area, type } = combo;
  const heading = comboHeading(combo, intent);
  const verb = intent === "rent" ? "for rent" : "for sale";
  const path = comboPath(intent, combo);
  const range = priceRange(properties, intent);

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: intent === "rent" ? "Rent" : "Buy", path: `/${intent}` },
    { name: area.name, path: `/${intent}/${area.slug}` },
    { name: type.plural, path },
  ]);
  const itemList = listingItemListJsonLd(properties, heading, path);

  // Same area, other types — and same type, other areas. Only the ones with stock.
  const otherTypesHere = PROPERTY_TYPE_PAGES.filter((t) => t.slug !== type.slug)
    .map((t) => ({
      type: t,
      count: comboProperties(all, { area, type: t }, intent).length,
    }))
    .filter((r) => r.count > 0);

  const sameTypeElsewhere = AREAS.filter((a) => a.slug !== area.slug)
    .map((a) => ({
      area: a,
      count: comboProperties(all, { area: a, type }, intent).length,
    }))
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count);

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
            <Link href={`/${intent}/${area.slug}`} className="hover:text-gold">
              {area.name}
            </Link>
            <span>/</span>
            <span className="text-paper/80">{type.plural}</span>
          </nav>
          <h1 className="display-caps mt-4 text-4xl text-paper sm:text-5xl">{heading}</h1>
          <p className="mt-4 max-w-2xl text-paper/75">
            {properties.length > 0 ? (
              <>
                {properties.length}{" "}
                {properties.length === 1 ? type.singular : `${type.singular}s`} {verb} in{" "}
                {area.name}
                {range ? `, ${range}` : ""}. {area.tagline}.
              </>
            ) : (
              <>
                Nothing in {area.name} matches {type.plural.toLowerCase()} {verb} right
                now. Tell us your budget and we will look off-market — a good part of
                the island never reaches a listing site.
              </>
            )}
          </p>
          <p className="mt-3 max-w-2xl text-sm text-paper/55">{type.blurb}</p>
        </Container>
      </section>

      <section className="bg-charcoal py-14">
        <Container>
          <PropertyGrid
            properties={properties}
            emptyMessage={`No ${type.singular}s ${verb} in ${area.name} at the moment.`}
          />

          <div className="mt-12 flex flex-wrap gap-4">
            <ButtonLink href={`/${intent}/${area.slug}`} variant="outline">
              All {area.name} property {verb}
            </ButtonLink>
            <ButtonLink href={`/${intent}/${type.slug}`} variant="outline">
              {type.plural} {verb} island-wide
            </ButtonLink>
            <ButtonLink href="/contact">Ask about {area.name}</ButtonLink>
          </div>
        </Container>
      </section>

      <section className="bg-ink py-16">
        <Container>
          <div className="grid gap-12 sm:grid-cols-2">
            {otherTypesHere.length > 0 && (
              <div>
                <SectionHeading kicker="Same area" title={`More in ${area.name}`} />
                <ul className="mt-6 space-y-2">
                  {otherTypesHere.map(({ type: t, count }) => (
                    <li key={t.slug}>
                      <Link
                        href={comboPath(intent, { area, type: t })}
                        className="flex items-baseline justify-between gap-3 text-sm text-paper/75 underline-offset-4 hover:text-gold hover:underline"
                      >
                        <span>
                          {t.plural} {verb} in {area.name}
                        </span>
                        <span className="shrink-0 text-xs text-paper/40">{count}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {sameTypeElsewhere.length > 0 && (
              <div>
                <SectionHeading
                  kicker="Same type"
                  title={`${type.plural} in other areas`}
                />
                <ul className="mt-6 space-y-2">
                  {sameTypeElsewhere.map(({ area: a, count }) => (
                    <li key={a.slug}>
                      <Link
                        href={comboPath(intent, { area: a, type })}
                        className="flex items-baseline justify-between gap-3 text-sm text-paper/75 underline-offset-4 hover:text-gold hover:underline"
                      >
                        <span>
                          {type.plural} {verb} in {a.name}
                        </span>
                        <span className="shrink-0 text-xs text-paper/40">{count}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
