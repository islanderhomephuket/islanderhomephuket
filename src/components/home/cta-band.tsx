import Image from "next/image";
import { CONTACT } from "@/lib/constants";
import { WhatsAppIcon, LineIcon } from "@/components/brand/contact-icons";
import { ButtonLink } from "@/components/ui/button";

export function CtaBand() {
  return (
    <section className="relative overflow-hidden bg-ink py-24">
      <Image
        src="/properties/villa-3.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/40" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <p className="kicker text-gold-light">Let&apos;s talk</p>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-paper sm:text-5xl">
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
              className="inline-flex h-14 items-center justify-center gap-2 bg-[#25D366] px-8 text-sm font-semibold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90"
            >
              <WhatsAppIcon className="h-5 w-5" /> WhatsApp
            </a>
            <a
              href={CONTACT.line}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center justify-center gap-2 bg-[#06C755] px-8 text-sm font-semibold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90"
            >
              <LineIcon className="h-5 w-5" /> LINE
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
