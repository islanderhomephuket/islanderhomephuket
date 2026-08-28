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
    <section className="bg-ink py-24 sm:py-32">
      <Container>
        <SectionHeading
          align="center"
          kicker="Why Islander Home"
          title="A trusted partner on the island"
          description="Buying or renting overseas should feel effortless. We combine luxury service with the local knowledge that protects your investment."
        />
        <div className="mt-16 grid gap-px overflow-hidden rounded-[1.5rem] border border-paper/10 bg-paper/10 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((r) => {
            const Icon = r.icon;
            return (
              <div
                key={r.title}
                className="group bg-charcoal p-8 transition-colors hover:bg-charcoal-light"
              >
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-paper/25 text-paper transition-colors group-hover:border-paper group-hover:bg-paper group-hover:text-ink">
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="mt-6 font-display text-lg font-medium text-paper">
                  {r.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-paper/55">
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
