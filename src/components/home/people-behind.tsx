import Image from "next/image";
import { Container } from "@/components/ui/container";

/**
 * Who is behind the agency — a statement on the left, the person on the right.
 *
 * The user asked for this shape after seeing it on another Phuket agency's
 * site, with one change: the portrait stays smaller than theirs. It is capped
 * at 260 px, which is also as far as the source goes — the photograph is cut
 * from the white studio disc on her business card, 135 x 169 px of real
 * detail, so anything larger starts to soften. A higher-resolution original
 * would lift that cap.
 *
 * Monochrome, like the rest of the site: the reference used a gold rule under
 * each name, and gold was deliberately taken out of this design in August.
 */
export function PeopleBehind() {
  return (
    <section className="bg-charcoal py-24 sm:py-32">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:items-start lg:gap-20">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-paper/25" />
              <p className="kicker">The person behind Islander Home</p>
            </div>
            <h2 className="display-caps mt-5 text-[2rem] leading-[1.1] text-paper sm:text-[2.6rem]">
              Local knowledge.
              <br />
              Personal service.
              <br />
              A better way to find
              <br />
              property in Phuket.
            </h2>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-paper/60">
              Islander Home Phuket is run from the island, for the people
              moving to it. Whether you are buying, renting for a year or
              letting a home you already own, you are dealing with someone who
              lives here and knows what each street is actually like — not a
              listing feed and not an office abroad.
            </p>
          </div>

          <figure>
            <Image
              src="/team/thanya-wigg-portrait.webp"
              alt="Thanawadee (Thanya) Wigg, Phuket property consultant at Islander Home Phuket"
              width={360}
              height={450}
              sizes="260px"
              className="w-full max-w-[260px] rounded-2xl object-cover"
            />
            <figcaption className="mt-6 max-w-[260px]">
              <p className="font-display text-lg font-semibold leading-snug text-paper">
                Thanawadee (Thanya) Wigg
              </p>
              <span className="mt-3 block h-px w-10 bg-paper/30" />
              {/* Not the `kicker` class: its 0.26em tracking takes this title
                  to 265 px against a 260 px column, and a plain class beats the
                  Tailwind tracking utility, so it broke onto a second line.
                  Same look, set in utilities, at a tracking that fits. */}
              <p className="mt-3 text-[0.66rem] font-medium uppercase tracking-[0.15em] text-paper/55">
                Phuket Property Consultant
              </p>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-paper/70">
                Thanya works with buyers, long-term renters and owners across
                the island — from the first search and viewing through to the
                contract and the keys.
              </p>
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}
