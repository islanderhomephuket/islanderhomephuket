import type { Metadata } from "next";
import { NewestListingsPage } from "@/components/property/newest-listings-page";
import { getNewestProperties, NEWEST_DAYS } from "@/lib/data";

const DESCRIPTION =
  "The latest villas, condos, houses and hotels added to Islander Home Phuket — everything added in the last 7 days, for sale and rent, updated as it is published.";

/**
 * The listing cover goes in the share card because this is the link that gets
 * sent to people directly — on WhatsApp a real Phuket property reads as a
 * property, where the site's logo card reads as an advert.
 */
export async function generateMetadata(): Promise<Metadata> {
  const [newest] = await getNewestProperties(1, NEWEST_DAYS);
  return {
    title: "Newest Property Listings in Phuket",
    description: DESCRIPTION,
    alternates: { canonical: "/newest" },
    openGraph: {
      type: "website",
      title: "New Listings This Week — Islander Home Phuket",
      description: DESCRIPTION,
      url: "/newest",
      images: newest?.cover_image ? [{ url: newest.cover_image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: "New Listings This Week — Islander Home Phuket",
      description: DESCRIPTION,
      images: newest?.cover_image ? [newest.cover_image] : undefined,
    },
  };
}

export default function NewestPage() {
  return <NewestListingsPage period="week" />;
}
