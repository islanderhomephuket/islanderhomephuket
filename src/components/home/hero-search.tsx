"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { AREAS, PROPERTY_TYPES } from "@/lib/constants";

export function HeroSearch() {
  const router = useRouter();
  const [listing, setListing] = useState<"sale" | "rent">("sale");
  const [area, setArea] = useState("");
  const [type, setType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  function search() {
    const params = new URLSearchParams();
    if (area) params.set("area", area);
    if (type) params.set("propertyType", type);

    // Hand-typed, so keep only sane numbers, and turn an inverted range the
    // right way round instead of sending the visitor to an empty page.
    let min = Number(minPrice) > 0 ? Number(minPrice) : null;
    let max = Number(maxPrice) > 0 ? Number(maxPrice) : null;
    if (min !== null && max !== null && min > max) [min, max] = [max, min];
    if (min !== null) params.set("minPrice", String(min));
    if (max !== null) params.set("maxPrice", String(max));

    const base = listing === "rent" ? "/rent" : "/buy";
    const qs = params.toString();
    router.push(qs ? `${base}?${qs}` : base);
  }

  const selectClass =
    "h-11 min-w-[7rem] flex-1 rounded-full border border-paper/15 bg-transparent px-4 text-sm text-paper outline-none transition-colors focus:border-paper/60 [&>option]:bg-charcoal [&>option]:text-paper";

  // Rent is quoted per month, sale is the asking price.
  const suffix = listing === "rent" ? " /mo" : "";

  return (
    <div className="glass w-full max-w-3xl rounded-[1.4rem] p-2.5">
      {/* Buy / Rent toggle */}
      <div className="flex w-fit rounded-full bg-paper/10 p-1">
        {(["sale", "rent"] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => {
              setListing(opt);
              // A monthly rent and an asking price are not interchangeable.
              setMinPrice("");
              setMaxPrice("");
            }}
            className={`rounded-full px-6 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] transition-colors ${
              listing === opt
                ? "bg-paper text-ink"
                : "text-paper/70 hover:text-paper"
            }`}
          >
            {opt === "sale" ? "Buy" : "Rent"}
          </button>
        ))}
      </div>

      <div className="mt-2.5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <select
          aria-label="Area"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className={selectClass}
        >
          <option value="">All areas</option>
          {AREAS.map((a) => (
            <option key={a.slug} value={a.slug}>
              {a.name}
            </option>
          ))}
        </select>
        <select
          aria-label="Property type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={selectClass}
        >
          <option value="">All types</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <div className="flex shrink-0 items-center gap-2">
          <PriceInput
            ariaLabel="Minimum price"
            placeholder={`Min${suffix}`}
            value={minPrice}
            onChange={setMinPrice}
            onEnter={search}
          />
          <span className="text-paper/30">–</span>
          <PriceInput
            ariaLabel="Maximum price"
            placeholder={`Max${suffix}`}
            value={maxPrice}
            onChange={setMaxPrice}
            onEnter={search}
          />
        </div>
        <button
          onClick={search}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-paper px-6 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-ink transition-transform duration-300 hover:-translate-y-0.5"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
      </div>
    </div>
  );
}

function PriceInput({
  ariaLabel,
  placeholder,
  value,
  onChange,
  onEnter,
}: {
  ariaLabel: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onEnter: () => void;
}) {
  return (
    <div className="relative flex-1">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-paper/40">
        ฿
      </span>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        step={1000}
        aria-label={ariaLabel}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onEnter();
        }}
        className="h-11 w-full rounded-full border border-paper/15 bg-transparent pl-7 pr-3 text-sm text-paper outline-none transition-colors placeholder:text-paper/40 focus:border-paper/60 [appearance:textfield] sm:w-[6.5rem] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
    </div>
  );
}
