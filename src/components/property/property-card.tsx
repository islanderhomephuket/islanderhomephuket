import Link from "next/link";
import Image from "next/image";
import { BedDouble, Bath, Maximize, ArrowUpRight } from "lucide-react";
import type { Property } from "@/lib/types";
import { AREAS } from "@/lib/constants";
import { formatRent, formatTHB } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function PropertyCard({ property }: { property: Property }) {
  const area = AREAS.find((a) => a.slug === property.area_slug);
  const isBoth = property.listing_type === "both";
  const isRent = property.listing_type === "rent";
  const rentStr = formatRent(
    isBoth ? property.rent_price : property.price,
    property.rent_period,
  );
  const priceMain = isRent ? rentStr : formatTHB(property.price);
  const priceSub = isBoth ? rentStr : null;
  const priceLabel = isRent ? "Rent" : isBoth ? "Sale / Rent" : "Price";
  const badgeLabel = isRent ? "For Rent" : isBoth ? "Sale / Rent" : "For Sale";
  const cover = property.cover_image ?? "/properties/villa-1.png";
  const statusLabel =
    property.status === "reserved"
      ? "Reserved"
      : property.status === "sold"
        ? "Sold"
        : property.status === "rented"
          ? "Rented"
          : null;

  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group flex flex-col overflow-hidden rounded-[1.5rem] border border-paper/10 bg-charcoal transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-paper/25"
    >
      <div className="relative m-2 aspect-[4/3] overflow-hidden rounded-[1.1rem]">
        <Image
          src={cover}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        />
        {/* Keeps the badges readable over bright photography */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/45 to-transparent" />

        <div className="absolute left-3.5 top-3.5 flex gap-2">
          <Badge tone="dark">{badgeLabel}</Badge>
          {property.is_featured && <Badge tone="gold">Featured</Badge>}
        </div>
        {property.reference && (
          <span className="absolute right-3.5 top-3.5 rounded-full border border-paper/20 bg-black/55 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-paper backdrop-blur-md">
            {property.reference}
          </span>
        )}
        {statusLabel && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/55">
            <span className="rounded-full border border-paper/80 px-6 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-paper">
              {statusLabel}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-6 pb-6 pt-3">
        <div className="text-[0.66rem] uppercase tracking-[0.22em] text-paper/45">
          {area?.name ?? "Phuket"} · {property.property_type}
        </div>
        <h3 className="mt-2.5 font-display text-lg font-medium leading-snug text-paper">
          {property.title}
        </h3>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-paper/55">
          {property.bedrooms > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <BedDouble className="h-4 w-4 text-paper/40" />
              {property.bedrooms} Bed
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <Bath className="h-4 w-4 text-paper/40" />
              {property.bathrooms} Bath
            </span>
          )}
          {(property.living_area || property.land_area) && (
            <span className="inline-flex items-center gap-1.5">
              <Maximize className="h-4 w-4 text-paper/40" />
              {property.living_area ?? property.land_area} m²
            </span>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-paper/10 pt-5 mt-6">
          <div>
            <p className="text-[0.62rem] uppercase tracking-[0.2em] text-paper/40">
              {priceLabel}
            </p>
            <p className="mt-1 font-display text-xl font-medium text-paper">
              {priceMain}
            </p>
            {priceSub && (
              <p className="text-xs text-paper/55">or {priceSub}</p>
            )}
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-paper/25 text-paper transition-colors duration-300 group-hover:border-paper group-hover:bg-paper group-hover:text-ink">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
