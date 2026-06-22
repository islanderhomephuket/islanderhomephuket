import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BedDouble,
  Bath,
  Maximize,
  LandPlot,
  MapPin,
  Check,
  Hash,
  Home,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { Gallery } from "@/components/property/gallery";
import { MapEmbed } from "@/components/property/map-embed";
import { PropertyGrid } from "@/components/property/property-grid";
import { ContactForm } from "@/components/forms/contact-form";
import { WhatsAppIcon, LineIcon } from "@/components/brand/contact-icons";
import { CONTACT, getArea, whatsappLink, SITE } from "@/lib/constants";
import {
  getPropertyBySlug,
  getRelatedProperties,
  getAllPropertySlugs,
} from "@/lib/data";
import { formatArea, formatRent, formatTHB } from "@/lib/utils";

export async function generateStaticParams() {
  const slugs = await getAllPropertySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Property not found" };
  const area = getArea(property.area_slug);
  return {
    title: property.title,
    description: property.description.slice(0, 160),
    alternates: { canonical: `/properties/${property.slug}` },
    openGraph: {
      title: `${property.title} | ${SITE.name}`,
      description: property.description.slice(0, 160),
      images: property.cover_image ? [{ url: property.cover_image }] : undefined,
    },
    other: { "property:area": area?.name ?? "Phuket" },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const area = getArea(property.area_slug);
  const related = await getRelatedProperties(property);
  const isBoth = property.listing_type === "both";
  const isRent = property.listing_type === "rent";
  const saleStr = formatTHB(property.price);
  const rentStr = formatRent(
    isBoth ? property.rent_price : property.price,
    property.rent_period,
  );
  const priceLabel = isRent ? "Rent" : isBoth ? "For Sale / Rent" : "Guide Price";
  const price = isRent ? rentStr : saleStr;

  const enquiryMessage = `Hi Islander Home, I'm interested in "${property.title}" (Ref: ${property.reference ?? property.slug}). Please send more details.`;

  const specs = [
    property.bedrooms > 0 && {
      icon: BedDouble,
      label: "Bedrooms",
      value: property.bedrooms,
    },
    property.bathrooms > 0 && {
      icon: Bath,
      label: "Bathrooms",
      value: property.bathrooms,
    },
    property.living_area && {
      icon: Maximize,
      label: "Living area",
      value: formatArea(property.living_area),
    },
    property.land_area && {
      icon: LandPlot,
      label: "Land area",
      value: formatArea(property.land_area),
    },
  ].filter(Boolean) as { icon: typeof BedDouble; label: string; value: string | number }[];

  // JSON-LD for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: property.title,
    description: property.description,
    image: property.images?.map((i) => i.url),
    address: {
      "@type": "PostalAddress",
      addressLocality: area?.name ?? "Phuket",
      addressRegion: "Phuket",
      addressCountry: "TH",
    },
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb + title */}
      <section className="bg-ink pb-10 pt-28">
        <Container>
          <nav className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em] text-paper/50">
            <Link href="/" className="hover:text-gold">
              Home
            </Link>
            <span>/</span>
            <Link
              href={property.listing_type === "rent" ? "/rent" : "/buy"}
              className="hover:text-gold"
            >
              {property.listing_type === "rent" ? "Rent" : "Buy"}
            </Link>
            <span>/</span>
            <span className="text-paper/80">{property.title}</span>
          </nav>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge tone="gold">
                  {isRent ? "For Rent" : isBoth ? "For Sale / Rent" : "For Sale"}
                </Badge>
                <Badge tone="light">{property.property_type}</Badge>
                {property.reference && (
                  <Badge tone="muted">Ref {property.reference}</Badge>
                )}
                {property.status !== "available" && (
                  <Badge tone="dark" className="capitalize">
                    {property.status}
                  </Badge>
                )}
              </div>
              <h1 className="mt-4 font-display text-4xl font-semibold text-paper sm:text-5xl">
                {property.title}
              </h1>
              <p className="mt-3 inline-flex items-center gap-2 text-paper/70">
                <MapPin className="h-4 w-4 text-gold" />
                {property.address ?? area?.name ?? "Phuket, Thailand"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.18em] text-paper/50">
                {priceLabel}
              </p>
              <p className="font-display text-3xl font-semibold text-gold sm:text-4xl">
                {price}
              </p>
              {isBoth && (
                <p className="mt-1 text-sm text-paper/70">or {rentStr}</p>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Gallery */}
      <section className="bg-charcoal py-10">
        <Container>
          <Gallery images={property.images ?? []} title={property.title} />
        </Container>
      </section>

      {/* Body */}
      <section className="bg-charcoal pb-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
            {/* Left */}
            <div>
              {/* Specs */}
              <div className="grid grid-cols-2 gap-px overflow-hidden border border-sand bg-sand sm:grid-cols-4">
                {specs.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="bg-charcoal p-5 text-center">
                      <Icon className="mx-auto h-6 w-6 text-gold-dark" />
                      <p className="mt-3 font-display text-xl font-semibold text-paper">
                        {s.value}
                      </p>
                      <p className="text-xs uppercase tracking-[0.14em] text-paper/50">
                        {s.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Description */}
              <div className="mt-12">
                <SectionHeading kicker="Overview" title="About this property" />
                <p className="mt-6 whitespace-pre-line leading-relaxed text-paper/75">
                  {property.description}
                </p>
              </div>

              {/* Features */}
              {property.features.length > 0 && (
                <div className="mt-12">
                  <SectionHeading kicker="Features" title="What's included" />
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {property.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-3 border border-sand bg-ink/40 px-4 py-3 text-sm text-paper/75"
                      >
                        <Check className="h-4 w-4 shrink-0 text-gold-dark" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Map */}
              <div className="mt-12">
                <SectionHeading kicker="Location" title={area?.name ?? "Phuket"} />
                <div className="mt-6 h-[26rem] overflow-hidden border border-sand">
                  <MapEmbed
                    query={!property.latitude ? area?.mapQuery : undefined}
                    lat={property.latitude}
                    lng={property.longitude}
                    title={`${property.title} location`}
                  />
                </div>
              </div>
            </div>

            {/* Right — sticky enquiry */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="border border-sand bg-ink/40 p-6">
                <div className="flex items-center justify-between border-b border-sand pb-4">
                  <div className="flex items-center gap-2 text-sm text-paper/60">
                    <Hash className="h-4 w-4 text-gold-dark" />
                    {property.reference ?? property.slug}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-paper/60">
                    <Home className="h-4 w-4 text-gold-dark" />
                    {property.property_type}
                  </div>
                </div>

                <h3 className="mt-5 font-display text-2xl font-semibold text-paper">
                  Enquire about this property
                </h3>
                <p className="mt-2 text-sm text-paper/60">
                  Speak with an Islander Home advisor — viewings arranged at your
                  convenience.
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <a
                    href={whatsappLink(enquiryMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center justify-center gap-2 bg-[#25D366] text-xs font-semibold uppercase tracking-[0.14em] text-white"
                  >
                    <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                  </a>
                  <a
                    href={CONTACT.line}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center justify-center gap-2 bg-[#06C755] text-xs font-semibold uppercase tracking-[0.14em] text-white"
                  >
                    <LineIcon className="h-4 w-4" /> LINE
                  </a>
                </div>

                <div className="mt-5 border-t border-sand pt-5">
                  <ContactForm
                    propertyId={property.id}
                    propertyTitle={property.title}
                    source="property-detail"
                    compact
                  />
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-ink py-24">
          <Container>
            <SectionHeading
              kicker="You may also like"
              title="Similar properties"
            />
            <div className="mt-12">
              <PropertyGrid properties={related} />
            </div>
          </Container>
        </section>
      )}
    </article>
  );
}
