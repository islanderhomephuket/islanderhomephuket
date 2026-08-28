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

  function search() {
    const params = new URLSearchParams();
    if (area) params.set("area", area);
    if (type) params.set("propertyType", type);
    const base = listing === "rent" ? "/rent" : "/buy";
    const qs = params.toString();
    router.push(qs ? `${base}?${qs}` : base);
  }

  const selectClass =
    "h-11 flex-1 rounded-full border border-paper/15 bg-transparent px-5 text-sm text-paper outline-none transition-colors focus:border-paper/60 [&>option]:bg-charcoal [&>option]:text-paper";

  return (
    <div className="glass w-full max-w-2xl rounded-[1.4rem] p-2.5">
      {/* Buy / Rent toggle */}
      <div className="flex w-fit rounded-full bg-paper/10 p-1">
        {(["sale", "rent"] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => setListing(opt)}
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

      <div className="mt-2.5 flex flex-col gap-2 sm:flex-row sm:items-center">
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
        <button
          onClick={search}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-paper px-7 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-ink transition-transform duration-300 hover:-translate-y-0.5"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
      </div>
    </div>
  );
}
