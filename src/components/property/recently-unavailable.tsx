/**
 * The let and sold listings under an intent page's live grid.
 *
 * Since the November status sync, three rentals in four are already let. Shown
 * in the main grid they buried the 17 available Bang Tao rentals under 69
 * "Rented" stamps and inflated every count Google read ("86 for rent"). The
 * live grid, its counts and its index rules now cover available homes only;
 * the most recent let/sold ones stay visible here, below them, as a guide to
 * what an area rents or sells for.
 */

import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { PropertyGrid } from "@/components/property/property-grid";
import { getProperties } from "@/lib/data";
import { isAvailable, matchesListingIntent, type Intent } from "@/lib/seo";
import type { Property } from "@/lib/types";

/** Enough to show the going rate without rebuilding the 600 KB pages. */
const SHOW = 12;

export async function RecentlyUnavailable({
  intent,
  what,
  match,
}: {
  intent: Intent;
  /** Reads after "Recently rented: " — "villas in Bang Tao", "homes in Rawai". */
  what: string;
  match: (p: Property) => boolean;
}) {
  const gone = (await getProperties())
    .filter((p) => matchesListingIntent(p, intent) && !isAvailable(p) && match(p))
    .slice(0, SHOW);
  if (gone.length === 0) return null;
  const rent = intent === "rent";

  return (
    <section className="bg-ink py-16">
      <Container>
        <SectionHeading
          kicker={rent ? "Already let" : "Already sold"}
          title={`Recently ${rent ? "rented" : "sold"}: ${what}`}
          description={`No longer available — shown as a guide to what ${what} ${rent ? "rent" : "sell"} for. Message us and we will look for something similar.`}
        />
        <div className="mt-10">
          <PropertyGrid properties={gone} />
        </div>
      </Container>
    </section>
  );
}
