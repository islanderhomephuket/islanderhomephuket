import type { Metadata } from "next";
import { NewestListingsPage } from "@/components/property/newest-listings-page";

export const metadata: Metadata = {
  title: "Newest Property Listings in Phuket",
  description:
    "The latest villas, condos, houses and hotels added to Islander Home Phuket — everything added in the last 7 days, for sale and rent, updated as it is published.",
  alternates: { canonical: "/newest" },
};

export default function NewestPage() {
  return <NewestListingsPage period="week" />;
}
