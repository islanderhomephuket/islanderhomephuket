import type { Property } from "@/lib/types";
import { PropertyCard } from "./property-card";
import { SearchX } from "lucide-react";
import { cn } from "@/lib/utils";

export function PropertyGrid({
  properties,
  emptyMessage = "No properties match your search. Try adjusting your filters.",
  sixUpBelowWide = false,
}: {
  properties: Property[];
  emptyMessage?: string;
  /**
   * For the fixed sets on the homepage, which are handed 8 cards.
   *
   * Eight fills two rows of four on a wide monitor but leaves 3 + 3 + 2 on a
   * laptop, and six fills 3 + 3 on a laptop but leaves 4 + 2 on the monitor.
   * So the last two are hidden until the grid is four across, and every
   * screen gets full rows. It is a CSS rule on the grid's own children — the
   * markup is identical either way, so the page stays static.
   */
  sixUpBelowWide?: boolean;
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
    // A fourth column only past 1920 px, where the container is 1728 px wide and
    // four cards still come out ~387 px each — wider than the three-up cards a
    // laptop shows. Below that the row stays at three.
    <div
      className={cn(
        "grid gap-7 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4",
        // PropertyCard's root is a flex column, so it is restored to flex.
        sixUpBelowWide &&
          "[&>*:nth-child(n+7)]:hidden 3xl:[&>*:nth-child(n+7)]:flex",
      )}
    >
      {properties.map((p) => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </div>
  );
}
