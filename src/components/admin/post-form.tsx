"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2, Save } from "lucide-react";
import { savePostAction } from "@/app/admin/actions";
import type { BlogPost } from "@/lib/types";

export function PostForm({ post }: { post?: BlogPost }) {
  const [state, action, pending] = useActionState(savePostAction, {});

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-3">
      {post && <input type="hidden" name="id" value={post.id} />}

      <div className="space-y-6 lg:col-span-2">
        <section className="space-y-4 border border-sand bg-paper p-6">
          <Field label="Title" name="title" defaultValue={post?.title} required />
          <Field
            label="Slug (auto if blank)"
            name="slug"
            defaultValue={post?.slug}
            placeholder="buying-property-in-phuket"
          />
          <label className="block">
            <Lbl>Excerpt</Lbl>
            <textarea
              name="excerpt"
              rows={2}
              defaultValue={post?.excerpt}
              className={areaCls}
            />
          </label>
          <label className="block">
            <Lbl>Content (HTML)</Lbl>
            <textarea
              name="content"
              rows={16}
              defaultValue={post?.content}
              placeholder="<p>Your article…</p><h2>Heading</h2>"
              className={`${areaCls} font-mono text-xs`}
            />
            <span className="mt-1 block text-xs text-ink/45">
              Basic HTML supported (p, h2, h3, ul, li, blockquote, a, strong).
            </span>
          </label>
        </section>
      </div>

      <div className="space-y-6">
        <section className="space-y-4 border border-sand bg-paper p-6">
          <h2 className="font-display text-lg font-semibold text-ink">Settings</h2>
          <Field
            label="Author"
            name="author"
            defaultValue={post?.author ?? "Islander Home Team"}
          />
          <Field
            label="Tags (comma-separated)"
            name="tags"
            defaultValue={post?.tags?.join(", ")}
            placeholder="Investment, Guide"
          />
          <Field
            label="Cover image URL"
            name="cover_image"
            defaultValue={post?.cover_image ?? ""}
            placeholder="/properties/villa-1.png"
          />
          <label className="flex items-center gap-3 pt-1 text-sm text-ink/75">
            <input
              type="checkbox"
              name="published"
              defaultChecked={post?.published}
              className="h-4 w-4 accent-[#a8893f]"
            />
            Published
          </label>
        </section>

        {state.error && (
          <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {state.error}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-12 items-center justify-center gap-2 bg-ink text-xs font-semibold uppercase tracking-[0.16em] text-paper hover:bg-charcoal disabled:opacity-60"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {pending ? "Saving…" : post ? "Update post" : "Create post"}
          </button>
          <Link
            href="/admin/blog"
            className="inline-flex h-12 items-center justify-center border border-sand text-xs font-semibold uppercase tracking-[0.16em] text-ink/70 hover:border-ink"
          >
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}

const inputCls =
  "h-11 w-full border border-sand bg-paper px-3 text-sm text-ink outline-none focus:border-gold";
const areaCls =
  "w-full border border-sand bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-gold";

function Lbl({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-ink/55">
      {children}
    </span>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <Lbl>{label}</Lbl>
      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className={inputCls}
      />
    </label>
  );
}
