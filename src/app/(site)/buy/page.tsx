import type { Metadata } from "next";
import { Suspense } from "react";
import { PropertyListing } from "@/components/property/listing";

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
        title="Properties for Sale"
        subtitle="Own a piece of the island — from turn-key condominiums to landmark sea-view villas across Phuket's most desirable areas."
      />
    </Suspense>
  );
}
