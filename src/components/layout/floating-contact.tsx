"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { CONTACT } from "@/lib/constants";
import {
  FacebookIcon,
  LineIcon,
  WhatsAppIcon,
} from "@/components/brand/contact-icons";
import { cn } from "@/lib/utils";

const channels = [
  {
    label: "WhatsApp",
    href: CONTACT.whatsapp,
    icon: WhatsAppIcon,
    bg: "bg-[#25D366]",
  },
  { label: "LINE", href: CONTACT.line, icon: LineIcon, bg: "bg-[#06C755]" },
  {
    label: "Facebook",
    href: CONTACT.facebook,
    icon: FacebookIcon,
    bg: "bg-[#1877F2]",
  },
];

export function FloatingContact() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-5 z-40 flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">
      {channels.map((c, i) => {
        const Icon = c.icon;
        return (
          <a
            key={c.label}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={c.label}
            className={cn(
              "group flex items-center gap-3 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
              open
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-4 opacity-0",
            )}
            style={{ transitionDelay: `${open ? i * 60 : 0}ms` }}
          >
            <span className="rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-paper opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              {c.label}
            </span>
            <span
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full text-white shadow-luxe",
                c.bg,
              )}
            >
              <Icon className="h-6 w-6" />
            </span>
          </a>
        );
      })}

      <button
        type="button"
        aria-label={open ? "Close contact menu" : "Open contact menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-paper shadow-luxe transition-transform hover:scale-105"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
