import type { Metadata } from "next";
import { Suspense } from "react";
import { PropertyListing } from "@/components/property/listing";
import { AreaLinkRail } from "@/components/property/area-link-rail";
import { TypeLinkRail } from "@/components/property/type-link-rail";
import { BudgetLinkRail } from "@/components/property/budget-link-rail";
import { FaqSection } from "@/components/property/faq-section";
import { RENT_FAQS } from "@/lib/faq";

export const metadata: Metadata = {
  title: "Properties for Rent in Phuket",
  description:
    "Long-term rental villas, condos and homes in Phuket — fully furnished, private-pool villas and beachside apartments across the island.",
  alternates: { canonical: "/rent" },
};

export default async function RentPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  return (
    <Suspense>
      <PropertyListing
        listingType="rent"
        searchParams={params}
        title="Properties for Rent in Phuket"
        subtitle="Settle into island life — handpicked long-term rentals, from beachside apartments to private-pool family villas."
      />
      <TypeLinkRail intent="rent" />
      <BudgetLinkRail intent="rent" />
      <AreaLinkRail intent="rent" />
      {/* The canonical home of this answer set — every other page links back here. */}
      <FaqSection faqs={RENT_FAQS} title="Renting a home in Phuket" />
    </Suspense>
  );
}
