import type { Metadata } from "next";
import { Suspense } from "react";
import { PropertyListing } from "@/components/property/listing";
import { AreaLinkRail } from "@/components/property/area-link-rail";
import { TypeLinkRail } from "@/components/property/type-link-rail";
import { BudgetLinkRail } from "@/components/property/budget-link-rail";
import { FaqSection } from "@/components/property/faq-section";
import { BUY_FAQS } from "@/lib/faq";

export const metadata: Metadata = {
  title: "Properties for Sale in Phuket",
  description:
    "Browse luxury villas, condominiums, townhouses and land for sale across Phuket — sea-view estates, private-pool villas and smart investments.",
  alternates: { canonical: "/buy" },
};

export default async function BuyPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  return (
    <Suspense>
      <PropertyListing
        listingType="sale"
        searchParams={params}
        title="Properties for Sale in Phuket"
        subtitle="Own a piece of the island — from turn-key condominiums to landmark sea-view villas across Phuket's most desirable areas."
      />
      <TypeLinkRail intent="buy" />
      <BudgetLinkRail />
      <AreaLinkRail intent="buy" />
      {/* The canonical home of this answer set — every other page links back here. */}
      <FaqSection faqs={BUY_FAQS} />
    </Suspense>
  );
}
