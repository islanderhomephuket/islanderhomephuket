import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { PropertyFilters } from "./property-filters";
import { IslandResults, ZoneGrid, type ZoneSummary } from "./listing-results";
import { getProperties, stripToCardFields } from "@/lib/data";
import { AREAS } from "@/lib/constants";
import type { Property } from "@/lib/types";

/**
 * The island-wide /rent and /buy pages.
 *
 * Static: the listing set is fetched at render time (ISR) and the filter bar's
 * query string is applied in the browser by `IslandResults` — reading
 * `searchParams` here would make every visit a fresh server render (see
 * `lib/listing-filters.ts` for why that got the site paused).
 *
 * Unfiltered, the page shows a grid of zone cards handing off to each zone's own
 * page; the flat grid comes back the moment someone actually filters.
 */
export async function PropertyListing({
  listingType,
  title,
  subtitle,
}: {
  listingType: "sale" | "rent";
  title: string;
  subtitle: string;
}) {
  const properties = await getProperties({ listingType, sort: "newest" });

  const intent = listingType === "rent" ? "rent" : "buy";
  const verb = listingType === "rent" ? "for rent" : "for sale";

  const zones: ZoneSummary[] = AREAS.map((area) => ({
    area,
    count: properties.filter((p: Property) => p.area_slug === area.slug).length,
    href: `/${intent}/${area.slug}`,
  }))
    .filter((z) => z.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <>
      {/* Page header */}
      <section className="bg-ink pb-12 pt-32">
        <Container>
          <p className="kicker text-gold-light">
            {listingType === "rent" ? "Rentals" : "For Sale"}
          </p>
          <h1 className="display-caps mt-3 text-4xl text-paper sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-paper/70">{subtitle}</p>
        </Container>
      </section>

      {/* Filters + results */}
      <section className="bg-charcoal py-12">
        <Container>
          <Suspense>
            <PropertyFilters listingType={listingType} />
          </Suspense>
          <Suspense fallback={<ZoneGrid zones={zones} total={properties.length} verb={verb} />}>
            <IslandResults
              properties={stripToCardFields(properties)}
              zones={zones}
              listingType={listingType}
            />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
