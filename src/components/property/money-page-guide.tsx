/**
 * Guide copy for the handful of pages that carry the site's biggest searches.
 *
 * Search Console (Aug–Nov 2026) shows Google already matching these pages to
 * high-volume phrases — "luxury villa bang tao sale" (1,872 impressions),
 * "4 bedroom villa phuket sale" (1,478), "4 bedroom villa laguna phuket" (921),
 * "villa rental bang tao", "condo for rent phuket" — but at positions 20–50,
 * with nothing on the page beyond listing cards. Each guide adds what a
 * searcher actually asks: what it costs, what is on the market, who can own
 * it, how a lease works. Every number is computed from the live, available
 * listings on the page, so the copy cannot drift from the stock. Legal and
 * lease facts match the long-form guides they link to.
 */

import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { AREAS, whatsappLink } from "@/lib/constants";
import type { Property } from "@/lib/types";

/* ───────────────────────── stats ───────────────────────── */

const prices = (ps: Property[]) =>
  ps.map((p) => Number(p.price)).filter((n) => n > 0).sort((a, b) => a - b);

const median = (xs: number[]) =>
  xs.length === 0
    ? 0
    : xs.length % 2
      ? xs[(xs.length - 1) / 2]
      : (xs[xs.length / 2 - 1] + xs[xs.length / 2]) / 2;

/** ฿7M, ฿16.99M, ฿160,000 — sale prices in millions, rents in full. */
function baht(n: number, rent: boolean): string {
  if (rent || n < 1_000_000) return `฿${Math.round(n).toLocaleString("en-US")}`;
  const m = n / 1_000_000;
  const s = m >= 10 ? m.toFixed(1) : m.toFixed(2);
  return `฿${s.replace(/\.?0+$/, "")}M`;
}

const hasPool = (p: Property) =>
  /pool/i.test(`${p.title} ${p.description ?? ""} ${(p.features ?? []).join(" ")}`);

interface Stats {
  n: number;
  min: number;
  max: number;
  median: number;
  pools: number;
  byBeds: { beds: number; count: number; from: number; to: number }[];
  byArea: { name: string; slug: string; count: number; median: number }[];
}

function stats(ps: Property[]): Stats {
  const pr = prices(ps);
  const bedsMap = new Map<number, Property[]>();
  for (const p of ps) {
    const b = Number(p.bedrooms) || 0;
    bedsMap.set(b, [...(bedsMap.get(b) ?? []), p]);
  }
  const byBeds = [...bedsMap.entries()]
    .filter(([b]) => b > 0)
    .sort((a, b) => a[0] - b[0])
    .map(([beds, list]) => {
      const lp = prices(list);
      return { beds, count: list.length, from: lp[0] ?? 0, to: lp[lp.length - 1] ?? 0 };
    });
  const byArea = AREAS.map((a) => {
    const list = ps.filter((p) => p.area_slug === a.slug);
    return { name: a.name, slug: a.slug, count: list.length, median: median(prices(list)) };
  })
    .filter((a) => a.count > 0)
    .sort((a, b) => b.count - a.count);
  return {
    n: ps.length,
    min: pr[0] ?? 0,
    max: pr[pr.length - 1] ?? 0,
    median: median(pr),
    pools: ps.filter(hasPool).length,
    byBeds,
    byArea,
  };
}

/* ───────────────────────── copy ───────────────────────── */

interface Guide {
  /** Absolute `<title>` — the phrase people search, then the qualifiers. */
  title: (s: Stats) => string;
  description: (s: Stats) => string;
  kicker: string;
  heading: string;
  body: (s: Stats, rent: boolean) => React.ReactNode;
  faqs: (s: Stats, rent: boolean, ps: Property[]) => { q: string; a: React.ReactNode }[];
  /** Pre-filled WhatsApp message for the closing button. */
  ask: string;
}

const A = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="text-gold underline-offset-4 hover:underline">
    {children}
  </Link>
);

const bedsLine = (s: Stats, rent: boolean) =>
  s.byBeds
    .map((b) => `${b.count} with ${b.beds} bedroom${b.beds === 1 ? "" : "s"} (from ${baht(b.from, rent)})`)
    .join(", ");

const GUIDES: Record<string, Guide> = {
  "/buy/bang-tao/villas": {
    title: () => "Bang Tao Villas for Sale: Luxury Pool Villas near Laguna & Cherngtalay",
    description: (s) =>
      `${s.n} villas for sale in Bang Tao, Phuket — ${baht(s.min, false)} to ${baht(s.max, false)}. Pool villas near Laguna, Cherngtalay, Pasak and Layan, 2 to 5 bedrooms.`,
    kicker: "Buyer's guide",
    heading: "Buying a villa in Bang Tao",
    body: (s) => (
      <>
        <p>
          Bang Tao is the long bay on Phuket&apos;s west coast in Cherngtalay (Choeng
          Thale), home to the Laguna Phuket resort complex and a 6 km beach. Most villas
          for sale sit a few minutes inland of the sand — around Laguna, Cherngtalay
          village, Pasak and up towards Layan — so &ldquo;Bang Tao&rdquo;,
          &ldquo;Laguna&rdquo; and &ldquo;Cherngtalay&rdquo; in a listing usually mean
          the same stretch of coast.
        </p>
        <p>
          We have <strong>{s.n} villas for sale in Bang Tao</strong> right now, from{" "}
          {baht(s.min, false)} to {baht(s.max, false)}; the middle of the list is about{" "}
          {baht(s.median, false)}. {s.pools} of them have a private pool. By size:{" "}
          {bedsLine(s, false)}.
        </p>
        <p>
          Foreigners cannot hold land in their own name in Thailand, so a villa is
          normally bought on a registered lease — the law caps each term at 30 years —
          while a condominium can be owned freehold within the 49% foreign quota. When a
          villa is advertised as &ldquo;freehold&rdquo;, ask whose name the land title
          will be in. Our{" "}
          <A href="/blog/buying-property-in-phuket-guide-for-foreigners">
            guide to buying property in Phuket as a foreigner
          </A>{" "}
          covers leasehold, freehold, taxes and the checks to run, and{" "}
          <A href="/blog/phuket-rental-yield-by-area">rental yield by area</A> shows what
          a villa earns if you let it when you are away.
        </p>
      </>
    ),
    faqs: (s, _r, ps) => {
      const four = s.byBeds.find((b) => b.beds === 4);
      return [
        {
          q: "How much does a villa in Bang Tao cost?",
          a: `On our current list, ${baht(s.min, false)} to ${baht(s.max, false)}, with a median around ${baht(s.median, false)}. ${s.byBeds.map((b) => `${b.beds}-bedroom villas start from ${baht(b.from, false)}`).join("; ")}.`,
        },
        ...(four
          ? [
              {
                q: "Do you have 4-bedroom villas for sale in Bang Tao and Laguna?",
                a: (
                  <>
                    Yes — {four.count} right now, {baht(four.from, false)} to{" "}
                    {baht(four.to, false)}:{" "}
                    {ps
                      .filter((p) => Number(p.bedrooms) === 4)
                      .slice(0, 12)
                      .map((p, i, arr) => (
                        <span key={p.slug}>
                          <A href={`/properties/${p.slug}`}>
                            {p.reference ?? p.title} ({baht(Number(p.price), false)})
                          </A>
                          {i < arr.length - 1 ? ", " : "."}
                        </span>
                      ))}
                  </>
                ),
              },
            ]
          : []),
        {
          q: "Can a foreigner buy a villa in Bang Tao?",
          a: (
            <>
              Not the land in their own name. Villas are bought on a registered lease (up
              to 30 years per term), and Thai-company structures with nominee shareholders
              are now being actively investigated. The{" "}
              <A href="/blog/buying-property-in-phuket-guide-for-foreigners">
                foreign buyer&apos;s guide
              </A>{" "}
              explains each route; we introduce an independent Thai lawyer before you
              commit.
            </>
          ),
        },
        {
          q: "Is Bang Tao the same as Laguna and Cherngtalay?",
          a: "Laguna Phuket is the resort complex inside Bang Tao bay; Cherngtalay (Choeng Thale) is the subdistrict the bay sits in. Listings use all three names for the same area.",
        },
      ];
    },
    ask: "Hi Islander Home, I'm looking for a villa to buy in Bang Tao / Laguna.",
  },

  "/buy/villas": {
    title: (s) => `Villas for Sale in Phuket: ${s.n} Pool Villas, 2 to 5 Bedrooms`,
    description: (s) =>
      `${s.n} villas for sale in Phuket from ${baht(s.min, false)} — 3 and 4 bedroom pool villas in Rawai, Bang Tao, Thalang, Chalong and more. Current asking prices.`,
    kicker: "Buyer's guide",
    heading: "Buying a pool villa in Phuket",
    body: (s) => (
      <>
        <p>
          We have <strong>{s.n} villas for sale in Phuket</strong>, from{" "}
          {baht(s.min, false)} to {baht(s.max, false)} (median {baht(s.median, false)}).{" "}
          {s.pools} of them have a private pool. By size: {bedsLine(s, false)}.
        </p>
        <p>
          Where they are:{" "}
          {s.byArea.slice(0, 5).map((a, i, arr) => (
            <span key={a.slug}>
              <A href={`/buy/${a.slug}/villas`}>{a.name}</A> {a.count} (median{" "}
              {baht(a.median, false)}){i < arr.length - 1 ? ", " : "."}
            </span>
          ))}{" "}
          For a side-by-side of the areas, see{" "}
          <A href="/blog/best-areas-to-buy-property-in-phuket">
            the best areas to buy property in Phuket
          </A>{" "}
          and <A href="/blog/phuket-property-prices-2026">Phuket property prices in 2026</A>.
        </p>
        <p>
          A foreigner cannot own Thai land outright, so villas are usually bought on a
          registered lease of up to 30 years per term. The{" "}
          <A href="/blog/buying-property-in-phuket-guide-for-foreigners">
            foreign buyer&apos;s guide
          </A>{" "}
          covers leasehold, freehold, taxes and due diligence.
        </p>
      </>
    ),
    faqs: (s) => {
      const four = s.byBeds.find((b) => b.beds === 4);
      const three = s.byBeds.find((b) => b.beds === 3);
      return [
        ...(four
          ? [
              {
                q: "How much is a 4-bedroom villa for sale in Phuket?",
                a: `We have ${four.count} four-bedroom villas for sale, ${baht(four.from, false)} to ${baht(four.to, false)}.${three ? ` Three-bedroom villas run ${baht(three.from, false)} to ${baht(three.to, false)} (${three.count} listed).` : ""}`,
              },
            ]
          : []),
        {
          q: "Which area of Phuket is best for buying a villa?",
          a: (
            <>
              It depends on budget and use. On our list,{" "}
              {s.byArea
                .filter((a) => a.count >= 3)
                .sort((a, b) => a.median - b.median)
                .map((a) => `${a.name} (median ${baht(a.median, false)})`)
                .join(", ")}
              . If rental income matters, compare{" "}
              <A href="/blog/phuket-rental-yield-by-area">rental yield by area</A>.
            </>
          ),
        },
        {
          q: "Can I buy a villa in Phuket as a foreigner?",
          a: (
            <>
              Not the land in your own name; villas are bought on a registered lease, or a
              condo can be owned freehold within the 49% foreign quota. Details in the{" "}
              <A href="/blog/buying-property-in-phuket-guide-for-foreigners">
                foreign buyer&apos;s guide
              </A>
              .
            </>
          ),
        },
      ];
    },
    ask: "Hi Islander Home, I'm looking for a pool villa to buy in Phuket.",
  },

  "/rent/bang-tao/villas": {
    title: () => "Bang Tao Villas for Rent: Long-Term Pool Villa Rentals, Laguna & Cherngtalay",
    description: (s) =>
      `${s.n} villas for rent in Bang Tao, Phuket now — ${baht(s.min, true)} to ${baht(s.max, true)} a month. Long-term pool villa rentals near Laguna and Cherngtalay.`,
    kicker: "Renter's guide",
    heading: "Renting a villa in Bang Tao",
    body: (s) => (
      <>
        <p>
          <strong>{s.n} villas are available to rent in Bang Tao</strong> right now, from{" "}
          {baht(s.min, true)} to {baht(s.max, true)} a month (median{" "}
          {baht(s.median, true)}); {s.pools} have a private pool. By size:{" "}
          {bedsLine(s, true)}. Villas here let quickly — the recently rented list below
          shows what went and at what rent.
        </p>
        <p>
          Bang Tao is the west-coast bay around Laguna Phuket and Cherngtalay: the
          beach clubs, Boat Avenue and Porto de Phuket for dining, and a short drive to
          Layan and Surin. Families usually look here and in Koh Kaew for school runs —
          see <A href="/blog/renting-near-international-schools-in-phuket">renting near
          international schools</A>.
        </p>
        <p>
          Long-term villa leases are normally 12 months, with a two-month deposit and
          the first month&apos;s rent up front. Read{" "}
          <A href="/blog/before-you-sign-a-lease-in-phuket">before you sign a lease in Phuket</A>{" "}
          and <A href="/blog/phuket-villa-rental-prices-2026">villa rental prices in 2026</A>{" "}
          before you commit.
        </p>
      </>
    ),
    faqs: (s) => [
      {
        q: "How much does it cost to rent a villa in Bang Tao?",
        a: `On our current list, ${baht(s.min, true)} to ${baht(s.max, true)} a month, median ${baht(s.median, true)}. ${s.byBeds.map((b) => `${b.beds}-bedroom from ${baht(b.from, true)}`).join("; ")}.`,
      },
      {
        q: "What is the minimum lease for a villa in Bang Tao?",
        a: "Most owners let for 12 months. Shorter stays are sometimes possible at a higher monthly rate — ask us and we will check with the owner.",
      },
      {
        q: "Are there pet-friendly villas for rent in Bang Tao?",
        a: (
          <>
            A few owners accept pets; it is agreed villa by villa. See{" "}
            <A href="/blog/pet-friendly-rentals-in-phuket">pet-friendly rentals in Phuket</A>{" "}
            or message us with your pet&apos;s size.
          </>
        ),
      },
    ],
    ask: "Hi Islander Home, I'm looking for a villa to rent long-term in Bang Tao.",
  },

  "/rent/condos": {
    title: (s) => `Condos for Rent in Phuket: ${s.n} Long-Term Condo Rentals from ${baht(s.min, true)}/mo`,
    description: (s) =>
      `${s.n} condos for rent in Phuket — ${baht(s.min, true)} to ${baht(s.max, true)} a month, mostly furnished 1 and 2 bedroom units in Phuket Town, Kathu, Bang Tao and more.`,
    kicker: "Renter's guide",
    heading: "Renting a condo in Phuket",
    body: (s) => (
      <>
        <p>
          <strong>{s.n} condos are available to rent in Phuket</strong>, from{" "}
          {baht(s.min, true)} to {baht(s.max, true)} a month (median{" "}
          {baht(s.median, true)}). By size: {bedsLine(s, true)}.
        </p>
        <p>
          Where they are:{" "}
          {s.byArea.slice(0, 6).map((a, i, arr) => (
            <span key={a.slug}>
              <A href={`/rent/${a.slug}/condos`}>{a.name}</A> {a.count} (median{" "}
              {baht(a.median, true)}){i < arr.length - 1 ? ", " : "."}
            </span>
          ))}{" "}
          <A href="/blog/renting-a-condo-in-phuket-by-budget">Renting a condo by budget</A>{" "}
          shows what each price level gets you, and{" "}
          <A href="/blog/phuket-rent-by-area-2026">Phuket rent by area</A> compares the
          neighbourhoods.
        </p>
        <p>
          Leases are normally 12 months with a two-month deposit and the first
          month&apos;s rent up front; check how electricity and water are billed before
          you sign — <A href="/blog/before-you-sign-a-lease-in-phuket">the lease checklist</A>{" "}
          covers it.
        </p>
      </>
    ),
    faqs: (s) => {
      const cheapest = s.byArea.filter((a) => a.count >= 3).sort((a, b) => a.median - b.median);
      return [
        {
          q: "How much is a condo for rent in Phuket?",
          a: `On our current list, ${baht(s.min, true)} to ${baht(s.max, true)} a month, median ${baht(s.median, true)}. ${s.byBeds.map((b) => `${b.beds}-bedroom from ${baht(b.from, true)}`).join("; ")}.`,
        },
        ...(cheapest.length > 1
          ? [
              {
                q: "Where are the cheapest condos to rent in Phuket?",
                a: `By median rent on our list: ${cheapest.map((a) => `${a.name} ${baht(a.median, true)}`).join(", ")}.`,
              },
            ]
          : []),
        {
          q: "Can I rent a condo in Phuket for less than a year?",
          a: "Most owners want 12 months. Some accept six months at a higher rent — tell us your dates and we will ask.",
        },
      ];
    },
    ask: "Hi Islander Home, I'm looking for a condo to rent long-term in Phuket.",
  },
};

/* ───────────────────────── exports ───────────────────────── */

export function moneyPageMeta(path: string, properties: Property[]) {
  const g = GUIDES[path];
  if (!g || properties.length === 0) return null;
  const s = stats(properties);
  return { title: { absolute: g.title(s) }, description: g.description(s).slice(0, 160) };
}

export function MoneyPageGuide({
  path,
  properties,
  rent,
}: {
  path: string;
  properties: Property[];
  rent: boolean;
}) {
  const g = GUIDES[path];
  if (!g || properties.length === 0) return null;
  const s = stats(properties);
  const faqs = g.faqs(s, rent, properties);

  return (
    <section className="bg-ink py-16">
      <Container>
        <div className="max-w-3xl">
          <SectionHeading kicker={g.kicker} title={g.heading} />
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-paper/75 sm:text-base">
            {g.body(s, rent)}
          </div>

          <h2 className="kicker mt-12 text-paper/80">Questions we get asked</h2>
          <div className="mt-4 divide-y divide-sand border-y border-sand">
            {faqs.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="cursor-pointer list-none text-paper/90 marker:hidden">
                  <h3 className="inline text-base">{f.q}</h3>
                </summary>
                <div className="mt-3 text-sm leading-relaxed text-paper/70">{f.a}</div>
              </details>
            ))}
          </div>

          <div data-cta="guide" className="mt-10">
            <a
              href={whatsappLink(g.ask)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 bg-[#25D366] px-6 text-xs font-semibold uppercase tracking-[0.14em] text-white"
            >
              Ask us on WhatsApp
            </a>
            <p className="mt-3 text-xs text-paper/45">
              Prices and availability are taken from the live listings on this page.
              General information, not legal advice.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
