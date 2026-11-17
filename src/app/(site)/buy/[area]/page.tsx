import type { Metadata } from "next";
import { moneyPageMeta } from "@/components/property/money-page-guide";
import { notFound } from "next/navigation";
import {
  AreaIntentPage,
  areaIntentProperties,
} from "@/components/property/area-intent-page";
import {
  TypeIntentPage,
  typeIntentProperties,
  typeIntentHeading,
  poolCount,
} from "@/components/property/type-intent-page";
import { BandIntentPage } from "@/components/property/band-intent-page";
import { FaqSection } from "@/components/property/faq-section";
import { BUY_BUDGET_FAQS, BUY_FAQS, HOTEL_FAQS } from "@/lib/faq";
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
import { AmenityIntentPage } from "@/components/property/amenity-intent-page";
import {
  amenityPagesFor,
  assertNoAmenityCollision,
  getAmenityPage,
  isOnAmenityPage,
} from "@/lib/amenity-pages";
import {
  areaIntentDescription,
  areaIntentHeading,
  matchesIntent,
  priceRange,
  INDEXABLE_MIN_LISTINGS,
} from "@/lib/seo";

/**
 * This segment is an area slug, a property-type slug, or a budget band
 * ("villas-under-15m"). Areas win any collision; bands are sale-only, because a
 * renter's budget is a monthly figure and belongs on its own set of pages.
 */
// Every slug comes from generateStaticParams, so an unknown one must 404
// rather than render on demand: an on-demand render exceeds the 10 ms of CPU
// Workers Free allows and the request is killed. See (site)/layout.tsx.
export const dynamicParams = false;

export function generateStaticParams() {
  assertNoSlugCollision();
  assertNoBandCollision();
  assertNoAmenityCollision();
  return [
    ...AREAS.map((a) => ({ area: a.slug })),
    ...PROPERTY_TYPE_PAGES.map((t) => ({ area: t.slug })),
    ...bandsFor("buy").map((b) => ({ area: b.slug })),
    ...amenityPagesFor("buy").map((a) => ({ area: a.slug })),
  ];
}

/** Sale listings inside a budget band, cheapest first — the order a budget shops in. */
async function bandProperties(slug: string) {
  const band = getPriceBandPage(slug, "buy");
  if (!band) return null;
  const all = await getProperties();
  const properties = all
    .filter((p) => matchesIntent(p, "buy") && isInPriceBand(p, band))
    .sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  return { band, properties };
}

/** Listings behind an amenity page — /buy/pool-villas and friends. */
async function amenityProperties(slug: string) {
  const page = getAmenityPage(slug, "buy");
  if (!page) return null;
  const all = await getProperties();
  const properties = all
    .filter((p) => matchesIntent(p, "buy") && isOnAmenityPage(p, page))
    .sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  return { page, properties };
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
    const range = priceRange(properties, "buy");
    const description =
      properties.length > 0
        ? `${properties.length} ${properties.length === 1 ? type.singular : `${type.singular}s`} for sale in Phuket at or under ${band.cap}${range ? ` — ${range}` : ""}. Current asking prices from Islander Home Phuket.`
        : `${type.plural} for sale in Phuket under ${band.cap}. ${band.blurb}`;
    return {
      title: bandHeading(band),
      description: description.slice(0, 158),
      alternates: { canonical: `/buy/${band.slug}` },
      robots: indexable(properties.length),
    };
  }

  const amenity = await amenityProperties(slug);
  if (amenity) {
    const { page, properties } = amenity;
    const range = priceRange(properties, "buy");
    const description =
      properties.length > 0
        ? `${properties.length} ${page.noun} for sale in Phuket${range ? ` — ${range}` : ""}. ${page.blurb}`
        : `${page.noun} for sale in Phuket. ${page.blurb}`;
    return {
      title: page.heading,
      description: description.slice(0, 158),
      alternates: { canonical: `/buy/${page.slug}` },
      robots: indexable(properties.length),
    };
  }

  const target = resolveIntentSegment(slug);
  if (!target) return { title: "Page not found" };

  if (target.kind === "area") {
    const properties = await areaIntentProperties(target.area, "buy");
    return {
      title: areaIntentHeading(target.area, "buy", properties),
      description: areaIntentDescription(target.area, "buy", properties),
      alternates: { canonical: `/buy/${target.area.slug}` },
      robots: indexable(properties.length),
    };
  }

  const { type } = target;
  // Some type pages carry enough standalone content to index on their own.
  const typeMin = type.minToIndex ?? INDEXABLE_MIN_LISTINGS;
  const properties = await typeIntentProperties(type, "buy");
  const range = priceRange(properties, "buy");
  const pools = poolCount(properties);
  const description =
    properties.length > 0
      ? `${properties.length} ${type.singular}s for sale in Phuket${range ? `, ${range}` : ""}` +
        `${pools > 0 ? `, ${pools} with a private pool` : ""}. Current asking prices from Islander Home Phuket.`
      : `${type.plural} for sale in Phuket. ${type.blurb}`;
  return {
    title: typeIntentHeading(type, "buy"),
    description: description.slice(0, 158),
    alternates: { canonical: `/buy/${type.slug}` },
    ...moneyPageMeta(`/buy/${type.slug}`, properties),
    robots:
      properties.length >= typeMin
        ? { index: true, follow: true }
        : { index: false, follow: true },
  };
}

export default async function BuySegmentPage({
  params,
}: {
  params: Promise<{ area: string }>;
}) {
  const { area: slug } = await params;

  const budget = await bandProperties(slug);
  if (budget) {
    return (
      <>
        <BandIntentPage band={budget.band} properties={budget.properties} />
        {/* The full answer set carries the structured data on /buy. */}
        <FaqSection
          faqs={BUY_BUDGET_FAQS}
          title={`Buying under ${budget.band.cap} in Phuket`}
          structuredData={false}
        />
      </>
    );
  }

  const amenity = await amenityProperties(slug);
  if (amenity) {
    return (
      <>
        <AmenityIntentPage page={amenity.page} properties={amenity.properties} />
        <FaqSection faqs={BUY_FAQS.slice(0, 4)} structuredData={false} />
      </>
    );
  }

  const target = resolveIntentSegment(slug);
  if (!target) notFound();

  if (target.kind === "area") {
    const properties = await areaIntentProperties(target.area, "buy");
    return (
      <>
        <AreaIntentPage
          area={target.area}
          intent="buy"
          properties={properties}
        />
        {/* Answers travel with the buyer; the structured data stays on /buy. */}
        <FaqSection faqs={BUY_FAQS.slice(0, 4)} structuredData={false} />
      </>
    );
  }

  const properties = await typeIntentProperties(target.type, "buy");
  const isHotels = target.type.slug === "hotels";
  return (
    <>
      <TypeIntentPage type={target.type} intent="buy" properties={properties} />
      {/* A hotel buyer has different questions, and nobody else owns this set. */}
      <FaqSection
        faqs={isHotels ? HOTEL_FAQS : BUY_FAQS.slice(0, 4)}
        title={isHotels ? "Buying or leasing a hotel in Phuket" : undefined}
        structuredData={isHotels}
      />
    </>
  );
}
