import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Star } from "lucide-react";
import { getProperties } from "@/lib/data";
import { AREAS } from "@/lib/constants";
import { formatRent, formatTHB } from "@/lib/utils";
import { deletePropertyAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminPropertiesPage() {
  const properties = await getProperties();

  return (
    <div>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Properties
          </h1>
          <p className="mt-1 text-sm text-ink/55">
            {properties.length} listing{properties.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/admin/properties/new"
          className="inline-flex h-11 items-center gap-2 bg-ink px-5 text-xs font-semibold uppercase tracking-[0.16em] text-paper hover:bg-charcoal"
        >
          <Plus className="h-4 w-4" /> Add property
        </Link>
      </header>

      <div className="mt-8 overflow-hidden border border-sand bg-paper">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-sand bg-cream/60 text-xs uppercase tracking-[0.12em] text-ink/50">
            <tr>
              <th className="px-4 py-3 font-medium">Property</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Area</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">Type</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand">
            {properties.map((p) => {
              const area = AREAS.find((a) => a.slug === p.area_slug);
              const price =
                p.listing_type === "rent"
                  ? formatRent(p.price, p.rent_period)
                  : formatTHB(p.price);
              return (
                <tr key={p.id} className="hover:bg-cream/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-16 shrink-0 overflow-hidden bg-sand">
                        <Image
                          src={p.cover_image ?? "/properties/villa-1.png"}
                          alt={p.title}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="flex items-center gap-1.5 truncate font-medium text-ink">
                          {p.is_featured && (
                            <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                          )}
                          {p.title}
                        </p>
                        <p className="text-xs text-ink/45">
                          {p.reference ?? p.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-ink/70 md:table-cell">
                    {area?.name ?? "—"}
                  </td>
                  <td className="hidden px-4 py-3 text-ink/70 sm:table-cell">
                    {p.property_type}
                  </td>
                  <td className="px-4 py-3 font-medium text-ink">{price}</td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className="rounded-full bg-sand px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-ink/60 capitalize">
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/properties/${p.id}`}
                        className="inline-flex h-9 items-center gap-1.5 border border-sand px-3 text-xs font-medium text-ink/70 hover:border-ink"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Link>
                      <form action={deletePropertyAction}>
                        <input type="hidden" name="id" value={p.id} />
                        <DeleteButton />
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DeleteButton() {
  return (
    <button
      type="submit"
      className="inline-flex h-9 items-center gap-1.5 border border-red-200 px-3 text-xs font-medium text-red-600 hover:bg-red-50"
    >
      Delete
    </button>
  );
}
