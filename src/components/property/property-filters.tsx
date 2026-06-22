"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { AREAS, PROPERTY_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const PRICE_BANDS_SALE = [
  { label: "Any price", min: "", max: "" },
  { label: "Up to ฿10M", min: "", max: "10000000" },
  { label: "฿10M – ฿20M", min: "10000000", max: "20000000" },
  { label: "฿20M – ฿40M", min: "20000000", max: "40000000" },
  { label: "฿40M+", min: "40000000", max: "" },
];
const PRICE_BANDS_RENT = [
  { label: "Any price", min: "", max: "" },
  { label: "Up to ฿40k/mo", min: "", max: "40000" },
  { label: "฿40k – ฿80k/mo", min: "40000", max: "80000" },
  { label: "฿80k – ฿150k/mo", min: "80000", max: "150000" },
  { label: "฿150k+/mo", min: "150000", max: "" },
];

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

  const bands = listingType === "rent" ? PRICE_BANDS_RENT : PRICE_BANDS_SALE;

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

  const currentBand = `${params.get("minPrice") ?? ""}|${params.get("maxPrice") ?? ""}`;
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
      <Select
        value={currentBand}
        onChange={(v) => {
          const [min, max] = v.split("|");
          setParam({ minPrice: min, maxPrice: max });
        }}
        ariaLabel="Price"
      >
        {bands.map((b) => (
          <option key={b.label} value={`${b.min}|${b.max}`}>
            {b.label}
          </option>
        ))}
      </Select>

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

function Select({
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
