import type { Metadata } from "next";
import { NewestListingsPage } from "@/components/property/newest-listings-page";

export const metadata: Metadata = {
  title: "New Property Listings This Month in Phuket",
  description:
    "Every villa, condo, house and hotel added to Islander Home Phuket in the last 30 days — for sale and for rent across Phuket, newest first.",
  alternates: { canonical: "/newest/month" },
};

export default function NewestMonthPage() {
  return <NewestListingsPage period="month" />;
}
