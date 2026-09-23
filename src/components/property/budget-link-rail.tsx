/**
 * "Browse by budget" rail for /buy.
 *
 * A buyer's first filter is the number, so the budget pages need to sit one
 * click from the section page — with a live count, because a band with nothing
 * behind it is worse than no link at all.
 */

import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { getProperties } from "@/lib/data";
import {
  PRICE_BAND_PAGES,
  bandType,
  isInPriceBand,
} from "@/lib/price-band-pages";
import { matchesIntent, priceRange } from "@/lib/seo";

export async function BudgetLinkRail() {
  const all = await getProperties();
  const rows = PRICE_BAND_PAGES.map((band) => {
    const items = all.filter((p) => matchesIntent(p, "buy") && isInPriceBand(p, band));
    return { band, count: items.length, range: priceRange(items, "buy") };
  }).filter((r) => r.count > 0);

  if (rows.length === 0) return null;

  return (
    <section className="bg-ink py-16">
      <Container>
        <SectionHeading
          kicker="By budget"
          title="Phuket property for sale by price"
        />
        <ul className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {rows.map(({ band, count, range }) => (
            <li key={band.slug} className="border-b border-paper/10 pb-3">
              <Link
                href={`/buy/${band.slug}`}
                className="flex items-baseline justify-between gap-4 text-paper/85 hover:text-gold"
              >
                <span>
                  {bandType(band).plural} under {band.cap}
                </span>
                <span className="shrink-0 text-xs text-paper/45">{count}</span>
              </Link>
              {range && <p className="mt-1 text-xs text-paper/45">{range}</p>}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
