import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { BlogCard } from "@/components/blog/blog-card";
import { CtaBand } from "@/components/home/cta-band";
import { getBlogPostBySlug, getBlogPosts, getAllBlogSlugs } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { SITE } from "@/lib/constants";

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: `${post.title} | ${SITE.name}`,
      description: post.excerpt,
      images: post.cover_image ? [{ url: post.cover_image }] : undefined,
      publishedTime: post.published_at ?? undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const all = await getBlogPosts();
  const related = all.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <article>
      {/* Hero */}
      <section className="relative flex min-h-[55vh] items-end overflow-hidden pb-14 pt-32">
        <Image
          src={post.cover_image ?? "/properties/villa-1.png"}
          alt={post.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/30" />
        <Container className="relative">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.16em] text-gold-light">
            {post.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
            <span className="text-paper/60">· {formatDate(post.published_at)}</span>
          </div>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight text-paper sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-3 text-paper/70">By {post.author}</p>
        </Container>
      </section>

      {/* Content */}
      <section className="bg-charcoal py-16">
        <Container className="max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold-dark hover:text-paper"
          >
            <ArrowLeft className="h-4 w-4" /> Back to journal
          </Link>
          <div
            className="prose-luxe mt-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </Container>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-ink py-20">
          <Container>
            <h2 className="font-display text-2xl font-semibold text-paper">
              More from the journal
            </h2>
            <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <CtaBand />
    </article>
  );
}
