import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { AreaInfo } from "@/lib/constants";

/**
 * A text-only zone link — no photo. Used on /rent, /buy, /areas and the
 * homepage (the user asked for text only everywhere, 2026-09-25). A
 * photo-per-zone grid (the AreaCard on /areas) read as too busy; this
 * keeps the same information (name, live count, link) without the image.
 */
export function ZoneCard({
  area,
  count,
  href,
}: {
  area: AreaInfo;
  count: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-4 rounded-2xl border border-paper/10 bg-paper/[0.03] px-7 py-6 transition-colors duration-300 hover:border-paper/30 hover:bg-paper/[0.06]"
    >
      <div>
        <h3 className="display-caps text-xl text-paper sm:text-2xl">
          {area.name}
        </h3>
        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-paper/50">
          {count} {count === 1 ? "Listing" : "Listings"}
        </p>
      </div>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-paper/25 text-paper transition-all duration-300 group-hover:border-paper group-hover:bg-paper group-hover:text-ink">
        <ArrowUpRight className="h-5 w-5" />
      </span>
    </Link>
  );
}
