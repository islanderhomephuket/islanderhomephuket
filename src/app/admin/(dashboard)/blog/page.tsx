import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { getBlogPosts } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { deletePostAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await getBlogPosts({ includeUnpublished: true });

  return (
    <div>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Journal</h1>
          <p className="mt-1 text-sm text-ink/55">
            {posts.length} post{posts.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex h-11 items-center gap-2 bg-ink px-5 text-xs font-semibold uppercase tracking-[0.16em] text-paper hover:bg-charcoal"
        >
          <Plus className="h-4 w-4" /> New post
        </Link>
      </header>

      <div className="mt-8 grid gap-4">
        {posts.map((post) => (
          <article
            key={post.id}
            className="flex flex-wrap items-center gap-5 border border-sand bg-paper p-4"
          >
            <div className="relative h-20 w-28 shrink-0 overflow-hidden bg-sand">
              <Image
                src={post.cover_image ?? "/properties/villa-1.png"}
                alt={post.title}
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="truncate font-display text-lg font-semibold text-ink">
                  {post.title}
                </h2>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] ${
                    post.published
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {post.published ? "Published" : "Draft"}
                </span>
              </div>
              <p className="mt-1 line-clamp-1 text-sm text-ink/55">
                {post.excerpt}
              </p>
              <p className="mt-1 text-xs text-ink/40">
                {post.author} · {formatDate(post.published_at ?? post.created_at)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/blog/${post.id}`}
                className="inline-flex h-9 items-center gap-1.5 border border-sand px-3 text-xs font-medium text-ink/70 hover:border-ink"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Link>
              <form action={deletePostAction}>
                <input type="hidden" name="id" value={post.id} />
                <button
                  type="submit"
                  className="inline-flex h-9 items-center border border-red-200 px-3 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
