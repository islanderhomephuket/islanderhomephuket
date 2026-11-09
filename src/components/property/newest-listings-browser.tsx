"use client";

import { useMemo, useSyncExternalStore } from "react";
import { X } from "lucide-react";
import { PropertyGrid } from "@/components/property/property-grid";
import {
  bandsForIntent,
  filterNewest,
  filterNewestByIntent,
  getNewestBand,
  matchesNewestBand,
  type NewestIntent,
} from "@/lib/newest-filters";
import type { Property } from "@/lib/types";
import { cn } from "@/lib/utils";

const INTENTS: { id: NewestIntent; label: string }[] = [
  { id: "all", label: "All" },
  { id: "sale", label: "For Sale" },
  { id: "rent", label: "For Rent" },
];

const isIntent = (v: string | null): v is NewestIntent =>
  v === "all" || v === "sale" || v === "rent";

/**
 * The query string, as a store React can read.
 *
 * The filter lives in the URL rather than in component state so the narrowed
 * list is a link — "new rentals ฿15–25K this week" is something we send to a
 * client on LINE, and that only works if the address bar follows along. It is
 * written with the History API instead of `router.replace`, because a router
 * navigation would make this page dynamic and pull its listing links out of the
 * static HTML; `useSyncExternalStore` then gives us the value without reading
 * `window` during render.
 */
const listeners = new Set<() => void>();

function subscribeToSearch(onChange: () => void) {
  listeners.add(onChange);
  // Back/forward still has to work even though we only ever replace.
  window.addEventListener("popstate", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("popstate", onChange);
  };
}

const getSearch = () => window.location.search;
/** No query string on the server, so the first paint is the unfiltered list. */
const getServerSearch = () => "";

function writeSearch(intent: NewestIntent, bandId: string | null) {
  const params = new URLSearchParams(window.location.search);
  if (intent === "all") params.delete("for");
  else params.set("for", intent);
  if (bandId) params.set("price", bandId);
  else params.delete("price");
  const qs = params.toString();
  window.history.replaceState(
    null,
    "",
    qs ? `${window.location.pathname}?${qs}` : window.location.pathname,
  );
  listeners.forEach((l) => l());
}

/**
 * The filtered half of the Newest page: the sale/rent split, the price band,
 * and the grid itself.
 *
 * It is handed the whole window and filters in the browser rather than through
 * a new query, for two reasons. The page stays statically rendered, so every
 * listing link is in the HTML Google is served — the thing the September audit
 * found broken elsewhere on this site. And a filter that costs a round trip
 * feels broken on a phone on 4G, which is how most of these links are opened.
 *
 * The cap is applied after filtering, not before: "For Sale" on the month view
 * should show all 45 sale listings, not whichever of them survived a 120-card
 * cut taken from a list that is three quarters rentals.
 */
export function NewestListingsBrowser({
  properties,
  cap,
  days,
  emptyMessage,
}: {
  properties: Property[];
  cap: number;
  days: number;
  emptyMessage: string;
}) {
  const search = useSyncExternalStore(
    subscribeToSearch,
    getSearch,
    getServerSearch,
  );
  const params = new URLSearchParams(search);
  const raw = params.get("for");
  const intent: NewestIntent = isIntent(raw) ? raw : "all";
  // A band only means something inside an intent — ฿25K of rent has none in the
  // sale list — so an unknown or mismatched one is simply dropped.
  const bandId = getNewestBand(intent, params.get("price"))?.id ?? null;

  const counts = useMemo(
    () => ({
      all: properties.length,
      sale: filterNewestByIntent(properties, "sale").length,
      rent: filterNewestByIntent(properties, "rent").length,
    }),
    [properties],
  );

  /**
   * Only the bands that actually hold something. A phone selector offering
   * "฿20M – ฿50M (0)" costs a tap to discover it is empty.
   */
  const bands = useMemo(() => {
    if (intent === "all") return [];
    const inIntent = filterNewestByIntent(properties, intent);
    return bandsForIntent(intent)
      .map((band) => ({
        band,
        count: inIntent.filter((p) => matchesNewestBand(p, intent, band)).length,
      }))
      .filter((b) => b.count > 0);
  }, [properties, intent]);

  const matching = useMemo(
    () => filterNewest(properties, intent, bandId),
    [properties, intent, bandId],
  );
  const shown = matching.slice(0, cap);
  const filtered = intent !== "all" || bandId != null;

  return (
    <>
      <div className="flex flex-col gap-4 border border-sand bg-ink p-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="group"
          aria-label="For sale or for rent"
          className="inline-flex gap-1 self-start rounded-full border border-paper/15 bg-charcoal p-1"
        >
          {INTENTS.map(({ id, label }) => {
            const active = id === intent;
            return (
              <button
                key={id}
                type="button"
                // Switching sides drops the price band rather than silently
                // emptying the page with a cap from the other market.
                onClick={() => writeSearch(id, null)}
                aria-pressed={active}
                className={cn(
                  "whitespace-nowrap rounded-full px-3.5 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.12em] transition-colors sm:px-4 sm:text-xs sm:tracking-[0.16em]",
                  active
                    ? "bg-paper text-ink"
                    : "text-paper/55 hover:text-paper",
                )}
              >
                {label}
                <span
                  className={cn(
                    "ml-1.5 tabular-nums",
                    active ? "text-ink/55" : "text-paper/35",
                  )}
                >
                  {counts[id]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {intent === "all" ? (
            <p className="text-xs text-paper/40">
              Pick For Sale or For Rent to filter by price
            </p>
          ) : (
            <select
              aria-label="Price range"
              value={bandId ?? ""}
              onChange={(e) => writeSearch(intent, e.target.value || null)}
              className="h-11 min-w-[11rem] border border-sand bg-charcoal px-3 text-sm text-paper outline-none focus:border-gold"
            >
              <option value="">Any price</option>
              {bands.map(({ band, count }) => (
                <option key={band.id} value={band.id}>
                  {band.label} ({count})
                </option>
              ))}
            </select>
          )}
          {filtered && (
            <button
              type="button"
              onClick={() => writeSearch("all", null)}
              className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.14em] text-gold-dark hover:text-paper"
            >
              <X className="h-3.5 w-3.5" /> Clear
            </button>
          )}
        </div>
      </div>

      <p className="mt-6 text-sm text-paper/60">
        Showing <span className="font-semibold text-paper">{shown.length}</span>{" "}
        {shown.length === 1 ? "listing" : "listings"}
        {matching.length > shown.length ? ` of ${matching.length}` : ""} from the
        last {days} days
        {filtered && <span className="text-paper/40"> · filtered</span>}
      </p>

      <div className="mt-6">
        <PropertyGrid
          properties={shown}
          emptyMessage={
            filtered
              ? "Nothing new in that price range this period. Try Any price, the other side of the market, or This Month."
              : emptyMessage
          }
        />
      </div>
    </>
  );
}
