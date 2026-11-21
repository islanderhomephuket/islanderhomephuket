import Image from "next/image";
import { CONTACT } from "@/lib/constants";
import { WhatsAppIcon, LineIcon } from "@/components/brand/contact-icons";
import { ButtonLink } from "@/components/ui/button";
import { SITE_WIDTH } from "@/components/ui/container";
import { cn } from "@/lib/utils";

/**
 * The person the WhatsApp button actually reaches, beside it rather than
 * squeezed underneath.
 *
 * Third attempt. At 72 px under the buttons it was too small to register; as
 * its own full-width section with a rectangular card it was, in the user's
 * words, not pretty. This keeps it inside the enquiry band — the one place on
 * the page where someone is deciding whether to message a stranger — but moves
 * it into the band's right half, which until now held nothing but photograph,
 * and takes the portrait to 128 px.
 *
 * Still no box and no border: a hairline above on mobile, a vertical rule
 * beside it on desktop, and three lines of text. The portrait is a 224 px
 * circular cut of the studio shot from the business card, so 128 px is still
 * inside its real resolution.
 */
function ConsultantSignature() {
  return (
    <figure className="mt-12 flex max-w-sm items-center gap-6 border-t border-paper/15 pt-9 lg:mt-0 lg:max-w-none lg:flex-col lg:items-start lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
      <Image
        src="/team/thanya-wigg.webp"
        alt="Thanawadee (Thanya) Wigg, Phuket property consultant at Islander Home Phuket"
        width={224}
        height={224}
        sizes="128px"
        className="h-24 w-24 shrink-0 rounded-full object-cover sm:h-28 sm:w-28 lg:h-32 lg:w-32"
      />
      <figcaption className="lg:mt-6">
        <p className="font-display text-lg font-semibold leading-snug tracking-[0.01em] text-paper">
          Thanawadee (Thanya) Wigg
        </p>
        <p className="mt-2 text-[0.64rem] font-medium uppercase tracking-[0.15em] text-paper/55">
          Phuket Property Consultant
        </p>
        <p className="mt-4 max-w-xs text-[0.95rem] leading-relaxed text-paper/70">
          Local insight, personal service, and a better way to find property in
          Phuket.
        </p>
      </figcaption>
    </figure>
  );
}

/**
 * `image` lets a page hand in a real listing photo instead of the stock plate.
 * `signature` puts the consultant beside the enquiry copy — homepage only,
 * so the same band on /about and on every blog post stays as it was.
 */
export function CtaBand({
  image,
  signature = false,
}: { image?: string; signature?: boolean } = {}) {
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
      {/* The band's right half carries the portrait now, and a bright
          interior shot behind it kills the contrast. Only added with the
          signature, so /about and the blog keep the band as it was. */}
      {signature && (
        <div className="absolute inset-0 bg-black/45" />
      )}
      <div className={cn(SITE_WIDTH, "relative mx-auto px-5 sm:px-8 lg:px-12")}>
        <div
          className={cn(
            signature
              ? "grid gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-center lg:gap-16"
              : "",
          )}
        >
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
        </div>
        {signature && <ConsultantSignature />}
        </div>
      </div>
      </div>
    </section>
  );
}
