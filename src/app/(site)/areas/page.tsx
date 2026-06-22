import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { AreaCard } from "@/components/area/area-card";
import { AREAS } from "@/lib/constants";
import { getProperties } from "@/lib/data";

export const metadata: Metadata = {
  title: "Phuket Areas & Neighbourhoods",
  description:
    "Explore Phuket's key areas — Koh Kaew, Bang Tao, Phuket Town, Chalong, Rawai and Thalang. Find the neighbourhood that fits your lifestyle and investment goals.",
  alternates: { canonical: "/areas" },
};

export default async function AreasPage() {
  const all = await getProperties();
  return (
    <>
      <section className="bg-ink pb-12 pt-32">
        <Container>
          <p className="kicker text-gold-light">Explore Phuket</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-paper sm:text-5xl">
            Areas &amp; Neighbourhoods
          </h1>
          <p className="mt-4 max-w-2xl text-paper/70">
            Every corner of Phuket has its own character. Discover where your
            ideal home — and the right investment — fits best.
          </p>
        </Container>
      </section>

      <section className="bg-charcoal py-20">
        <Container>
          <SectionHeading
            kicker="Six destinations"
            title="Find your neighbourhood"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {AREAS.map((area) => (
              <AreaCard
                key={area.slug}
                area={area}
                count={all.filter((p) => p.area_slug === area.slug).length}
              />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
