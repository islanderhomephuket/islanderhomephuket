import { Container } from "@/components/ui/container";
import { PropertyFilters } from "./property-filters";
import { PropertyGrid } from "./property-grid";
import { ZoneCard } from "./zone-card";
import { getProperties } from "@/lib/data";
import { AREAS } from "@/lib/constants";
import type { PropertyFilters as Filters, Property } from "@/lib/types";

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
   * Unfiltered, this page used to render every listing at once (an early version showed
   * all cards flat; a later one showed a 6-card preview per zone), which read as one long
   * scroll of mixed listings. Browsing starts by zone anyway, so the default view is a grid
   * of zone cards handing off to each zone's own page; the flat grid comes back the moment
   * someone actually filters.
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
          <p className="mt-8 text-sm text-paper/60">
            <span className="font-semibold text-paper">{properties.length}</span>{" "}
            {properties.length === 1 ? "property" : "properties"}{" "}
            {isSearching ? "found" : `${verb} across ${zones.length} areas`}
          </p>

          {isSearching ? (
            <div className="mt-6">
              <PropertyGrid properties={properties} />
            </div>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {zones.map((z) => (
                <ZoneCard
                  key={z.area.slug}
                  area={z.area}
                  count={z.items.length}
                  href={`/${intent}/${z.area.slug}`}
                />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
