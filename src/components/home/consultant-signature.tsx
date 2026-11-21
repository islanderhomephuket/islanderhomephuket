import Image from "next/image";

/**
 * The person behind the island-knowledge section.
 *
 * It began under the WhatsApp button in the CTA band at 72–80 px, which the
 * user found too small to read as anything. It sits here instead, in the left
 * rail of "What people should know about Phuket", where it is doing real work:
 * the six notes beside it are opinions about buying here, and this says whose
 * they are.
 *
 * Still a signature rather than a profile card — a hairline, a portrait and two
 * lines, no border, no box. The portrait is a 224 px circular cut of the studio
 * shot from the business card, shown at 96–112 px, so it stays sharp on a
 * retina screen and costs 5.6 KB.
 */
export function ConsultantSignature() {
  return (
    <figure className="mt-10 border-t border-paper/15 pt-8">
      {/* Stacked, not side by side: this rail is 352 px wide, and beside a
          portrait "Phuket Property Consultant" broke across two lines. Stacking
          gives the title its own line and the portrait more room. */}
      <Image
        src="/team/thanya-wigg.webp"
        alt="Thanawadee (Thanya) Wigg, Phuket property consultant at Islander Home Phuket"
        width={224}
        height={224}
        sizes="128px"
        className="h-28 w-28 rounded-full object-cover sm:h-32 sm:w-32"
      />
      <figcaption className="mt-5">
        <p className="font-display text-xl font-semibold leading-snug tracking-[0.01em] text-paper">
          Thanawadee (Thanya) Wigg
        </p>
        <p className="kicker mt-2 text-[0.68rem] text-paper/55">
          Phuket Property Consultant
        </p>
      </figcaption>
      <p className="mt-4 text-[0.95rem] leading-relaxed text-paper/70">
        Local insight, personal service, and a better way to find property in
        Phuket.
      </p>
    </figure>
  );
}
