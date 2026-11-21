/**
 * Three things to know, on the homepage — the short version.
 *
 * The full six notes used to sit here and ran to about 900 words of body copy
 * between the listings and the enquiry band, which is a lot to scroll past.
 * They now live on /about, which is an indexed page and was thin, so nothing
 * is lost and the words moved somewhere they belong.
 *
 * What is left is three topics in a sentence each, and each one links to the
 * article that already answers it in full. That is the point of the trade: the
 * homepage gets shorter AND the blog — 26 posts that Google only started
 * seeing on 17/11 — finally gets internal links from the strongest page on
 * the site.
 */

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";

const TOPICS: { title: string; body: string; href: string; cta: string }[] = [
  {
    title: "What a foreigner can actually own",
    body: "A condo can be held freehold in your own name. Land cannot, so a villa is normally a registered long lease or a Thai company — and which one you use changes what you actually own.",
    href: "/blog/buying-property-in-phuket-guide-for-foreigners",
    cta: "Read the ownership guide",
  },
  {
    title: "Choosing the right side of the island",
    body: "The west coast is beaches and resorts, the east is schools, hospitals and the airport road, the south is the long-stay expat belt. Same island, genuinely different lives.",
    href: "/blog/best-areas-to-buy-property-in-phuket",
    cta: "Compare the areas",
  },
  {
    title: "What the numbers really look like",
    body: "An advertised yield assumes strong high-season occupancy and professional management. Take off the management share and the weeks you keep for yourself and the real figure moves.",
    href: "/blog/phuket-villa-vs-condo-investment",
    cta: "Villa or condo, as an investment",
  },
];

export function PhuketGuidePreview() {
  return (
    <section className="bg-ink py-24 sm:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-paper/25" />
              <p className="kicker">Island knowledge</p>
            </div>
            <h2 className="display-caps mt-5 text-[2rem] text-paper sm:text-[2.6rem]">
              What people should know about Phuket
            </h2>
          </div>
          <Link
            href="/about"
            className="shrink-0 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-paper/70 transition-colors hover:text-paper"
          >
            All six →
          </Link>
        </div>

        <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-paper/10 bg-paper/10 lg:grid-cols-3">
          {TOPICS.map((t, i) => (
            <li key={t.href} className="flex flex-col bg-ink px-7 py-8">
              <span className="font-display text-sm font-medium tabular-nums text-paper/30">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-lg font-medium leading-snug text-paper">
                {t.title}
              </h3>
              <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-paper/60">
                {t.body}
              </p>
              <Link
                href={t.href}
                className="mt-6 inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-paper transition-opacity hover:opacity-70"
              >
                {t.cta}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </li>
          ))}
        </ol>

        <p className="mt-8 text-xs leading-relaxed text-paper/35">
          General guidance, not legal or tax advice. Rules and rates change —
          confirm your situation with a licensed Thai lawyer before you sign or
          transfer any money.
        </p>
      </Container>
    </section>
  );
}
