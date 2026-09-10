import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { PropertyFilters } from "./property-filters";
import { PropertyGrid } from "./property-grid";
import { getProperties } from "@/lib/data";
import { AREAS } from "@/lib/constants";
import type { PropertyFilters as Filters, Property } from "@/lib/types";

type RawParams = { [key: string]: string | string[] | undefined };

/** How many cards each zone shows before handing off to its own page. */
const PER_ZONE = 6;

function str(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}
function num(v: string | string[] | undefined): number | undefined {
  const s = str(v);
  if (!s) return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

export async function PropertyListing({
  listingType,
  searchParams,
  title,
  subtitle,
}: {
  listingType: "sale" | "rent";
  searchParams: RawParams;
  title: string;
  subtitle: string;
}) {
  const filters: Filters = {
    listingType,
    area: str(searchParams.area),
    propertyType: str(searchParams.propertyType),
    bedrooms: num(searchParams.bedrooms),
    minPrice: num(searchParams.minPrice),
    maxPrice: num(searchParams.maxPrice),
    query: str(searchParams.q),
    sort: (str(searchParams.sort) as Filters["sort"]) || "newest",
  };

  const properties = await getProperties(filters);

  /**
   * Unfiltered, this page used to render every listing at once — 328 rental cards
   * in one 2.5 MB document. Browsing starts by zone anyway, so the default view is
   * a preview per zone that hands off to the zone's own page; the flat grid comes
   * back the moment someone actually filters.
   */
  const isSearching =
    Boolean(
      filters.area ||
        filters.propertyType ||
        filters.bedrooms ||
        filters.minPrice != null ||
        filters.maxPrice != null ||
        filters.query,
    ) || (str(searchParams.sort) ?? "newest") !== "newest";

  const intent = listingType === "rent" ? "rent" : "buy";
  const verb = listingType === "rent" ? "for rent" : "for sale";

  const zones = AREAS.map((area) => ({
    area,
    items: properties.filter((p: Property) => p.area_slug === area.slug),
  }))
    .filter((z) => z.items.length > 0)
    .sort((a, b) => b.items.length - a.items.length);

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
          <PropertyFilters listingType={listingType} />
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-paper/60">
              <span className="font-semibold text-paper">{properties.length}</span>{" "}
              {properties.length === 1 ? "property" : "properties"}{" "}
              {isSearching ? "found" : `${verb} across ${zones.length} areas`}
            </p>
            {!isSearching && zones.length > 0 && (
              <nav className="flex flex-wrap gap-x-4 gap-y-1 text-xs uppercase tracking-[0.14em] text-paper/50">
                {zones.map((z) => (
                  <a
                    key={z.area.slug}
                    href={`#${z.area.slug}`}
                    className="hover:text-gold"
                  >
                    {z.area.name} ({z.items.length})
                  </a>
                ))}
              </nav>
            )}
          </div>

          {isSearching ? (
            <div className="mt-6">
              <PropertyGrid properties={properties} />
            </div>
          ) : (
            <div className="mt-10 space-y-20">
              {zones.map((z) => (
                <div key={z.area.slug} id={z.area.slug} className="scroll-mt-28">
                  <SectionHeading
                    kicker={`${z.items.length} ${z.items.length === 1 ? "property" : "properties"}`}
                    title={
                      <Link
                        href={`/${intent}/${z.area.slug}`}
                        className="hover:text-gold"
                      >
                        {z.area.name}
                      </Link>
                    }
                    description={z.area.tagline}
                  />
                  <div className="mt-8">
                    <PropertyGrid properties={z.items.slice(0, PER_ZONE)} />
                  </div>
                  {z.items.length > PER_ZONE && (
                    <p className="mt-6">
                      <Link
                        href={`/${intent}/${z.area.slug}`}
                        className="text-sm font-semibold uppercase tracking-[0.14em] text-gold hover:underline"
                      >
                        See all {z.items.length} in {z.area.name} →
                      </Link>
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
