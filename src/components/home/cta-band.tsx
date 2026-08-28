import Image from "next/image";
import { CONTACT } from "@/lib/constants";
import { WhatsAppIcon, LineIcon } from "@/components/brand/contact-icons";
import { ButtonLink } from "@/components/ui/button";

/** `image` lets a page hand in a real listing photo instead of the stock plate. */
export function CtaBand({ image }: { image?: string } = {}) {
  return (
    <section className="bg-ink px-2 py-6 sm:px-3">
      <div className="relative overflow-hidden rounded-[var(--radius-frame)] py-24 sm:py-32">
      <Image
        src={image ?? "/properties/villa-3.png"}
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/60 to-black/20" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
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
      </div>
      </div>
    </section>
  );
}
