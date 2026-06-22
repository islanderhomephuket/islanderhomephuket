import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="hover-lift group flex flex-col overflow-hidden border border-charcoal-light bg-charcoal hover:border-gold/50"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={post.cover_image ?? "/properties/villa-1.png"}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2 text-[0.65rem] uppercase tracking-[0.16em] text-gold">
          {post.tags.slice(0, 2).map((t) => (
            <span key={t}>{t}</span>
          ))}
          <span className="text-paper/40">· {formatDate(post.published_at)}</span>
        </div>
        <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-paper transition-colors group-hover:text-gold">
          {post.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-paper/60">{post.excerpt}</p>
        <span className="mt-auto pt-5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-gold transition-all group-hover:translate-x-1">
          Read article →
        </span>
      </div>
    </Link>
  );
}
