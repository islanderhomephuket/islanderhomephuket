import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  AreaIntentPage,
  areaIntentProperties,
  parseAreaFilters,
} from "@/components/property/area-intent-page";
import {
  TypeIntentPage,
  typeIntentProperties,
  typeIntentHeading,
  poolCount,
} from "@/components/property/type-intent-page";
import { BandIntentPage } from "@/components/property/band-intent-page";
import { FaqSection } from "@/components/property/faq-section";
import { RENT_BUDGET_FAQS, RENT_FAQS, HOTEL_FAQS } from "@/lib/faq";
import { AREAS } from "@/lib/constants";
import { getProperties } from "@/lib/data";
import {
  PROPERTY_TYPE_PAGES,
  assertNoSlugCollision,
  resolveIntentSegment,
} from "@/lib/property-type-pages";
import {
  bandsFor,
  assertNoBandCollision,
  bandHeading,
  bandType,
  getPriceBandPage,
  isInPriceBand,
} from "@/lib/price-band-pages";
import {
  areaIntentDescription,
  areaIntentHeading,
  matchesIntent,
  priceRange,
  INDEXABLE_MIN_LISTINGS,
} from "@/lib/seo";

/**
 * This segment is an area slug, a property-type slug, or a monthly budget band
 * ("villas-under-100k"). Areas win any collision.
 */
export function generateStaticParams() {
  assertNoSlugCollision();
  assertNoBandCollision();
  return [
    ...AREAS.map((a) => ({ area: a.slug })),
    ...PROPERTY_TYPE_PAGES.map((t) => ({ area: t.slug })),
    ...bandsFor("rent").map((b) => ({ area: b.slug })),
  ];
}

/** Rentals inside a monthly band, cheapest first — the order a budget shops in. */
async function bandProperties(slug: string) {
  const band = getPriceBandPage(slug, "rent");
  if (!band) return null;
  const all = await getProperties();
  const properties = all
    .filter((p) => matchesIntent(p, "rent") && isInPriceBand(p, band))
    .sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  return { band, properties };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ area: string }>;
}): Promise<Metadata> {
  const { area: slug } = await params;

  // A page with almost nothing on it is a thin page; keep it reachable but out
  // of the index until there is real stock behind it.
  const indexable = (n: number) =>
    n >= INDEXABLE_MIN_LISTINGS
      ? { index: true, follow: true }
      : { index: false, follow: true };

  const budget = await bandProperties(slug);
  if (budget) {
    const { band, properties } = budget;
    const type = bandType(band);
    const range = priceRange(properties, "rent");
    const description =
      properties.length > 0
        ? `${properties.length} ${properties.length === 1 ? type.singular : `${type.singular}s`} for rent in Phuket at or under ${band.cap} a month${range ? ` — ${range}` : ""}. Long-term rentals from Islander Home Phuket.`
        : `${type.plural} for rent in Phuket under ${band.cap} a month. ${band.blurb}`;
    return {
      title: bandHeading(band),
      description: description.slice(0, 158),
      alternates: { canonical: `/rent/${band.slug}` },
      robots: indexable(properties.length),
    };
  }

  const target = resolveIntentSegment(slug);
  if (!target) return { title: "Page not found" };

  if (target.kind === "area") {
    const properties = await areaIntentProperties(target.area, "rent");
    return {
      title: areaIntentHeading(target.area, "rent", properties),
      description: areaIntentDescription(target.area, "rent", properties),
      alternates: { canonical: `/rent/${target.area.slug}` },
      robots: indexable(properties.length),
    };
  }

  const { type } = target;
  // Some type pages carry enough standalone content to index on their own.
  const typeMin = type.minToIndex ?? INDEXABLE_MIN_LISTINGS;
  const properties = await typeIntentProperties(type, "rent");
  const range = priceRange(properties, "rent");
  const pools = poolCount(properties);
  const description =
    properties.length > 0
      ? `${properties.length} ${type.singular}s for rent in Phuket${range ? `, ${range}` : ""}` +
        `${pools > 0 ? `, ${pools} with a private pool` : ""}. Current monthly rents from Islander Home Phuket.`
      : `${type.plural} for rent in Phuket. ${type.blurb}`;
  return {
    title: typeIntentHeading(type, "rent"),
    description: description.slice(0, 158),
    alternates: { canonical: `/rent/${type.slug}` },
    robots:
      properties.length >= typeMin
        ? { index: true, follow: true }
        : { index: false, follow: true },
  };
}

export default async function RentSegmentPage({
  params,
  searchParams,
}: {
  params: Promise<{ area: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { area: slug } = await params;

  const budget = await bandProperties(slug);
  if (budget) {
    return (
      <>
        <BandIntentPage band={budget.band} properties={budget.properties} />
        {/* The full answer set carries the structured data on /rent. */}
        <FaqSection
          faqs={RENT_BUDGET_FAQS}
          title={`Renting under ${budget.band.cap} a month`}
          structuredData={false}
        />
      </>
    );
  }

  const target = resolveIntentSegment(slug);
  if (!target) notFound();

  if (target.kind === "area") {
    const properties = await areaIntentProperties(target.area, "rent");
    const filters = parseAreaFilters(await searchParams);
    return (
      <>
        <AreaIntentPage
          area={target.area}
          intent="rent"
          properties={properties}
          filters={filters}
        />
        <FaqSection
          faqs={RENT_FAQS.slice(0, 4)}
          title="Renting a home in Phuket"
          structuredData={false}
        />
      </>
    );
  }

  const properties = await typeIntentProperties(target.type, "rent");
  const isHotels = target.type.slug === "hotels";
  return (
    <>
      <TypeIntentPage type={target.type} intent="rent" properties={properties} />
      <FaqSection
        faqs={isHotels ? HOTEL_FAQS : RENT_FAQS.slice(0, 4)}
        title={isHotels ? "Leasing a hotel in Phuket" : "Renting a home in Phuket"}
        structuredData={false}
      />
    </>
  );
}
