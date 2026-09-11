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
import { blogPostJsonLd } from "@/lib/seo";

/**
 * Posts are written in Thai or English. Marking the language lets Google index
 * each one under the right locale instead of reading Thai as broken English.
 */
const isThai = (text: string) => /[฀-๿]/.test(text);

/**
 * Posts link to each other, and some of those targets are scheduled for later.
 * A link to a post that is not live yet renders as plain text, and turns into a
 * link on its own once that post publishes and this page revalidates.
 */
function unlinkUnpublishedPosts(html: string, liveSlugs: Set<string>): string {
  return html.replace(
    /<a\s+href="\/blog\/([^"#?]+)"[^>]*>([\s\S]*?)<\/a>/g,
    (link, slug: string, text: string) => (liveSlugs.has(slug) ? link : text),
  );
}

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
    ...(isThai(post.title + post.excerpt) ? { other: { "content-language": "th" } } : {}),
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
  const content = unlinkUnpublishedPosts(
    post.content,
    new Set(all.map((p) => p.slug)),
  );

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostJsonLd(post)) }}
      />
      {/* Hero — covers are headline graphics, so the image is shown whole
          instead of cropped behind the title. */}
      <section className="bg-ink pb-12 pt-28 sm:pt-32">
        <Container className="max-w-5xl">
          {post.cover_image && (
            <div className="relative aspect-[1200/630] overflow-hidden rounded-2xl">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
              />
            </div>
          )}
          <div className="mx-auto mt-10 max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.16em] text-gold-light">
              {post.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
              <span className="text-paper/60">· {formatDate(post.published_at)}</span>
            </div>
            <h1
              className="mt-4 font-display text-4xl font-semibold leading-tight text-paper sm:text-5xl"
              lang={isThai(post.title) ? "th" : undefined}
            >
              {post.title}
            </h1>
            <p className="mt-3 text-paper/70">By {post.author}</p>
          </div>
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
            lang={isThai(post.content) ? "th" : undefined}
            dangerouslySetInnerHTML={{ __html: content }}
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
