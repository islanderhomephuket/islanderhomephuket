import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { AREAS, CONTACT, NAV_LINKS, SITE } from "@/lib/constants";
import {
  FacebookIcon,
  InstagramIcon,
  LineIcon,
  WhatsAppIcon,
} from "@/components/brand/contact-icons";

export function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Logo markClassName="h-20 w-20" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-paper/60">
              Curated luxury villas, condominiums and land across Phuket&apos;s
              most desirable areas — backed by trusted local expertise.
            </p>
            <div className="mt-6 flex gap-3">
              <SocialLink href={CONTACT.whatsapp} label="WhatsApp">
                <WhatsAppIcon className="h-5 w-5" />
              </SocialLink>
              <SocialLink href={CONTACT.line} label="LINE">
                <LineIcon className="h-5 w-5" />
              </SocialLink>
              <SocialLink href={CONTACT.facebook} label="Facebook">
                <FacebookIcon className="h-5 w-5" />
              </SocialLink>
              <SocialLink href={CONTACT.instagram} label="Instagram">
                <InstagramIcon className="h-5 w-5" />
              </SocialLink>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="kicker text-gold">Explore</h3>
            <ul className="mt-5 space-y-3 text-sm text-paper/70">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-gold">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas */}
          <div>
            <h3 className="kicker text-gold">Areas</h3>
            <ul className="mt-5 space-y-3 text-sm text-paper/70">
              {AREAS.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/areas/${a.slug}`}
                    className="transition-colors hover:text-gold"
                  >
                    {a.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="kicker text-gold">Get in touch</h3>
            <ul className="mt-5 space-y-4 text-sm text-paper/70">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>35/294 Wichit, Mueang Phuket, Phuket 83000</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <a
                  href={CONTACT.whatsapp}
                  className="transition-colors hover:text-gold"
                >
                  {SITE.phoneDisplay}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="transition-colors hover:text-gold"
                >
                  {CONTACT.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-paper/10 pt-8 text-xs text-paper/40 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-gold">
              About
            </Link>
            <Link href="/contact" className="hover:text-gold">
              Contact
            </Link>
            <Link href="/admin" className="hover:text-gold">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-paper/20 text-paper/80 transition-all hover:border-gold hover:bg-gold hover:text-ink"
    >
      {children}
    </a>
  );
}
