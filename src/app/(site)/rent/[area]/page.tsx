import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  AreaIntentPage,
  areaIntentProperties,
} from "@/components/property/area-intent-page";
import { AREAS, getArea } from "@/lib/constants";
import {
  areaIntentDescription,
  areaIntentHeading,
  INDEXABLE_MIN_LISTINGS,
} from "@/lib/seo";

export function generateStaticParams() {
  return AREAS.map((a) => ({ area: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ area: string }>;
}): Promise<Metadata> {
  const { area: slug } = await params;
  const area = getArea(slug);
  if (!area) return { title: "Area not found" };
  const properties = await areaIntentProperties(area, "rent");
  return {
    title: areaIntentHeading(area, "rent", properties),
    description: areaIntentDescription(area, "rent", properties),
    alternates: { canonical: `/rent/${area.slug}` },
    // A page with almost nothing on it is a thin page; keep it reachable but
    // out of the index until the area has real rental stock.
    robots:
      properties.length >= INDEXABLE_MIN_LISTINGS
        ? { index: true, follow: true }
        : { index: false, follow: true },
  };
}

export default async function RentInAreaPage({
  params,
}: {
  params: Promise<{ area: string }>;
}) {
  const { area: slug } = await params;
  const area = getArea(slug);
  if (!area) notFound();
  const properties = await areaIntentProperties(area, "rent");
  return <AreaIntentPage area={area} intent="rent" properties={properties} />;
}
