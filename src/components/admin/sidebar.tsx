"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Inbox,
  Newspaper,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { logoutAction } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/properties", label: "Properties", icon: Building2 },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/blog", label: "Journal", icon: Newspaper },
];

export function AdminSidebar({ live }: { live: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-1 flex-col gap-1">
      {LINKS.map((l) => {
        const active = l.exact
          ? pathname === l.href
          : pathname.startsWith(l.href);
        const Icon = l.icon;
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors",
              active
                ? "bg-gold text-ink"
                : "text-paper/70 hover:bg-charcoal-light hover:text-paper",
            )}
          >
            <Icon className="h-5 w-5" />
            {l.label}
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="border-t border-charcoal-light pt-4">
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-3 px-4 py-3 text-sm text-paper/60 hover:text-gold"
      >
        <ExternalLink className="h-5 w-5" />
        View site
      </Link>
      <form action={logoutAction}>
        <button
          type="submit"
          className="flex w-full items-center gap-3 px-4 py-3 text-sm text-paper/60 hover:text-red-400"
        >
          <LogOut className="h-5 w-5" />
          Sign out
        </button>
      </form>
      <div className="mt-3 px-4">
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em]",
            live ? "bg-green-500/20 text-green-400" : "bg-gold/20 text-gold",
          )}
        >
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              live ? "bg-green-400" : "bg-gold",
            )}
          />
          {live ? "Live · Supabase" : "Demo mode"}
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-charcoal-light bg-ink px-5 lg:hidden">
        <Logo tone="light" markClassName="h-8 w-8" />
        <button
          aria-label="Toggle admin menu"
          onClick={() => setOpen((v) => !v)}
          className="text-paper"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-ink p-5 lg:flex">
        <Link href="/admin" className="mb-8 px-2">
          <Logo tone="light" />
        </Link>
        {nav}
        {footer}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/60"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-ink p-5 pt-20">
            {nav}
            {footer}
          </aside>
        </div>
      )}
    </>
  );
}
