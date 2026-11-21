import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";

/**
 * Editorial "things to know before you buy here" section.
 *
 * Deliberately plain-spoken and non-promotional — it is the part of the page
 * that earns trust with a first-time overseas buyer. Nothing here quotes a tax
 * rate or a legal figure, because those change; each entry names the thing to
 * ask about instead and the footnote points at a lawyer.
 */
const NOTES = [
  {
    title: "What a foreigner can actually own",
    body: "A condominium unit can be held freehold in a foreign buyer's own name, within the share of a building that is allowed to be foreign-owned. Land is different — it cannot be owned outright by a foreigner, so villas are normally held on a registered long lease or through a Thai company. Which structure you use changes what you own, so it is the first question to settle, not the last.",
  },
  {
    title: "The island runs on two seasons",
    body: "High season is roughly November to April — dry, busy, and when rental rates and villa occupancy peak. The green season from May to October brings the southwest monsoon, quieter beaches and softer pricing. If you are buying to rent, your return is built almost entirely in those high-season months.",
  },
  {
    title: "East side, west side, south side",
    body: "The west coast — Bang Tao, Layan, Kamala — is the beach-and-resort side, and prices reflect it. The east, around Koh Kaew and Phuket Town, is where everyday life happens: schools, hospitals, marinas, the airport road. The south, Rawai and Nai Harn, is the long-stay expat belt. Same island, genuinely different lives.",
  },
  {
    title: "Families buy around schools and hospitals",
    body: "Phuket has several established international schools and private hospitals with English-speaking staff, clustered mostly on the east and central parts of the island. Most families end up choosing a home within a twenty to thirty minute drive of their school — worth mapping before you fall in love with a house on the far coast.",
  },
  {
    title: "The price is not the cost",
    body: "Budget beyond the headline figure: transfer fees and taxes at the land office, legal and due-diligence fees, and — in any managed development — ongoing common-area and management charges. Ask for the full annual cost of holding the property in writing before you commit.",
  },
  {
    title: "Rental yield is a seasonal number",
    body: "A villa's advertised yield usually assumes strong high-season occupancy and professional management. Take off the management share, the weeks you want to keep for yourself, and the maintenance a tropical climate demands, and the real figure moves. Ask to see actual booking history rather than a projection.",
  },
];

export function PhuketGuide() {
  return (
    <section className="bg-ink py-24 sm:py-32">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-20">
          {/* Left rail */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-paper/25" />
              <p className="kicker">Island knowledge</p>
            </div>
            <h2 className="display-caps mt-5 text-[2rem] text-paper sm:text-[2.6rem]">
              What people should
              <br />
              know about Phuket
            </h2>
            <p className="mt-6 text-base leading-relaxed text-paper/60">
              We would rather you arrive informed than excited. Six things that
              change how a purchase here actually works — the ones we end up
              explaining in almost every first conversation.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-paper transition-opacity hover:opacity-70"
            >
              Ask us anything
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Numbered notes */}
          <ol className="border-t border-paper/10">
            {NOTES.map((note, i) => (
              <li
                key={note.title}
                className="group grid gap-4 border-b border-paper/10 py-8 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-6"
              >
                <span className="font-display text-sm font-medium tabular-nums text-paper/35 transition-colors group-hover:text-paper/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-lg font-medium text-paper">
                    {note.title}
                  </h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-paper/60">
                    {note.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-10 max-w-3xl text-xs leading-relaxed text-paper/35 lg:ml-[calc(22rem+5rem)]">
          General guidance, not legal or tax advice. Rules and rates change —
          confirm your specific situation with a licensed Thai lawyer before you
          sign or transfer any money.
        </p>
      </Container>
    </section>
  );
}
