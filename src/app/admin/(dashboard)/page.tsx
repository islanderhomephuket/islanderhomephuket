import Link from "next/link";
import {
  Building2,
  Tag,
  KeyRound,
  Inbox,
  Newspaper,
  Plus,
  ArrowRight,
} from "lucide-react";
import { getProperties, getLeads, getBlogPosts } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [properties, leads, posts] = await Promise.all([
    getProperties(),
    getLeads(),
    getBlogPosts({ includeUnpublished: true }),
  ]);

  const forSale = properties.filter((p) => p.listing_type === "sale").length;
  const forRent = properties.filter((p) => p.listing_type === "rent").length;
  const newLeads = leads.filter((l) => l.status === "new").length;

  const stats = [
    { label: "Total properties", value: properties.length, icon: Building2 },
    { label: "For sale", value: forSale, icon: Tag },
    { label: "For rent", value: forRent, icon: KeyRound },
    { label: "New leads", value: newLeads, icon: Inbox },
  ];

  return (
    <div>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-ink/55">
            Welcome back — here&apos;s your portfolio at a glance.
          </p>
        </div>
        <Link
          href="/admin/properties/new"
          className="inline-flex h-11 items-center gap-2 bg-ink px-5 text-xs font-semibold uppercase tracking-[0.16em] text-paper hover:bg-charcoal"
        >
          <Plus className="h-4 w-4" /> Add property
        </Link>
      </header>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="border border-sand bg-paper p-6">
              <div className="flex items-center justify-between">
                <Icon className="h-6 w-6 text-gold-dark" />
                <span className="font-display text-3xl font-semibold text-ink">
                  {s.value}
                </span>
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.14em] text-ink/50">
                {s.label}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Recent leads */}
        <section className="border border-sand bg-paper">
          <div className="flex items-center justify-between border-b border-sand px-6 py-4">
            <h2 className="font-display text-lg font-semibold text-ink">
              Recent leads
            </h2>
            <Link
              href="/admin/leads"
              className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-gold-dark hover:text-ink"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <ul className="divide-y divide-sand">
            {leads.slice(0, 5).map((l) => (
              <li key={l.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-ink">{l.name}</p>
                  <p className="text-xs text-ink/50">
                    {l.property_title ?? "General enquiry"} · {formatDate(l.created_at)}
                  </p>
                </div>
                <span className="rounded-full bg-sand px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-ink/60 capitalize">
                  {l.status}
                </span>
              </li>
            ))}
            {leads.length === 0 && (
              <li className="px-6 py-8 text-center text-sm text-ink/50">
                No leads yet.
              </li>
            )}
          </ul>
        </section>

        {/* Quick links */}
        <section className="border border-sand bg-paper">
          <div className="border-b border-sand px-6 py-4">
            <h2 className="font-display text-lg font-semibold text-ink">
              Manage
            </h2>
          </div>
          <div className="grid gap-px bg-sand sm:grid-cols-2">
            <QuickLink
              href="/admin/properties"
              icon={Building2}
              title="Properties"
              desc={`${properties.length} listed`}
            />
            <QuickLink
              href="/admin/leads"
              icon={Inbox}
              title="Leads"
              desc={`${newLeads} new`}
            />
            <QuickLink
              href="/admin/blog"
              icon={Newspaper}
              title="Journal"
              desc={`${posts.length} posts`}
            />
            <QuickLink
              href="/admin/properties/new"
              icon={Plus}
              title="New property"
              desc="Create a listing"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  title,
  desc,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 bg-paper p-6 transition-colors hover:bg-cream"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold-dark group-hover:bg-gold group-hover:text-ink">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="text-xs text-ink/50">{desc}</p>
      </div>
    </Link>
  );
}
