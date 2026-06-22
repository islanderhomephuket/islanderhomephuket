import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PostForm } from "@/components/admin/post-form";

export default function NewPostPage() {
  return (
    <div>
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-gold-dark hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Back to journal
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold text-ink">
        New article
      </h1>
      <div className="mt-8">
        <PostForm />
      </div>
    </div>
  );
}
