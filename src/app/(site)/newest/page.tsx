import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PropertyGrid } from "@/components/property/property-grid";
import { ButtonLink } from "@/components/ui/button";
import { getNewestProperties, NEWEST_COUNT, NEWEST_DAYS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Newest Property Listings in Phuket",
  description:
    "The latest villas, condos, houses and hotels added to Islander Home Phuket — everything added in the last 7 days, for sale and rent, updated as it is published.",
  alternates: { canonical: "/newest" },
};

export default async function NewestPage() {
  const properties = await getNewestProperties(NEWEST_COUNT);

  return (
    <>
      <section className="bg-ink pb-12 pt-32">
        <Container>
          <p className="kicker text-gold-light">Just Listed</p>
          <h1 className="display-caps mt-3 text-4xl text-paper sm:text-5xl">
            Newest Listings in Phuket
          </h1>
          <p className="mt-4 max-w-2xl text-paper/70">
            Everything added to Islander Home Phuket in the last {NEWEST_DAYS} days (up to {NEWEST_COUNT}), newest first. Listings leave this page after a week.
          </p>
        </Container>
      </section>

      <section className="bg-charcoal py-12">
        <Container>
          <p className="text-sm text-paper/60">
            Showing{" "}
            <span className="font-semibold text-paper">{properties.length}</span>{" "}
            new {properties.length === 1 ? "listing" : "listings"} from the last {NEWEST_DAYS} days
          </p>
          <div className="mt-6">
            <PropertyGrid
              properties={properties}
              emptyMessage="Nothing new in the last week — browse everything for sale or for rent below."
            />
          </div>
          <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
            <ButtonLink href="/buy" variant="outline">
              Browse all for sale
            </ButtonLink>
            <ButtonLink href="/rent" variant="outline">
              Browse all for rent
            </ButtonLink>
          </div>
          <p className="mt-6 text-center text-sm text-paper/50">
            Looking for something specific?{" "}
            <Link href="/contact" className="underline underline-offset-4 hover:text-paper">
              Tell us what you need
            </Link>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
