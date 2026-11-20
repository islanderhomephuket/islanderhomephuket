import Image from "next/image";
import { CONTACT } from "@/lib/constants";
import { WhatsAppIcon, LineIcon } from "@/components/brand/contact-icons";
import { ButtonLink } from "@/components/ui/button";
import { SITE_WIDTH } from "@/components/ui/container";
import { cn } from "@/lib/utils";

/**
 * A signature rather than a profile card: the person the WhatsApp button
 * actually reaches, set directly under it.
 *
 * Deliberately small and unboxed. A bordered card with a large portrait reads
 * as an agency template, which is the one thing this is not meant to look
 * like; a name under a signing line reads as a person. The portrait is a
 * 224 px circular cut of the studio shot from the business card, shown at 72
 * to 80 px, so it is sharp on a retina screen and costs 5.6 KB.
 */
function FounderSignature() {
  return (
    <figure className="mt-11 flex items-center gap-5 border-t border-paper/15 pt-8">
      <Image
        src="/team/thanya-wigg.webp"
        alt="Thanawadee (Thanya) Wigg, founder of Islander Home Phuket"
        width={224}
        height={224}
        sizes="80px"
        className="h-18 w-18 shrink-0 rounded-full object-cover sm:h-20 sm:w-20"
      />
      <figcaption>
        <p className="font-display text-base font-semibold tracking-[0.02em] text-paper">
          Thanawadee (Thanya) Wigg
        </p>
        <p className="kicker mt-1.5 text-[0.58rem] text-paper/55">
          Founder · Phuket Property Consultant
        </p>
        <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-paper/70">
          Local insight, personal service, and a better way to find property in
          Phuket.
        </p>
      </figcaption>
    </figure>
  );
}

/**
 * `image` lets a page hand in a real listing photo instead of the stock plate.
 * `founder` adds the signature below the buttons — homepage only, so the same
 * band on /about and on every blog post stays as it was.
 */
export function CtaBand({
  image,
  founder = false,
}: { image?: string; founder?: boolean } = {}) {
  return (
    <section className="bg-ink px-2 py-6 sm:px-3">
      <div className="relative overflow-hidden rounded-[var(--radius-frame)] py-24 sm:py-32">
      <Image
        src={image ?? "/properties/villa-3.webp"}
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/60 to-black/20" />
      {/* The signature sits low in the band, where a bright interior shot can
          surface behind it. Only added with the signature, so /about and the
          blog keep the band exactly as it was. */}
      {founder && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
      )}
      <div className={cn(SITE_WIDTH, "relative mx-auto px-5 sm:px-8 lg:px-12")}>
        <div className="max-w-2xl">
          <p className="kicker text-paper/70">Let&apos;s talk</p>
          <h2 className="display-caps mt-5 text-[2rem] text-paper sm:text-[3.2rem]">
            Ready to find your Phuket home?
          </h2>
          <p className="mt-5 text-lg text-paper/75">
            Tell us what you&apos;re looking for and our advisors will curate a
            shortlist for you — usually within 24 hours.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <ButtonLink href="/contact" variant="gold" size="lg">
              Make an Enquiry
            </ButtonLink>
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-paper/30 px-8 text-sm font-semibold uppercase tracking-[0.18em] text-paper transition-colors hover:border-paper hover:bg-paper/10"
            >
              <WhatsAppIcon className="h-5 w-5" /> WhatsApp
            </a>
            <a
              href={CONTACT.line}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-paper/30 px-8 text-sm font-semibold uppercase tracking-[0.18em] text-paper transition-colors hover:border-paper hover:bg-paper/10"
            >
              <LineIcon className="h-5 w-5" /> LINE
            </a>
          </div>
          {founder && <FounderSignature />}
        </div>
      </div>
      </div>
    </section>
  );
}
