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
import { BUY_BUDGET_FAQS, BUY_FAQS } from "@/lib/faq";
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
 * This segment is an area slug, a property-type slug, or a budget band
 * ("villas-under-15m"). Areas win any collision; bands are sale-only, because a
 * renter's budget is a monthly figure and belongs on its own set of pages.
 */
export function generateStaticParams() {
  assertNoSlugCollision();
  assertNoBandCollision();
  return [
    ...AREAS.map((a) => ({ area: a.slug })),
    ...PROPERTY_TYPE_PAGES.map((t) => ({ area: t.slug })),
    ...bandsFor("buy").map((b) => ({ area: b.slug })),
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
    robots: indexable(properties.length),
  };
}

export default async function BuySegmentPage({
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
        {/* The full answer set carries the structured data on /buy. */}
        <FaqSection
          faqs={BUY_BUDGET_FAQS}
          title={`Buying under ${budget.band.cap} in Phuket`}
          structuredData={false}
        />
      </>
    );
  }

  const target = resolveIntentSegment(slug);
  if (!target) notFound();

  if (target.kind === "area") {
    const properties = await areaIntentProperties(target.area, "buy");
    const filters = parseAreaFilters(await searchParams);
    return (
      <>
        <AreaIntentPage
          area={target.area}
          intent="buy"
          properties={properties}
          filters={filters}
        />
        {/* Answers travel with the buyer; the structured data stays on /buy. */}
        <FaqSection faqs={BUY_FAQS.slice(0, 4)} structuredData={false} />
      </>
    );
  }

  const properties = await typeIntentProperties(target.type, "buy");
  return (
    <>
      <TypeIntentPage type={target.type} intent="buy" properties={properties} />
      <FaqSection faqs={BUY_FAQS.slice(0, 4)} structuredData={false} />
    </>
  );
}
