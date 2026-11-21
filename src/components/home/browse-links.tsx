/**
 * Property categories, as one clean row.
 *
 * This was four columns of links — buy by type, buy by area, rent by type,
 * rent by area — about forty of them, plus a "most searched" line. They were
 * put there because the homepage carries the most authority on the site and
 * was passing almost none of it on. That problem is now solved elsewhere:
 * `/buy` and `/rent` each link every area and type hub (fifteen apiece), so
 * every hub is two clicks from the homepage, and all 546 URLs are in the
 * sitemap. What the forty links cost was the homepage itself — a wall of
 * navigation under eight property cards.
 *
 * What stays here is the shortest list that still does the job: five
 * categories, each linking to both of its hubs with a live count, and one line
 * of the highest-intent long-tail pages. Ten links instead of forty, and
 * nothing is orphaned.
 */

import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { getProperties } from "@/lib/data";
import {
  PROPERTY_TYPE_PAGES,
  isPropertyTypeMatch,
} from "@/lib/property-type-pages";
import { isAvailable, matchesIntent } from "@/lib/seo";

/** The long-tail pages worth a homepage link of their own. */
const MOST_SEARCHED: [string, string][] = [
  ["/buy/pool-villas", "pool villas for sale"],
  ["/rent/pool-villas", "pool villas for rent"],
  ["/rent/furnished-condos", "furnished condos for rent"],
  ["/buy/bang-tao/villas", "Bang Tao villas for sale"],
];

export async function BrowseLinks() {
  const all = (await getProperties()).filter(isAvailable);

  const categories = PROPERTY_TYPE_PAGES.map((t) => {
    const of = (intent: "buy" | "rent") =>
      all.filter((p) => matchesIntent(p, intent) && isPropertyTypeMatch(p, t))
        .length;
    return { type: t, sale: of("buy"), rent: of("rent") };
  }).filter((c) => c.sale + c.rent > 0);

  return (
    <section className="bg-ink py-20 sm:py-24">
      <Container>
        <SectionHeading
          kicker="Browse by type"
          title="What kind of home are you after?"
        />

        <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-paper/10 bg-paper/10 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map(({ type, sale, rent }) => (
            <li key={type.slug} className="bg-ink px-6 py-7">
              <p className="display-caps text-xl text-paper">{type.plural}</p>
              <div className="mt-4 flex flex-col gap-1.5 text-sm">
                {sale > 0 && (
                  <Link
                    href={`/buy/${type.slug}`}
                    className="flex items-baseline justify-between gap-3 text-paper/70 transition-colors hover:text-paper"
                  >
                    <span>For sale</span>
                    <span className="tabular-nums text-paper/40">{sale}</span>
                  </Link>
                )}
                {rent > 0 && (
                  <Link
                    href={`/rent/${type.slug}`}
                    className="flex items-baseline justify-between gap-3 text-paper/70 transition-colors hover:text-paper"
                  >
                    <span>To rent</span>
                    <span className="tabular-nums text-paper/40">{rent}</span>
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-sm text-paper/55">
          Most searched:{" "}
          {MOST_SEARCHED.map(([href, label], i) => (
            <span key={href}>
              <Link
                href={href}
                className="text-paper/80 underline-offset-4 hover:text-paper hover:underline"
              >
                {label}
              </Link>
              {i < MOST_SEARCHED.length - 1 ? " · " : ""}
            </span>
          ))}
        </p>
      </Container>
    </section>
  );
}
