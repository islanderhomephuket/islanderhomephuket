"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { PropertyGrid } from "@/components/property/property-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import type { Property } from "@/lib/types";
import { cn } from "@/lib/utils";

type TabId = "featured" | "sale" | "rent" | "newest";

interface Tab {
  id: TabId;
  /** The pill. Four have to share one line at 375 px, so these stay short. */
  label: string;
  kicker: string;
  title: string;
  description: string;
  /** Where "View all" goes for this tab. */
  href: string;
  viewAll: string;
  /** The same link again, under the grid, for anyone who scrolled past the top one. */
  more: string;
  empty: string;
}

const TABS: Tab[] = [
  {
    id: "featured",
    label: "Featured",
    kicker: "Featured Listings",
    title: "Signature properties",
    description:
      "A handpicked selection of our finest villas, residences and homes across the island.",
    href: "/buy",
    viewAll: "View all",
    more: "More signature properties",
    empty: "Nothing featured right now.",
  },
  {
    id: "sale",
    label: "For Sale",
    kicker: "For Sale",
    title: "Homes for sale in Phuket",
    description:
      "Villas, houses and condominiums on the market now, newest first.",
    href: "/buy",
    viewAll: "View all for sale",
    more: "See everything for sale",
    empty: "Nothing for sale on the books today.",
  },
  {
    id: "rent",
    label: "For Rent",
    kicker: "For Rent",
    title: "Homes for rent in Phuket",
    description:
      "Long-term rentals across the island, newest first. Most are let on a twelve-month contract.",
    href: "/rent",
    viewAll: "View all to rent",
    more: "See everything to rent",
    empty: "Nothing to rent on the books today.",
  },
  {
    id: "newest",
    label: "Newest",
    kicker: "This Week",
    title: "New on the site this week",
    description:
      "Everything added in the last seven days, to buy and to rent — the homes owners are answering messages about right now.",
    href: "/newest",
    viewAll: "See all new listings",
    more: "More new listings",
    empty: "Nothing new in the last seven days.",
  },
];

/**
 * The homepage's listings block, as four tabs.
 *
 * Featured is a hand-picked set that changes rarely. For Sale and For Rent
 * are the two questions every visitor actually arrives with, and they are NOT
 * limited to the last seven days — the tabs used to be Newest Rent and Newest
 * Buy, so in a quiet week the homepage could show nothing for sale at all.
 * Newest keeps the seven-day window, now covering both.
 *
 * Every set is prepared on the server, so switching costs nothing, but only
 * the open tab is rendered: four grids in the HTML would add two dozen cover
 * photos for links the hubs and /newest already carry.
 */
export function HomeListingTabs({
  featured,
  forSale,
  forRent,
  newest,
}: {
  featured: Property[];
  forSale: Property[];
  forRent: Property[];
  newest: Property[];
}) {
  const [active, setActive] = useState<TabId>("featured");
  const tab = TABS.find((t) => t.id === active) ?? TABS[0];
  const sets: Record<TabId, Property[]> = {
    featured,
    sale: forSale,
    rent: forRent,
    newest,
  };
  const properties = sets[active];
  const counts: Record<TabId, number> = {
    featured: featured.length,
    sale: forSale.length,
    rent: forRent.length,
    newest: newest.length,
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          kicker={tab.kicker}
          title={tab.title}
          description={tab.description}
        />
        <ButtonLink href={tab.href} variant="outline" className="shrink-0">
          {tab.viewAll} <ArrowRight className="h-4 w-4" />
        </ButtonLink>
      </div>

      <div
        role="group"
        aria-label="Which listings to show"
        // Full width up to a limit, with the pills sharing it equally: this is
        // the switch the homepage is built around, and at pill size it read as
        // a footnote under the heading.
        className="mt-10 flex w-full max-w-3xl gap-1.5 rounded-full border border-paper/15 bg-charcoal p-1.5"
      >
        {TABS.map((t) => {
          const isActive = t.id === active;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(t.id)}
              aria-pressed={isActive}
              className={cn(
                // Four pills now share one line at 375px, where the labels are
                // longest, so the mobile padding and tracking are tighter again.
                "flex-1 whitespace-nowrap rounded-full px-1 py-3 text-[0.58rem] font-semibold uppercase tracking-[0.02em] transition-colors sm:px-5 sm:py-4 sm:text-sm sm:tracking-[0.14em]",
                isActive ? "bg-paper text-ink" : "text-paper/55 hover:text-paper",
              )}
            >
              {t.label}
              <span
                className={cn(
                  "ml-2 tabular-nums",
                  isActive ? "text-ink/55" : "text-paper/35",
                )}
              >
                {/* Six of the eight are hidden below 1920 px, so the pill has
                    to say six there — a count that does not match the cards
                    under it is worse than no count. */}
                <span className="3xl:hidden">{Math.min(counts[t.id], 6)}</span>
                <span className="hidden 3xl:inline">{counts[t.id]}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-10">
        <PropertyGrid
          properties={properties}
          emptyMessage={tab.empty}
          sixUpBelowWide
        />
      </div>

      {/* The top "View all" scrolls out of sight behind six cards; whoever read
          to the bottom of the grid is the one who wants the rest of the list. */}
      {properties.length > 0 && (
        <div className="mt-10 flex justify-center">
          <ButtonLink href={tab.href} variant="outline" className="w-full max-w-sm justify-center">
            {tab.more} <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      )}
    </>
  );
}
