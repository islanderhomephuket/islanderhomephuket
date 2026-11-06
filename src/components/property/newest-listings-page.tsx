import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PropertyGrid } from "@/components/property/property-grid";
import { ButtonLink } from "@/components/ui/button";
import {
  getNewestProperties,
  NEWEST_COUNT,
  NEWEST_DAYS,
  NEWEST_MONTH_COUNT,
  NEWEST_MONTH_DAYS,
} from "@/lib/data";
import { cn } from "@/lib/utils";

export type NewestPeriod = "week" | "month";

const PERIODS = {
  week: {
    href: "/newest",
    label: "This Week",
    days: NEWEST_DAYS,
    cap: NEWEST_COUNT,
    heading: "Newest Listings in Phuket",
    empty:
      "Nothing new in the last week — try This Month, or browse everything for sale or for rent below.",
  },
  month: {
    href: "/newest/month",
    label: "This Month",
    days: NEWEST_MONTH_DAYS,
    cap: NEWEST_MONTH_COUNT,
    heading: "New This Month in Phuket",
    empty:
      "Nothing new in the last month — browse everything for sale or for rent below.",
  },
} as const;

/**
 * Both windows are read on every render, not just the one being shown: the
 * counts go in the tabs, and getProperties() is request-cached, so the second
 * window is a filter over rows already in hand rather than a second query.
 */
export async function NewestListingsPage({ period }: { period: NewestPeriod }) {
  const [week, month] = await Promise.all([
    getNewestProperties(Number.MAX_SAFE_INTEGER, NEWEST_DAYS),
    getNewestProperties(Number.MAX_SAFE_INTEGER, NEWEST_MONTH_DAYS),
  ]);
  const counts = { week: week.length, month: month.length };

  const cfg = PERIODS[period];
  const properties = (period === "week" ? week : month).slice(0, cfg.cap);
  const capped = counts[period] > properties.length;

  return (
    <>
      <section className="bg-ink pb-12 pt-32">
        <Container>
          <p className="kicker text-gold-light">Just Listed</p>
          <h1 className="display-caps mt-3 text-4xl text-paper sm:text-5xl">
            {cfg.heading}
          </h1>
          <p className="mt-4 max-w-2xl text-paper/70">
            Everything added to Islander Home Phuket in the last {cfg.days} days,
            newest first — for sale and for rent. Listings leave this page once
            they are older than that.
          </p>

          <nav
            aria-label="How far back to look"
            className="mt-8 inline-flex gap-1 rounded-full border border-paper/15 bg-charcoal p-1"
          >
            {(Object.keys(PERIODS) as NewestPeriod[]).map((key) => {
              const tab = PERIODS[key];
              const active = key === period;
              return (
                <Link
                  key={key}
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    // Both labels have to sit on one line at 375px, or the pill
                    // wraps to two rows and the row stops reading as tabs.
                    "whitespace-nowrap rounded-full px-4 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] transition-colors sm:px-5 sm:text-xs sm:tracking-[0.18em]",
                    active
                      ? "bg-paper text-ink"
                      : "text-paper/55 hover:text-paper",
                  )}
                >
                  {tab.label}
                  <span
                    className={cn(
                      "ml-2 tabular-nums",
                      active ? "text-ink/55" : "text-paper/35",
                    )}
                  >
                    {counts[key]}
                  </span>
                </Link>
              );
            })}
          </nav>
        </Container>
      </section>

      <section className="bg-charcoal py-12">
        <Container>
          <p className="text-sm text-paper/60">
            Showing{" "}
            <span className="font-semibold text-paper">{properties.length}</span>{" "}
            {properties.length === 1 ? "listing" : "listings"}
            {capped ? ` of ${counts[period]}` : ""} from the last {cfg.days} days
          </p>
          <div className="mt-6">
            <PropertyGrid properties={properties} emptyMessage={cfg.empty} />
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
            <Link
              href="/contact"
              className="underline underline-offset-4 hover:text-paper"
            >
              Tell us what you need
            </Link>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
