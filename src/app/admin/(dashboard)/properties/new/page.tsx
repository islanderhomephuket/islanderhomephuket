import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PropertyForm } from "@/components/admin/property-form";

export default function NewPropertyPage() {
  return (
    <div>
      <Link
        href="/admin/properties"
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-gold-dark hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Back to properties
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold text-ink">
        Add a property
      </h1>
      <p className="mt-1 text-sm text-ink/55">
        Create a new listing. Set status to <em>Draft</em> to hide it until
        ready.
      </p>
      <div className="mt-8">
        <PropertyForm />
      </div>
    </div>
  );
}
