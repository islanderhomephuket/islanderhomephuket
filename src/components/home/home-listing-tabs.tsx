"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { PropertyGrid } from "@/components/property/property-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import type { Property } from "@/lib/types";
import { cn } from "@/lib/utils";

type TabId = "signature" | "newest-rent" | "newest-buy";

interface Tab {
  id: TabId;
  /** The pill. Short enough that both fit on one line at 375px. */
  label: string;
  kicker: string;
  title: string;
  description: string;
  /** Where "View all" goes for this tab. */
  href: string;
  viewAll: string;
  empty: string;
}

const TABS: Tab[] = [
  {
    id: "signature",
    label: "Signature",
    kicker: "Featured Listings",
    title: "Signature properties",
    description:
      "A handpicked selection of our finest villas, residences and homes across the island.",
    href: "/buy",
    viewAll: "View all",
    empty: "Nothing featured right now.",
  },
  {
    id: "newest-rent",
    label: "To Rent",
    kicker: "This Week",
    title: "New rentals this week",
    description:
      "Every home added to the site for rent in the last seven days, newest first — the units owners are answering messages about right now.",
    href: "/newest?for=rent",
    viewAll: "See all new rentals",
    empty:
      "No new rentals in the last seven days. Browse everything for rent instead.",
  },
  {
    id: "newest-buy",
    label: "To Buy",
    kicker: "This Week",
    title: "New for sale this week",
    description:
      "Villas, condos and houses listed for sale in the last seven days, newest first — before they have been around long enough for everyone to have seen them.",
    href: "/newest?for=sale",
    viewAll: "See all new sales",
    empty:
      "Nothing new for sale in the last seven days. Browse everything for sale instead.",
  },
];

/**
 * The homepage's listings block, as two tabs.
 *
 * Signature is a hand-picked set that changes rarely; the second tab answers
 * the question most visitors actually arrive with — what came in this week that
 * I can rent. Both lists are prepared on the server, so switching tabs costs
 * nothing, but only the open one is rendered: putting both grids in the HTML
 * would add six more cover photos to the homepage's weight for six links that
 * the area hubs and /newest already carry.
 */
export function HomeListingTabs({
  signature,
  newestRent,
  newestBuy,
}: {
  signature: Property[];
  newestRent: Property[];
  newestBuy: Property[];
}) {
  const [active, setActive] = useState<TabId>("signature");
  const tab = TABS.find((t) => t.id === active) ?? TABS[0];
  const sets: Record<TabId, Property[]> = {
    signature,
    "newest-rent": newestRent,
    "newest-buy": newestBuy,
  };
  const properties = sets[active];
  const counts: Record<TabId, number> = {
    signature: signature.length,
    "newest-rent": newestRent.length,
    "newest-buy": newestBuy.length,
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
        className="mt-10 inline-flex gap-1 rounded-full border border-paper/15 bg-charcoal p-1"
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
                // Three pills have to sit on one line at 375px, so the mobile
                // padding and tracking are tighter than the two-tab version was.
                "whitespace-nowrap rounded-full px-3 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.08em] transition-colors sm:px-5 sm:text-xs sm:tracking-[0.16em]",
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
                {counts[t.id]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-10">
        <PropertyGrid properties={properties} emptyMessage={tab.empty} />
      </div>
    </>
  );
}
