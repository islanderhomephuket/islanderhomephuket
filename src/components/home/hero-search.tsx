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

  return (
    <div className="w-full max-w-3xl">
      {/* Buy / Rent toggle */}
      <div className="mb-[-1px] flex w-fit">
        {(["sale", "rent"] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => setListing(opt)}
            className={`px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition-colors ${
              listing === opt
                ? "bg-paper text-ink"
                : "bg-ink/40 text-paper/80 backdrop-blur hover:bg-ink/60"
            }`}
          >
            {opt === "sale" ? "Buy" : "Rent"}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 bg-paper p-4 shadow-luxe sm:flex-row sm:items-center">
        <select
          aria-label="Area"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="h-12 flex-1 border border-sand bg-paper px-4 text-sm text-ink outline-none focus:border-ink"
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
          className="h-12 flex-1 border border-sand bg-paper px-4 text-sm text-ink outline-none focus:border-ink"
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
          className="inline-flex h-12 items-center justify-center gap-2 bg-ink px-8 text-xs font-semibold uppercase tracking-[0.18em] text-paper transition-colors hover:bg-ink/80"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
      </div>
    </div>
  );
}
