"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2, Save } from "lucide-react";
import { savePropertyAction } from "@/app/admin/actions";
import { AREAS, PROPERTY_TYPES } from "@/lib/constants";
import type { Property } from "@/lib/types";

export function PropertyForm({ property }: { property?: Property }) {
  const [state, action, pending] = useActionState(savePropertyAction, {});
  const p = property;

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-3">
      {p && <input type="hidden" name="id" value={p.id} />}

      {/* Main column */}
      <div className="space-y-6 lg:col-span-2">
        <Card title="Basics">
          <Text name="title" label="Title" defaultValue={p?.title} required />
          <div className="grid gap-4 sm:grid-cols-2">
            <Text
              name="slug"
              label="Slug (auto if blank)"
              defaultValue={p?.slug}
              placeholder="sunset-ridge-villa"
            />
            <Text
              name="reference"
              label="Reference"
              defaultValue={p?.reference ?? ""}
              placeholder="IHP-V001"
            />
          </div>
          <Area name="description" label="Description" defaultValue={p?.description} rows={6} />
        </Card>

        <Card title="Specifications">
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              name="property_type"
              label="Property type"
              defaultValue={p?.property_type ?? "Villa"}
              options={PROPERTY_TYPES.map((t) => ({ value: t, label: t }))}
            />
            <Select
              name="area_slug"
              label="Area"
              defaultValue={p?.area_slug ?? AREAS[0].slug}
              options={AREAS.map((a) => ({ value: a.slug, label: a.name }))}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-4">
            <Num name="bedrooms" label="Beds" defaultValue={p?.bedrooms ?? 0} />
            <Num name="bathrooms" label="Baths" defaultValue={p?.bathrooms ?? 0} />
            <Num name="living_area" label="Living m²" defaultValue={p?.living_area ?? ""} />
            <Num name="land_area" label="Land m²" defaultValue={p?.land_area ?? ""} />
          </div>
          <Area
            name="features"
            label="Features (one per line, or comma-separated)"
            defaultValue={p?.features?.join("\n") ?? ""}
            rows={4}
            placeholder={"Infinity pool\nSea view\nSmart home"}
          />
        </Card>

        <Card title="Media">
          <Area
            name="images"
            label="Image URLs (one per line — first is the cover)"
            defaultValue={p?.images?.map((i) => i.url).join("\n") ?? ""}
            rows={5}
            placeholder={"/properties/villa-1.png\nhttps://…/photo.jpg"}
          />
        </Card>

        <Card title="Location">
          <Text name="address" label="Address" defaultValue={p?.address ?? ""} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Text name="latitude" label="Latitude" defaultValue={p?.latitude ?? ""} />
            <Text name="longitude" label="Longitude" defaultValue={p?.longitude ?? ""} />
          </div>
        </Card>
      </div>

      {/* Side column */}
      <div className="space-y-6">
        <Card title="Listing">
          <Select
            name="listing_type"
            label="Listing type"
            defaultValue={p?.listing_type ?? "sale"}
            options={[
              { value: "sale", label: "For Sale" },
              { value: "rent", label: "For Rent" },
            ]}
          />
          <Select
            name="status"
            label="Status"
            defaultValue={p?.status ?? "available"}
            options={[
              { value: "available", label: "Available" },
              { value: "reserved", label: "Reserved" },
              { value: "sold", label: "Sold" },
              { value: "rented", label: "Rented" },
              { value: "draft", label: "Draft (hidden)" },
            ]}
          />
          <Num name="price" label="Price (THB)" defaultValue={p?.price ?? ""} />
          <Select
            name="rent_period"
            label="Rent period (rentals)"
            defaultValue={p?.rent_period ?? "month"}
            options={[
              { value: "month", label: "per month" },
              { value: "year", label: "per year" },
              { value: "day", label: "per day" },
            ]}
          />
          <label className="flex items-center gap-3 pt-2 text-sm text-ink/75">
            <input
              type="checkbox"
              name="is_featured"
              defaultChecked={p?.is_featured}
              className="h-4 w-4 accent-[#a8893f]"
            />
            Featured on homepage
          </label>
        </Card>

        {state.error && (
          <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {state.error}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-12 items-center justify-center gap-2 bg-ink text-xs font-semibold uppercase tracking-[0.16em] text-paper hover:bg-charcoal disabled:opacity-60"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {pending ? "Saving…" : p ? "Update property" : "Create property"}
          </button>
          <Link
            href="/admin/properties"
            className="inline-flex h-12 items-center justify-center border border-sand text-xs font-semibold uppercase tracking-[0.16em] text-ink/70 hover:border-ink"
          >
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}

/* ─── field helpers ─── */

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-sand bg-paper p-6">
      <h2 className="mb-4 font-display text-lg font-semibold text-ink">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

const inputCls =
  "h-11 w-full border border-sand bg-paper px-3 text-sm text-ink outline-none focus:border-gold";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-ink/55">
      {children}
    </span>
  );
}

function Text({
  name,
  label,
  defaultValue,
  placeholder,
  required,
}: {
  name: string;
  label: string;
  defaultValue?: string | number;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className={inputCls}
      />
    </label>
  );
}

function Num({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: string | number;
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <input
        type="number"
        step="any"
        name={name}
        defaultValue={defaultValue}
        className={inputCls}
      />
    </label>
  );
}

function Area({
  name,
  label,
  defaultValue,
  rows = 4,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full border border-sand bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-gold"
      />
    </label>
  );
}

function Select({
  name,
  label,
  defaultValue,
  options,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <select name={name} defaultValue={defaultValue} className={inputCls}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
