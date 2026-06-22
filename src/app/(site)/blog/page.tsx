import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { BlogCard } from "@/components/blog/blog-card";
import { getBlogPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "The Journal — Phuket Property Insights",
  description:
    "Buying guides, market intelligence and island lifestyle stories from the Islander Home Phuket team.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <section className="bg-ink pb-12 pt-32">
        <Container>
          <p className="kicker text-gold-light">The Journal</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-paper sm:text-5xl">
            Insights &amp; island guides
          </h1>
          <p className="mt-4 max-w-2xl text-paper/70">
            Practical advice for buyers and investors, plus stories from life on
            the island.
          </p>
        </Container>
      </section>

      <section className="bg-charcoal py-20">
        <Container>
          {posts.length === 0 ? (
            <SectionHeading
              align="center"
              kicker="Coming soon"
              title="Articles on the way"
              description="We're preparing our first guides. Check back shortly."
            />
          ) : (
            <>
              {featured && (
                <div className="mb-14">
                  <BlogCard post={featured} />
                </div>
              )}
              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            </>
          )}
        </Container>
      </section>
    </>
  );
}
