import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PostForm } from "@/components/admin/post-form";
import { getBlogPostById } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getBlogPostById(id);
  if (!post) notFound();

  return (
    <div>
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-gold-dark hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Back to journal
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold text-ink">
        Edit article
      </h1>
      <p className="mt-1 text-sm text-ink/55">{post.title}</p>
      <div className="mt-8">
        <PostForm post={post} />
      </div>
    </div>
  );
}
