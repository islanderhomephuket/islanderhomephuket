import type { Metadata } from "next";
import { Suspense } from "react";
import { PropertyListing } from "@/components/property/listing";

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
        title="Properties for Rent"
        subtitle="Settle into island life — handpicked long-term rentals, from beachside apartments to private-pool family villas."
      />
    </Suspense>
  );
}
