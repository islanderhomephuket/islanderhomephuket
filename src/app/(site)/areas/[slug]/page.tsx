import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { PropertyGrid } from "@/components/property/property-grid";
import { ButtonLink } from "@/components/ui/button";
import { MapEmbed } from "@/components/property/map-embed";
import { AREAS, getArea } from "@/lib/constants";
import { getPropertiesByArea } from "@/lib/data";

/** How many listings the guide shows before handing off to the intent hub. */
const TEASER = 6;

export function generateStaticParams() {
  return AREAS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const area = getArea(slug);
  if (!area) return { title: "Area not found" };
  return {
    title: `${area.name} Property — ${area.tagline}`,
    description: area.blurb,
    alternates: { canonical: `/areas/${area.slug}` },
  };
}

export default async function AreaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const area = getArea(slug);
  if (!area) notFound();

  const properties = await getPropertiesByArea(slug);
  // "both" listings appear under the For Sale section to avoid duplication.
  const forSale = properties.filter(
    (p) => p.listing_type === "sale" || p.listing_type === "both",
  );
  const forRent = properties.filter((p) => p.listing_type === "rent");

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[60vh] items-end overflow-hidden pb-12 pt-32">
        <Image
          src={area.image}
          alt={area.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/30" />
        <Container className="relative">
          <p className="kicker text-gold-light">Phuket Area Guide</p>
          <h1 className="display-caps mt-3 text-5xl text-paper sm:text-6xl">
            {area.name}
          </h1>
          <p className="mt-3 text-lg text-paper/80">{area.tagline}</p>
        </Container>
      </section>

      {/* Overview */}
      <section className="bg-charcoal py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <SectionHeading
                kicker="About the area"
                title={`Living in ${area.name}`}
                description={area.blurb}
              />
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {area.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-sm text-paper/75">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold-dark" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
            <div className="h-80 overflow-hidden border border-sand lg:h-full">
              <MapEmbed query={area.mapQuery} title={`${area.name} map`} />
            </div>
          </div>
        </Container>
      </section>

      {/* Listings */}
      <section className="bg-ink py-20">
        <Container>
          {properties.length === 0 ? (
            <div className="text-center">
              <SectionHeading
                align="center"
                kicker="Coming soon"
                title={`New ${area.name} listings on the way`}
                description="We're curating new properties in this area. Register your interest and we'll notify you first."
              />
              <div className="mt-8">
                <ButtonLink href="/contact" variant="primary">
                  Register Interest
                </ButtonLink>
              </div>
            </div>
          ) : (
            <>
              {forSale.length > 0 && (
                <div>
                  <SectionHeading
                    kicker="For sale"
                    title={`Property for sale in ${area.name}`}
                    description={`${forSale.length} ${forSale.length === 1 ? "home" : "homes"} for sale in ${area.name} right now.`}
                  />
                  <div className="mt-10">
                    <PropertyGrid properties={forSale.slice(0, TEASER)} />
                  </div>
                  <div className="mt-8">
                    <ButtonLink href={`/buy/${area.slug}`} variant="outline">
                      {forSale.length > TEASER
                        ? `See all ${forSale.length} for sale in ${area.name}`
                        : `${area.name} property for sale`}
                    </ButtonLink>
                  </div>
                </div>
              )}
              {forRent.length > 0 && (
                <div className="mt-20">
                  <SectionHeading
                    kicker="For rent"
                    title={`Property for rent in ${area.name}`}
                    description={`${forRent.length} long-term ${forRent.length === 1 ? "rental" : "rentals"} available in ${area.name}.`}
                  />
                  <div className="mt-10">
                    <PropertyGrid properties={forRent.slice(0, TEASER)} />
                  </div>
                  <div className="mt-8">
                    <ButtonLink href={`/rent/${area.slug}`} variant="outline">
                      {forRent.length > TEASER
                        ? `See all ${forRent.length} rentals in ${area.name}`
                        : `${area.name} rentals`}
                    </ButtonLink>
                  </div>
                </div>
              )}
            </>
          )}
        </Container>
      </section>
    </>
  );
}
