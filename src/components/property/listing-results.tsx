"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import type { AreaInfo } from "@/lib/constants";
import type { Property } from "@/lib/types";
import {
  applyListingFilters,
  isFiltering,
  parseListingFilters,
} from "@/lib/listing-filters";
import { PropertyGrid } from "./property-grid";
import { ZoneCard } from "./zone-card";

export type ZoneSummary = { area: AreaInfo; count: number; href: string };

/**
 * Results for the island-wide /rent and /buy pages. Unfiltered it shows the zone
 * cards (browsing starts by zone); the moment a filter is set it shows the
 * matching listings as a flat grid. Filtering happens here, in the browser, so
 * the page itself can be served from the static cache.
 */
export function IslandResults({
  properties,
  zones,
  listingType,
}: {
  properties: Property[];
  zones: ZoneSummary[];
  listingType: "sale" | "rent";
}) {
  const params = useSearchParams();
  const filters = useMemo(() => parseListingFilters(new URLSearchParams(params.toString())), [params]);
  const searching = isFiltering(filters);
  const results = useMemo(
    () => (searching ? applyListingFilters(properties, filters, listingType) : properties),
    [searching, properties, filters, listingType],
  );
  return searching ? (
    <>
      <ResultCount count={results.length} label="found" />
      <div className="mt-6">
        <PropertyGrid properties={results} />
      </div>
    </>
  ) : (
    <ZoneGrid
      zones={zones}
      total={properties.length}
      verb={listingType === "rent" ? "for rent" : "for sale"}
    />
  );
}

/** The unfiltered view — also the server-rendered fallback, so crawlers see it. */
export function ZoneGrid({
  zones,
  total,
  verb,
}: {
  zones: ZoneSummary[];
  total: number;
  verb: string;
}) {
  return (
    <>
      <ResultCount count={total} label={`${verb} across ${zones.length} areas`} />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {zones.map((z) => (
          <ZoneCard key={z.area.slug} area={z.area} count={z.count} href={z.href} />
        ))}
      </div>
    </>
  );
}

/** Results for one area's page (/rent/<area>, /buy/<area>), filtered in the browser. */
export function AreaResults({
  properties,
  listingType,
  areaName,
  verb,
}: {
  properties: Property[];
  listingType: "sale" | "rent";
  areaName: string;
  verb: string;
}) {
  const params = useSearchParams();
  const filters = useMemo(() => {
    const f = parseListingFilters(new URLSearchParams(params.toString()));
    return { ...f, area: undefined, query: undefined };
  }, [params]);
  const searching = isFiltering(filters);
  const results = useMemo(
    () => (searching ? applyListingFilters(properties, filters, listingType) : properties),
    [searching, properties, filters, listingType],
  );
  return (
    <AreaGrid
      properties={results}
      total={properties.length}
      searching={searching}
      areaName={areaName}
      verb={verb}
    />
  );
}

export function AreaGrid({
  properties,
  total,
  searching,
  areaName,
  verb,
}: {
  properties: Property[];
  total: number;
  searching: boolean;
  areaName: string;
  verb: string;
}) {
  return (
    <>
      {total > 0 && (
        <ResultCount count={properties.length} label={searching ? "found" : verb} spaced />
      )}
      <div className="mt-6">
        <PropertyGrid
          properties={properties}
          emptyMessage={
            searching
              ? `No ${areaName} listings match those filters. Try widening your search, or clear the filters above.`
              : `No ${areaName} listings ${verb} at the moment. Browse the other areas below, or send us your requirements.`
          }
        />
      </div>
    </>
  );
}

function ResultCount({ count, label, spaced }: { count: number; label: string; spaced?: boolean }) {
  return (
    <p className={`${spaced ? "mt-6" : "mt-8"} text-sm text-paper/60`}>
      <span className="font-semibold text-paper">{count}</span>{" "}
      {count === 1 ? "property" : "properties"} {label}
    </p>
  );
}
