import { Container } from "@/components/ui/container";
import { PropertyFilters } from "./property-filters";
import { PropertyGrid } from "./property-grid";
import { getProperties } from "@/lib/data";
import type { PropertyFilters as Filters } from "@/lib/types";

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

  return (
    <>
      {/* Page header */}
      <section className="bg-ink pb-12 pt-32">
        <Container>
          <p className="kicker text-gold-light">
            {listingType === "rent" ? "Rentals" : "For Sale"}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-paper sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-paper/70">{subtitle}</p>
        </Container>
      </section>

      {/* Filters + results */}
      <section className="bg-charcoal py-12">
        <Container>
          <PropertyFilters listingType={listingType} />
          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-paper/60">
              <span className="font-semibold text-paper">{properties.length}</span>{" "}
              {properties.length === 1 ? "property" : "properties"} found
            </p>
          </div>
          <div className="mt-6">
            <PropertyGrid properties={properties} />
          </div>
        </Container>
      </section>
    </>
  );
}
