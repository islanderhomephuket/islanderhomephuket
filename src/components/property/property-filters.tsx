"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { AREAS, PROPERTY_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function PropertyFilters({
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

  const hasFilters = ["area", "propertyType", "bedrooms", "minPrice", "maxPrice", "q"].some(
    (k) => params.get(k),
  );

  const fields = (
    <>
      {/* Search */}
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-paper/40" />
        <input
          type="search"
          defaultValue={params.get("q") ?? ""}
          placeholder="Search by name, reference…"
          onChange={(e) => setParam({ q: e.target.value })}
          className="h-12 w-full border border-sand bg-ink pl-10 pr-3 text-sm text-paper outline-none placeholder:text-paper/30 focus:border-gold"
        />
      </div>

      {/* Area */}
      <Select
        value={params.get("area") ?? ""}
        onChange={(v) => setParam({ area: v })}
        ariaLabel="Area"
      >
        <option value="">All areas</option>
        {AREAS.map((a) => (
          <option key={a.slug} value={a.slug}>
            {a.name}
          </option>
        ))}
      </Select>

      {/* Type */}
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

      {/* Bedrooms */}
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

      {/* Price */}
      <PriceRangeFields
        listingType={listingType}
        minPrice={params.get("minPrice") ?? ""}
        maxPrice={params.get("maxPrice") ?? ""}
        onChange={setParam}
      />

      {/* Sort */}
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
          Filters{hasFilters ? " · Active" : ""}
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

/** Free-form min/max price, in baht (rent: per month, sale: total price). */
export function PriceRangeFields({
  listingType,
  minPrice,
  maxPrice,
  onChange,
}: {
  listingType: "sale" | "rent";
  minPrice: string;
  maxPrice: string;
  onChange: (updates: { minPrice?: string; maxPrice?: string }) => void;
}) {
  const suffix = listingType === "rent" ? "/mo" : "";
  return (
    <div className="flex items-center gap-2">
      <PriceInput
        placeholder={`Min${suffix}`}
        defaultValue={minPrice}
        ariaLabel="Minimum price"
        onChange={(v) => onChange({ minPrice: v })}
      />
      <span className="text-paper/30">–</span>
      <PriceInput
        placeholder={`Max${suffix}`}
        defaultValue={maxPrice}
        ariaLabel="Maximum price"
        onChange={(v) => onChange({ maxPrice: v })}
      />
    </div>
  );
}

function PriceInput({
  placeholder,
  defaultValue,
  ariaLabel,
  onChange,
}: {
  placeholder: string;
  defaultValue: string;
  ariaLabel: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-paper/40">
        ฿
      </span>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        step={1000}
        aria-label={ariaLabel}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-28 border border-sand bg-ink pl-6 pr-2 text-sm text-paper outline-none placeholder:text-paper/30 focus:border-gold sm:w-32"
      />
    </div>
  );
}

export function Select({
  value,
  onChange,
  children,
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  ariaLabel: string;
}) {
  return (
    <select
      aria-label={ariaLabel}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-12 min-w-[8rem] border border-sand bg-ink px-3 text-sm text-paper outline-none focus:border-gold"
    >
      {children}
    </select>
  );
}
