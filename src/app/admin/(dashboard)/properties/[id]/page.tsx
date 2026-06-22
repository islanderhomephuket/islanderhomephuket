import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { PropertyForm } from "@/components/admin/property-form";
import { getPropertyById } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getPropertyById(id);
  if (!property) notFound();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/admin/properties"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-gold-dark hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" /> Back to properties
        </Link>
        <Link
          href={`/properties/${property.slug}`}
          target="_blank"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink/60 hover:text-gold-dark"
        >
          View live <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
      <h1 className="mt-4 font-display text-3xl font-semibold text-ink">
        Edit property
      </h1>
      <p className="mt-1 text-sm text-ink/55">{property.title}</p>
      <div className="mt-8">
        <PropertyForm property={property} />
      </div>
    </div>
  );
}
