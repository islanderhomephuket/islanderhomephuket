import type { Metadata } from "next";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ContactForm } from "@/components/forms/contact-form";
import { MapEmbed } from "@/components/property/map-embed";
import {
  FacebookIcon,
  InstagramIcon,
  LineIcon,
  WhatsAppIcon,
} from "@/components/brand/contact-icons";
import { CONTACT, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Islander Home Phuket. Reach our advisors via WhatsApp, LINE, Facebook, email or the enquiry form for villas, condos and rentals across Phuket.",
  alternates: { canonical: "/contact" },
};

const channels = [
  {
    label: "WhatsApp",
    value: CONTACT.whatsappNumber,
    href: CONTACT.whatsapp,
    Icon: WhatsAppIcon,
    bg: "bg-[#25D366]",
  },
  {
    label: "LINE",
    value: "Add us on LINE",
    href: CONTACT.line,
    Icon: LineIcon,
    bg: "bg-[#06C755]",
  },
  {
    label: "Facebook",
    value: "Message on Facebook",
    href: CONTACT.facebook,
    Icon: FacebookIcon,
    bg: "bg-[#1877F2]",
  },
  {
    label: "Instagram",
    value: "Follow on Instagram",
    href: CONTACT.instagram,
    Icon: InstagramIcon,
    bg: "bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5]",
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="bg-ink pb-12 pt-32">
        <Container>
          <p className="kicker text-gold-light">We&apos;d love to hear from you</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-paper sm:text-5xl">
            Get in touch
          </h1>
          <p className="mt-4 max-w-2xl text-paper/70">
            Tell us what you&apos;re looking for and an Islander Home advisor will
            respond — usually within a few hours.
          </p>
        </Container>
      </section>

      <section className="bg-charcoal py-20">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr]">
            {/* Info */}
            <div>
              <SectionHeading kicker="Contact details" title="Reach us directly" />

              <div className="mt-8 space-y-5">
                <InfoRow Icon={Phone} label="Phone / WhatsApp">
                  <a href={CONTACT.whatsapp} className="hover:text-gold-dark">
                    {SITE.phoneDisplay}
                  </a>
                </InfoRow>
                <InfoRow Icon={Mail} label="Email">
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="hover:text-gold-dark"
                  >
                    {CONTACT.email}
                  </a>
                </InfoRow>
                <InfoRow Icon={MapPin} label="Office">
                  35/294 Wichit, Mueang Phuket, Phuket 83000
                </InfoRow>
                <InfoRow Icon={Clock} label="Hours">
                  Mon–Sat · 9:00–18:00 (ICT)
                </InfoRow>
              </div>

              {/* Quick channels */}
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {channels.map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-2 border border-sand bg-ink/40 p-5 text-center transition-colors hover:border-gold"
                  >
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-full text-white ${c.bg}`}
                    >
                      <c.Icon className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-paper">
                      {c.label}
                    </span>
                  </a>
                ))}
              </div>

              <div className="mt-8 h-64 overflow-hidden border border-sand">
                <MapEmbed
                  query="35/294 Wichit, Mueang Phuket, Phuket 83000"
                  title="Islander Home Phuket"
                />
              </div>
            </div>

            {/* Form */}
            <div className="border border-sand bg-ink/40 p-8">
              <h2 className="font-display text-2xl font-semibold text-paper">
                Send us a message
              </h2>
              <p className="mt-2 text-sm text-paper/60">
                Share a few details and we&apos;ll be in touch shortly.
              </p>
              <div className="mt-6">
                <ContactForm source="contact-page" />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function InfoRow({
  Icon,
  label,
  children,
}: {
  Icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold-dark">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xs uppercase tracking-[0.14em] text-paper/45">{label}</p>
        <p className="mt-1 text-paper/80">{children}</p>
      </div>
    </div>
  );
}
