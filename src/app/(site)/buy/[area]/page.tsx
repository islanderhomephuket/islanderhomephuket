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
import { AREAS } from "@/lib/constants";
import {
  PROPERTY_TYPE_PAGES,
  assertNoSlugCollision,
  resolveIntentSegment,
} from "@/lib/property-type-pages";
import {
  areaIntentDescription,
  areaIntentHeading,
  priceRange,
  INDEXABLE_MIN_LISTINGS,
} from "@/lib/seo";

/** This segment is an area slug OR a property-type slug — see property-type-pages.ts. */
export function generateStaticParams() {
  assertNoSlugCollision();
  return [
    ...AREAS.map((a) => ({ area: a.slug })),
    ...PROPERTY_TYPE_PAGES.map((t) => ({ area: t.slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ area: string }>;
}): Promise<Metadata> {
  const { area: slug } = await params;
  const target = resolveIntentSegment(slug);
  if (!target) return { title: "Page not found" };

  // A page with almost nothing on it is a thin page; keep it reachable but out
  // of the index until there is real stock behind it.
  const indexable = (n: number) =>
    n >= INDEXABLE_MIN_LISTINGS
      ? { index: true, follow: true }
      : { index: false, follow: true };

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
  const target = resolveIntentSegment(slug);
  if (!target) notFound();

  if (target.kind === "area") {
    const properties = await areaIntentProperties(target.area, "buy");
    const filters = parseAreaFilters(await searchParams);
    return (
      <AreaIntentPage
        area={target.area}
        intent="buy"
        properties={properties}
        filters={filters}
      />
    );
  }

  const properties = await typeIntentProperties(target.type, "buy");
  return <TypeIntentPage type={target.type} intent="buy" properties={properties} />;
}
