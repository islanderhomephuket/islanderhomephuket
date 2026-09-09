/**
 * "Browse by area" link rail for the island-wide /rent and /buy pages.
 *
 * Without it the area landing pages are only reachable from a listing detail
 * page, so they sit three clicks deep and crawl slowly. This puts every one of
 * them one click from the section hub, with the count as the anchor context.
 */

import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { AREAS } from "@/lib/constants";
import { getProperties } from "@/lib/data";
import { matchesIntent, type Intent } from "@/lib/seo";

export async function AreaLinkRail({ intent }: { intent: Intent }) {
  const all = await getProperties();
  const rows = AREAS.map((a) => ({
    area: a,
    count: all.filter((p) => p.area_slug === a.slug && matchesIntent(p, intent)).length,
  }))
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count);

  if (rows.length === 0) return null;
  const verb = intent === "rent" ? "for rent" : "for sale";

  return (
    <section className="bg-ink py-16">
      <Container>
        <SectionHeading
          kicker="By location"
          title={`Browse Phuket property ${verb} by area`}
        />
        <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map(({ area, count }) => (
            <li key={area.slug} className="flex items-baseline justify-between gap-4">
              <Link
                href={`/${intent}/${area.slug}`}
                className="text-paper/80 underline-offset-4 hover:text-gold hover:underline"
              >
                {area.name} property {verb}
              </Link>
              <span className="text-xs text-paper/45">{count}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
