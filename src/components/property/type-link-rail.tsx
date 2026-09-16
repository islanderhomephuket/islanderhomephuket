/**
 * "Browse by type" rail for the island-wide /rent and /buy pages.
 *
 * Buyers start from the type ("pool villa for sale Phuket") far more often than
 * renters do, so the type hubs need to sit one click from the section page the
 * same way the area hubs already do.
 */

import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { getProperties } from "@/lib/data";
import {
  PROPERTY_TYPE_PAGES,
  isPropertyTypeMatch,
} from "@/lib/property-type-pages";
import { matchesIntent, priceRange, type Intent } from "@/lib/seo";

export async function TypeLinkRail({ intent }: { intent: Intent }) {
  const all = await getProperties();
  const rows = PROPERTY_TYPE_PAGES.map((type) => {
    const items = all.filter(
      (p) => matchesIntent(p, intent) && isPropertyTypeMatch(p, type),
    );
    return { type, count: items.length, range: priceRange(items, intent) };
  })
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count);

  if (rows.length === 0) return null;
  const verb = intent === "rent" ? "for rent" : "for sale";

  return (
    <section className="bg-charcoal py-16">
      <Container>
        <SectionHeading
          kicker="By type"
          title={`Browse Phuket property ${verb} by type`}
        />
        <ul className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {rows.map(({ type, count, range }) => (
            <li key={type.slug} className="border-b border-sand pb-3">
              <Link
                href={`/${intent}/${type.slug}`}
                className="flex items-baseline justify-between gap-4 text-paper/85 hover:text-gold"
              >
                <span>
                  {type.plural} {verb}
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
