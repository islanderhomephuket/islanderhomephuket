import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComboIntentPage } from "@/components/property/combo-intent-page";
import { FaqSection } from "@/components/property/faq-section";
import { RENT_FAQS } from "@/lib/faq";
import { getProperties } from "@/lib/data";
import {
  allCombos,
  comboDescription,
  comboHeading,
  comboPath,
  comboProperties,
  resolveAreaTypeCombo,
} from "@/lib/area-type-pages";
import { INDEXABLE_MIN_LISTINGS } from "@/lib/seo";

/** Every area × type pair. Thin ones render but are kept out of the index. */
export function generateStaticParams() {
  return allCombos().map(({ area, type }) => ({ area: area.slug, type: type.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ area: string; type: string }>;
}): Promise<Metadata> {
  const { area, type } = await params;
  const combo = resolveAreaTypeCombo(area, type);
  if (!combo) return { title: "Page not found" };

  const properties = comboProperties(await getProperties(), combo, "rent");
  return {
    title: comboHeading(combo, "rent"),
    description: comboDescription(combo, "rent", properties),
    alternates: { canonical: comboPath("rent", combo) },
    robots:
      properties.length >= INDEXABLE_MIN_LISTINGS
        ? { index: true, follow: true }
        : { index: false, follow: true },
  };
}

export default async function RentAreaTypePage({
  params,
}: {
  params: Promise<{ area: string; type: string }>;
}) {
  const { area, type } = await params;
  const combo = resolveAreaTypeCombo(area, type);
  if (!combo) notFound();

  const all = await getProperties();
  const properties = comboProperties(all, combo, "rent");

  return (
    <>
      <ComboIntentPage combo={combo} intent="rent" properties={properties} all={all} />
      {/* The answer set already has its structured data on /rent. */}
      <FaqSection
        faqs={RENT_FAQS.slice(0, 4)}
        title="Renting a home in Phuket"
        structuredData={false}
      />
    </>
  );
}
