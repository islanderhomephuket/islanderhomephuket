import type { Property } from "@/lib/types";
import { PropertyCard } from "./property-card";
import { SearchX } from "lucide-react";

export function PropertyGrid({
  properties,
  emptyMessage = "No properties match your search. Try adjusting your filters.",
}: {
  properties: Property[];
  emptyMessage?: string;
}) {
  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center border border-dashed border-charcoal-light py-24 text-center">
        <SearchX className="h-10 w-10 text-gold" />
        <p className="mt-4 max-w-sm text-paper/60">{emptyMessage}</p>
      </div>
    );
  }
  return (
    <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((p) => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </div>
  );
}
