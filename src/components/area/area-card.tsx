import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { AreaInfo } from "@/lib/constants";

export function AreaCard({
  area,
  count,
}: {
  area: AreaInfo;
  count?: number;
}) {
  // Areas with a marketing poster show the full artwork (it already carries its
  // own title & info), centered on the brand-dark background so the 9:16 poster
  // sits cleanly inside the 3/4 card frame without cropping.
  if (area.poster) {
    return (
      <Link
        href={`/areas/${area.slug}`}
        className="group relative block aspect-[3/4] overflow-hidden border border-sand/40 bg-ink transition-colors hover:border-gold/60"
        aria-label={`${area.name} — ${area.tagline}`}
      >
        <Image
          src={area.poster}
          alt={`${area.name}, Phuket — ${area.tagline}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
        />
      </Link>
    );
  }

  return (
    <Link
      href={`/areas/${area.slug}`}
      className="group relative block aspect-[3/4] overflow-hidden"
    >
      <Image
        src={area.image}
        alt={area.name}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <div className="flex items-end justify-between">
          <div>
            {count != null && count > 0 && (
              <p className="kicker text-gold-light">
                {count} {count === 1 ? "Listing" : "Listings"}
              </p>
            )}
            <h3 className="mt-2 font-display text-2xl font-semibold text-paper">
              {area.name}
            </h3>
            <p className="mt-1 text-sm text-paper/70">{area.tagline}</p>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-paper/40 text-paper transition-all group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
            <ArrowUpRight className="h-5 w-5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
