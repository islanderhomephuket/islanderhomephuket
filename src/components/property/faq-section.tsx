/**
 * The buyer FAQ block, with its FAQPage structured data.
 *
 * Rendered as plain open `<details>` rather than a JS accordion: the answers are
 * in the HTML either way, which is the point — half of these questions are the
 * search itself, and a page that answers them is the page that gets the click.
 */

import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { faqJsonLd, type Faq } from "@/lib/faq";

export function FaqSection({
  faqs,
  title = "Buying property in Phuket as a foreigner",
  kicker = "Questions we get asked",
  /** Only one page per answer set should claim the structured data. */
  structuredData = true,
}: {
  faqs: Faq[];
  title?: string;
  kicker?: string;
  structuredData?: boolean;
}) {
  if (faqs.length === 0) return null;
  return (
    <section className="bg-ink py-16">
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
        />
      )}
      <Container>
        <SectionHeading kicker={kicker} title={title} />
        <dl className="mt-10 max-w-3xl divide-y divide-paper/10 border-y border-paper/10">
          {faqs.map((f) => (
            <div key={f.q} className="py-6">
              <dt className="text-base font-semibold text-paper">{f.q}</dt>
              <dd className="mt-3 text-sm leading-relaxed text-paper/70">{f.a}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 max-w-3xl text-xs text-paper/45">
          General information, not legal advice — the rules turn on the individual
          property and your own circumstances. We will introduce you to an
          independent Thai property lawyer before you commit to anything.
        </p>
      </Container>
    </section>
  );
}
