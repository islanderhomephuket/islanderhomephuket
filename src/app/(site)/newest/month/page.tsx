import type { Metadata } from "next";
import { NewestListingsPage } from "@/components/property/newest-listings-page";
import { getNewestProperties, NEWEST_MONTH_DAYS } from "@/lib/data";

const DESCRIPTION =
  "Every villa, condo, house and hotel added to Islander Home Phuket in the last 30 days — for sale and for rent across Phuket, newest first.";

export async function generateMetadata(): Promise<Metadata> {
  const [newest] = await getNewestProperties(1, NEWEST_MONTH_DAYS);
  return {
    title: "New Property Listings This Month in Phuket",
    description: DESCRIPTION,
    alternates: { canonical: "/newest/month" },
    openGraph: {
      type: "website",
      title: "New Listings This Month — Islander Home Phuket",
      description: DESCRIPTION,
      url: "/newest/month",
      images: newest?.cover_image ? [{ url: newest.cover_image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: "New Listings This Month — Islander Home Phuket",
      description: DESCRIPTION,
      images: newest?.cover_image ? [newest.cover_image] : undefined,
    },
  };
}

export default function NewestMonthPage() {
  return <NewestListingsPage period="month" />;
}
