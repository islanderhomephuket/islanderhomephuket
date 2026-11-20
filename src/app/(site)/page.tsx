import type { Metadata } from "next";
import { isAvailable } from "@/lib/seo";
import Link from "next/link";
import { Hero, type HeroSlide } from "@/components/home/hero";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { BrowseLinks } from "@/components/home/browse-links";
import { PhuketGuide } from "@/components/home/phuket-guide";
import { CtaBand } from "@/components/home/cta-band";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ZoneCard } from "@/components/property/zone-card";
import { BlogCard } from "@/components/blog/blog-card";
import { AREAS, HERO_SLIDES, HOME_TAB_COUNT } from "@/lib/constants";
import { formatRent, formatTHB } from "@/lib/utils";
import type { Property } from "@/lib/types";
import { HomeListingTabs } from "@/components/home/home-listing-tabs";
import { isForRent, isForSale } from "@/lib/newest-filters";
import {
  getFeaturedProperties,
  getBlogPosts,
  getProperties,
  getNewestProperties,
  stripToCardFields,
  NEWEST_DAYS,
} from "@/lib/data";

/**
 * The home page carries the brand query ("islander home phuket") on its own, so
 * its title spends the space on what searchers type — rentals were half the
 * business and were missing from it entirely ("Luxury Real Estate in Phuket").
 */
export const metadata: Metadata = {
  title: { absolute: "Phuket Villas, Houses & Condos for Rent and Sale | Islander Home" },
  description:
    "Long-term rentals and property for sale across Phuket: pool villas, family houses and condos in Bang Tao, Rawai, Chalong, Kathu and more. Ask us on WhatsApp.",
  alternates: { canonical: "/" },
};

/** Featured listings become the hero's rotating photography + thumbnail rail. */
function toSlides(properties: Property[]): HeroSlide[] {
  return properties
    .filter((p) => Boolean(p.cover_image))
    .slice(0, 5)
    .map((p) => {
      const area = AREAS.find((a) => a.slug === p.area_slug);
      const isRent = p.listing_type === "rent";
      return {
        image: p.cover_image as string,
        title: p.title,
        location: `${area?.name ?? "Phuket"} · ${p.property_type}`,
        price: isRent
          ? formatRent(p.price, p.rent_period)
          : formatTHB(p.price),
        href: `/properties/${p.slug}`,
      };
    });
}

export default async function HomePage() {
  const [featured, posts, all, newestWeek] = await Promise.all([
    getFeaturedProperties(HOME_TAB_COUNT),
    getBlogPosts(),
    getProperties(),
    getNewestProperties(Number.MAX_SAFE_INTEGER, NEWEST_DAYS),
  ]);

  // The two "this week" tabs answer "what is new that I can actually take", so a
  // unit already let or sold has no business in them — unlike the hubs, which
  // keep it visible under its stamp. Six fills the same two rows as the
  // signature set. A "both" listing is new on each side, which is correct: it
  // genuinely is new to a buyer and to a renter.
  const availableThisWeek = newestWeek.filter((p) => p.status === "available");
  const newestRent = availableThisWeek.filter(isForRent).slice(0, HOME_TAB_COUNT);
  const newestBuy = availableThisWeek.filter(isForSale).slice(0, HOME_TAB_COUNT);

  const areaCounts = AREAS.map((a) => ({
    area: a,
    count: all.filter((p) => p.area_slug === a.slug && isAvailable(p)).length,
  }));

  return (
    <>
      <Hero
        slides={HERO_SLIDES.length > 0 ? HERO_SLIDES : toSlides(featured)}
      />

      {/* Featured properties, and what came in to rent this week */}
      {featured.length > 0 && (
        <section className="bg-ink py-24 sm:py-32">
          <Container>
            <HomeListingTabs
              signature={stripToCardFields(featured)}
              newestRent={stripToCardFields(newestRent)}
              newestBuy={stripToCardFields(newestBuy)}
            />
          </Container>
        </section>
      )}

      {/* Areas */}
      <section className="bg-charcoal py-24 sm:py-32">
        <Container>
          <SectionHeading
            align="center"
            kicker="Explore by Area"
            title="Phuket's finest addresses"
            description="From beachfront Bang Tao to the heritage streets of Old Town, discover the neighbourhood that suits your life."
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4">
            {areaCounts.map(({ area, count }) => (
              <ZoneCard
                key={area.slug}
                area={area}
                count={count}
                href={`/areas/${area.slug}`}
              />
            ))}
          </div>
        </Container>
      </section>
      <BrowseLinks />

      <PhuketGuide />

      <WhyChooseUs />

      <CtaBand image={featured[0]?.cover_image} signature />

      {/* Journal */}
      {posts.length > 0 && (
        <section className="bg-charcoal py-24 sm:py-32">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                kicker="The Journal"
                title="Insights & island guides"
                description="Market intelligence, buying guides and lifestyle stories from the Islander Home team."
              />
              <Link
                href="/blog"
                className="shrink-0 text-sm font-semibold uppercase tracking-[0.18em] text-paper/60 transition-colors hover:text-paper"
              >
                All articles →
              </Link>
            </div>
            <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {posts.slice(0, 3).map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
