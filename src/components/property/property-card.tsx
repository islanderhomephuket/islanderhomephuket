import Link from "next/link";
import Image from "next/image";
import { BedDouble, Bath, Maximize, MapPin } from "lucide-react";
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
      className="hover-lift group flex flex-col overflow-hidden border border-charcoal-light bg-charcoal hover:border-gold/50"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={cover}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 flex gap-2">
          <Badge tone="dark">{badgeLabel}</Badge>
          {property.is_featured && <Badge tone="gold">Featured</Badge>}
        </div>
        {property.reference && (
          <span className="absolute right-4 top-4 rounded-full bg-ink/80 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold backdrop-blur">
            {property.reference}
          </span>
        )}
        {statusLabel && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/45">
            <span className="border border-paper/80 px-6 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-paper">
              {statusLabel}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-paper/50">
          <MapPin className="h-3.5 w-3.5 text-gold" />
          {area?.name ?? "Phuket"} · {property.property_type}
        </div>
        <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-paper transition-colors group-hover:text-gold">
          {property.title}
        </h3>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-paper/65">
          {property.bedrooms > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <BedDouble className="h-4 w-4 text-gold" />
              {property.bedrooms} Bed
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <Bath className="h-4 w-4 text-gold" />
              {property.bathrooms} Bath
            </span>
          )}
          {(property.living_area || property.land_area) && (
            <span className="inline-flex items-center gap-1.5">
              <Maximize className="h-4 w-4 text-gold" />
              {property.living_area ?? property.land_area} m²
            </span>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-6">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.18em] text-paper/40">
              {priceLabel}
            </p>
            <p className="font-display text-xl font-semibold text-paper">
              {priceMain}
            </p>
            {priceSub && (
              <p className="text-xs text-gold">or {priceSub}</p>
            )}
          </div>
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-gold transition-all group-hover:translate-x-1">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
