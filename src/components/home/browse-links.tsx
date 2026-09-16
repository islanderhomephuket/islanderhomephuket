/**
 * The homepage's link block to every buy/rent hub.
 *
 * The home page carries more authority than anything else on the site, and it
 * was passing almost none of it on — one link to `/buy`, one to `/rent`, and the
 * area cards pointing at the guides rather than the listing hubs. This is the
 * plainest possible fix: real text links, with live counts, to the pages that
 * are supposed to rank.
 */

import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { AREAS } from "@/lib/constants";
import { getProperties } from "@/lib/data";
import {
  PROPERTY_TYPE_PAGES,
  isPropertyTypeMatch,
} from "@/lib/property-type-pages";
import { matchesIntent, type Intent } from "@/lib/seo";

function Column({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string; count: number }[];
}) {
  if (links.length === 0) return null;
  return (
    <div>
      <p className="kicker text-gold-light">{title}</p>
      <ul className="mt-4 space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="flex items-baseline justify-between gap-3 text-sm text-paper/75 underline-offset-4 hover:text-gold hover:underline"
            >
              <span>{l.label}</span>
              <span className="shrink-0 text-xs text-paper/40">{l.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function BrowseLinks() {
  const all = await getProperties();

  const typeLinks = (intent: Intent) =>
    PROPERTY_TYPE_PAGES.map((t) => ({
      href: `/${intent}/${t.slug}`,
      label: `${t.plural} ${intent === "rent" ? "for rent" : "for sale"}`,
      count: all.filter(
        (p) => matchesIntent(p, intent) && isPropertyTypeMatch(p, t),
      ).length,
    })).filter((l) => l.count > 0);

  const areaLinks = (intent: Intent) =>
    AREAS.map((a) => ({
      href: `/${intent}/${a.slug}`,
      label: a.name,
      count: all.filter((p) => matchesIntent(p, intent) && p.area_slug === a.slug)
        .length,
    }))
      .filter((l) => l.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

  return (
    <section className="bg-ink py-20">
      <Container>
        <SectionHeading
          kicker="Find it faster"
          title="Browse Phuket property by type and area"
        />
        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <Column title="Buy by type" links={typeLinks("buy")} />
          <Column title="Buy by area" links={areaLinks("buy")} />
          <Column title="Rent by type" links={typeLinks("rent")} />
          <Column title="Rent by area" links={areaLinks("rent")} />
        </div>
      </Container>
    </section>
  );
}
