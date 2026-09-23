"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { PROPERTY_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { PriceRangeFields, Select } from "./property-filters";

/**
 * Price / bedrooms / type / sort for a single area's listing page
 * (`/rent/<area>`, `/buy/<area>`). No area picker here — the area is fixed
 * by the route, unlike the island-wide `PropertyFilters` this is styled after.
 */
export function AreaPropertyFilters({
  listingType,
}: {
  listingType: "sale" | "rent";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [openMobile, setOpenMobile] = useState(false);

  const setParam = useCallback(
    (updates: Record<string, string>) => {
      const next = new URLSearchParams(params.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v) next.set(k, v);
        else next.delete(k);
      });
      startTransition(() => {
        router.replace(`${pathname}?${next.toString()}`, { scroll: false });
      });
    },
    [params, pathname, router],
  );

  const hasFilters = ["propertyType", "bedrooms", "minPrice", "maxPrice"].some((k) =>
    params.get(k),
  );

  const fields = (
    <>
      <Select
        value={params.get("propertyType") ?? ""}
        onChange={(v) => setParam({ propertyType: v })}
        ariaLabel="Property type"
      >
        <option value="">All types</option>
        {PROPERTY_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </Select>

      <Select
        value={params.get("bedrooms") ?? ""}
        onChange={(v) => setParam({ bedrooms: v })}
        ariaLabel="Bedrooms"
      >
        <option value="">Beds</option>
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={String(n)}>
            {n}+ Beds
          </option>
        ))}
      </Select>

      <PriceRangeFields
        listingType={listingType}
        minPrice={params.get("minPrice") ?? ""}
        maxPrice={params.get("maxPrice") ?? ""}
        onChange={setParam}
      />

      <Select
        value={params.get("sort") ?? "newest"}
        onChange={(v) => setParam({ sort: v === "newest" ? "" : v })}
        ariaLabel="Sort"
      >
        <option value="newest">Newest</option>
        <option value="price-asc">Price ↑</option>
        <option value="price-desc">Price ↓</option>
      </Select>
    </>
  );

  return (
    <div className={cn("relative", isPending && "opacity-70")}>
      {/* Desktop */}
      <div className="hidden flex-wrap items-center gap-3 border border-sand bg-charcoal p-4 lg:flex">
        {fields}
        {hasFilters && (
          <button
            onClick={() => router.replace(pathname, { scroll: false })}
            className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.14em] text-gold-dark hover:text-paper"
          >
            <X className="h-3.5 w-3.5" /> Clear
          </button>
        )}
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <button
          onClick={() => setOpenMobile((v) => !v)}
          className="inline-flex h-12 w-full items-center justify-center gap-2 border border-ink bg-ink text-sm font-semibold uppercase tracking-[0.16em] text-paper"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filter &amp; Sort{hasFilters ? " · Active" : ""}
        </button>
        {openMobile && (
          <div className="mt-3 flex flex-col gap-3 border border-sand bg-charcoal p-4">
            {fields}
            {hasFilters && (
              <button
                onClick={() => router.replace(pathname, { scroll: false })}
                className="inline-flex items-center justify-center gap-1.5 py-2 text-xs font-medium uppercase tracking-[0.14em] text-gold-dark"
              >
                <X className="h-3.5 w-3.5" /> Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
