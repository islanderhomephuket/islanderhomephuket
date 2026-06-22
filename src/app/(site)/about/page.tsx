import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { CtaBand } from "@/components/home/cta-band";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Islander Home Phuket is a boutique luxury real estate agency helping local and international clients buy, sell and rent property across Phuket with honesty and care.",
  alternates: { canonical: "/about" },
};

const STATS = [
  { value: "150+", label: "Properties listed" },
  { value: "6", label: "Key island areas" },
  { value: "10+ yrs", label: "Local experience" },
  { value: "100%", label: "Vetted listings" },
];

const VALUES = [
  {
    title: "Honesty first",
    body: "Real photos, fair pricing and full disclosure. We'd rather lose a sale than mislead a client.",
  },
  {
    title: "Local knowledge",
    body: "Phuket is our home. We know its streets, its developers and where the real value sits.",
  },
  {
    title: "White-glove service",
    body: "From airport pickup to legal handover, we make buying overseas feel effortless.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[55vh] items-end overflow-hidden pb-12 pt-32">
        <Image
          src="/properties/villa-5.png"
          alt="Phuket luxury villa"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/30" />
        <Container className="relative">
          <p className="kicker text-gold-light">Our story</p>
          <h1 className="mt-3 font-display text-5xl font-semibold text-paper sm:text-6xl">
            About {SITE.shortName}
          </h1>
        </Container>
      </section>

      {/* Intro */}
      <section className="bg-charcoal py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <SectionHeading
                kicker="Who we are"
                title="A boutique agency built on trust"
              />
              <div className="mt-6 space-y-5 leading-relaxed text-paper/75">
                <p>
                  Islander Home Phuket is a boutique luxury real estate agency
                  dedicated to one island and one standard — excellence. We help
                  local and international clients buy, sell and rent across
                  Phuket&apos;s most desirable areas, from beachfront Bang Tao to
                  the heritage lanes of Old Town.
                </p>
                <p>
                  We believe buying property overseas should feel exciting, not
                  daunting. That&apos;s why every listing we represent is
                  inspected and verified, every price is honest, and every client
                  is guided personally — from the first viewing to the moment the
                  keys are in your hand.
                </p>
                <p>
                  Whether you&apos;re searching for a holiday home, a long-term
                  residence or a high-yield investment, our team brings the local
                  knowledge and white-glove care that turns a transaction into a
                  relationship.
                </p>
              </div>
            </div>
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src="/properties/villa-7.png"
                alt="Islander Home Phuket"
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="bg-ink py-16">
        <Container>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-4xl font-semibold text-gold sm:text-5xl">
                  {s.value}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.16em] text-paper/60">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="bg-ink py-20">
        <Container>
          <SectionHeading
            align="center"
            kicker="What we stand for"
            title="Our values"
          />
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title} className="border border-sand bg-charcoal p-8">
                <Check className="h-8 w-8 text-gold-dark" />
                <h3 className="mt-5 font-display text-xl font-semibold text-paper">
                  {v.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-paper/65">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
