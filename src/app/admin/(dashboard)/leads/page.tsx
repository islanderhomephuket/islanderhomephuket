import { Mail, Phone, Inbox } from "lucide-react";
import { getLeads } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { updateLeadStatusAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const STATUSES = ["new", "contacted", "qualified", "closed"] as const;

const statusColor: Record<string, string> = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  contacted: "bg-amber-50 text-amber-700 border-amber-200",
  qualified: "bg-green-50 text-green-700 border-green-200",
  closed: "bg-zinc-100 text-zinc-600 border-zinc-200",
};

export default async function AdminLeadsPage() {
  const leads = await getLeads();

  return (
    <div>
      <header>
        <h1 className="font-display text-3xl font-semibold text-ink">Leads</h1>
        <p className="mt-1 text-sm text-ink/55">
          {leads.length} enquir{leads.length === 1 ? "y" : "ies"} ·{" "}
          {leads.filter((l) => l.status === "new").length} new
        </p>
      </header>

      {leads.length === 0 ? (
        <div className="mt-10 flex flex-col items-center border border-dashed border-sand py-24 text-center">
          <Inbox className="h-10 w-10 text-gold-dark" />
          <p className="mt-4 text-ink/55">No leads yet.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {leads.map((lead) => (
            <article key={lead.id} className="border border-sand bg-paper p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-display text-lg font-semibold text-ink">
                      {lead.name}
                    </h2>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.1em] capitalize ${statusColor[lead.status]}`}
                    >
                      {lead.status}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink/60">
                    <a
                      href={`mailto:${lead.email}`}
                      className="inline-flex items-center gap-1.5 hover:text-gold-dark"
                    >
                      <Mail className="h-3.5 w-3.5" /> {lead.email}
                    </a>
                    {lead.phone && (
                      <a
                        href={`tel:${lead.phone}`}
                        className="inline-flex items-center gap-1.5 hover:text-gold-dark"
                      >
                        <Phone className="h-3.5 w-3.5" /> {lead.phone}
                      </a>
                    )}
                  </div>
                </div>
                <div className="text-right text-xs text-ink/45">
                  <p>{formatDate(lead.created_at)}</p>
                  <p className="mt-1 capitalize">via {lead.source.replace(/-/g, " ")}</p>
                </div>
              </div>

              {lead.property_title && (
                <p className="mt-4 inline-block bg-cream px-3 py-1.5 text-xs text-ink/70">
                  Re: {lead.property_title}
                </p>
              )}
              {lead.message && (
                <p className="mt-3 text-sm leading-relaxed text-ink/75">
                  {lead.message}
                </p>
              )}

              <form
                action={updateLeadStatusAction}
                className="mt-5 flex items-center gap-2 border-t border-sand pt-4"
              >
                <input type="hidden" name="id" value={lead.id} />
                <label className="text-xs uppercase tracking-[0.12em] text-ink/45">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue={lead.status}
                  className="h-9 border border-sand bg-paper px-3 text-sm text-ink outline-none focus:border-gold"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s} className="capitalize">
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="h-9 bg-ink px-4 text-xs font-semibold uppercase tracking-[0.14em] text-paper hover:bg-charcoal"
                >
                  Update
                </button>
              </form>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
