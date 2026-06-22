import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { CtaBand } from "@/components/home/cta-band";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { PropertyGrid } from "@/components/property/property-grid";
import { AreaCard } from "@/components/area/area-card";
import { BlogCard } from "@/components/blog/blog-card";
import { ButtonLink } from "@/components/ui/button";
import { AREAS } from "@/lib/constants";
import {
  getFeaturedProperties,
  getBlogPosts,
  getProperties,
} from "@/lib/data";

export default async function HomePage() {
  const [featured, posts, all] = await Promise.all([
    getFeaturedProperties(6),
    getBlogPosts(),
    getProperties(),
  ]);

  const areaCounts = AREAS.map((a) => ({
    area: a,
    count: all.filter((p) => p.area_slug === a.slug).length,
  }));

  return (
    <>
      <Hero />

      {/* Featured properties */}
      {featured.length > 0 && (
        <section className="bg-charcoal py-24">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                kicker="Featured Listings"
                title="Signature properties"
                description="A handpicked selection of our finest villas, residences and homes across the island."
              />
              <ButtonLink href="/buy" variant="outline" className="shrink-0">
                View all <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
            <div className="mt-14">
              <PropertyGrid properties={featured} />
            </div>
          </Container>
        </section>
      )}

      {/* Areas */}
      <section className="bg-ink py-24">
        <Container>
          <SectionHeading
            align="center"
            kicker="Explore by Area"
            title="Phuket's finest addresses"
            description="From beachfront Bang Tao to the heritage streets of Old Town, discover the neighbourhood that suits your life."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {areaCounts.map(({ area, count }) => (
              <AreaCard key={area.slug} area={area} count={count} />
            ))}
          </div>
        </Container>
      </section>

      <WhyChooseUs />

      <CtaBand />

      {/* Journal */}
      {posts.length > 0 && (
        <section className="bg-charcoal py-24">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                kicker="The Journal"
                title="Insights & island guides"
                description="Market intelligence, buying guides and lifestyle stories from the Islander Home team."
              />
              <Link
                href="/blog"
                className="shrink-0 text-sm font-semibold uppercase tracking-[0.18em] text-gold-dark hover:text-paper"
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
