import {
  ShieldCheck,
  KeyRound,
  Scale,
  HeartHandshake,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

const REASONS = [
  {
    icon: ShieldCheck,
    title: "Vetted Listings Only",
    body: "Every property is inspected and verified — clean titles, real photos and honest pricing. No surprises.",
  },
  {
    icon: Scale,
    title: "Legal & Due Diligence",
    body: "We guide foreign buyers through freehold, leasehold and company structures with trusted local lawyers.",
  },
  {
    icon: KeyRound,
    title: "End-to-End Service",
    body: "From first viewing to handover — and rental management afterward — our team is with you at every step.",
  },
  {
    icon: HeartHandshake,
    title: "Local, Personal Expertise",
    body: "Phuket is home. We know the right streets, the right developers and the value others overlook.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <SectionHeading
          align="center"
          kicker="Why Islander Home"
          title="A trusted partner on the island"
          description="Buying or renting overseas should feel effortless. We combine luxury service with the local knowledge that protects your investment."
        />
        <div className="mt-16 grid gap-px overflow-hidden border border-charcoal-light bg-charcoal-light sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((r) => {
            const Icon = r.icon;
            return (
              <div
                key={r.title}
                className="group bg-charcoal p-8 transition-colors hover:bg-ink"
              >
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 text-gold transition-colors group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="mt-6 font-display text-xl font-semibold text-paper transition-colors group-hover:text-gold">
                  {r.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-paper/60">
                  {r.body}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
