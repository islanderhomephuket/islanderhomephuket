"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { NAV_LINKS, CONTACT } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/brand/contact-icons";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Transparent over hero only on the homepage top.
  const overlay = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || !overlay || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        solid
          ? "border-b border-sand/70 bg-ink/95 backdrop-blur-md"
          : "bg-gradient-to-b from-black/50 to-transparent",
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" aria-label="Islander Home Phuket — home">
          <Logo markClassName="h-14 w-14" />
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((link) => {
            const href = link.href as string;
            const active =
              pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-[0.78rem] font-medium uppercase tracking-[0.18em] transition-colors",
                  solid ? "text-paper/80" : "text-paper/90",
                  "hover:text-gold",
                  active && "text-gold",
                )}
              >
                {link.label}
                {active && (
                  <span className="absolute -bottom-2 left-0 h-px w-full bg-gold" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={CONTACT.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "hidden items-center gap-2 rounded-full px-5 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] transition-all sm:inline-flex",
              "bg-white text-ink hover:bg-white/80 border border-white/20",
            )}
          >
            <WhatsAppIcon className="h-4 w-4" />
            Enquire
          </a>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center lg:hidden",
              solid ? "text-paper" : "text-paper",
            )}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-sand/60 bg-ink transition-[max-height] duration-500 lg:hidden",
          open ? "max-h-[28rem]" : "max-h-0",
        )}
      >
        <nav className="flex flex-col px-6 py-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-sand/60 py-4 text-sm font-medium uppercase tracking-[0.18em] text-paper/80 hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={CONTACT.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center justify-center gap-2 bg-white px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-ink"
          >
            <WhatsAppIcon className="h-4 w-4" /> WhatsApp Enquiry
          </a>
        </nav>
      </div>
    </header>
  );
}
