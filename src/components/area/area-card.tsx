import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { AreaInfo } from "@/lib/constants";

/**
 * A plain photo card: one image, the area name, the listing count.
 *
 * `image` lets the caller hand in a real photo from a listing in that area —
 * preferred over the static fallback, since it keeps the grid showing current
 * inventory. The old marketing posters are no longer used here.
 */
export function AreaCard({
  area,
  count,
  image,
}: {
  area: AreaInfo;
  count?: number;
  image?: string;
}) {
  return (
    <Link
      href={`/areas/${area.slug}`}
      className="group relative block aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-paper/10 transition-colors duration-500 hover:border-paper/30"
      aria-label={`${area.name} — ${area.tagline}`}
    >
      <Image
        src={image ?? area.image}
        alt={`${area.name}, Phuket`}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

      <div className="absolute inset-x-0 bottom-0 p-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            {count != null && count > 0 && (
              <p className="text-[0.62rem] uppercase tracking-[0.22em] text-paper/60">
                {count} {count === 1 ? "Listing" : "Listings"}
              </p>
            )}
            <h3 className="display-caps mt-2 text-2xl text-paper">
              {area.name}
            </h3>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-paper/35 text-paper transition-all duration-300 group-hover:border-paper group-hover:bg-paper group-hover:text-ink">
            <ArrowUpRight className="h-5 w-5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
