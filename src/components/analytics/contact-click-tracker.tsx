"use client";

import { useEffect } from "react";

/**
 * Counts clicks on contact buttons and labels them RENT or BUY.
 *
 * One listener for the whole site, so every WhatsApp/LINE link — header,
 * floating button, listing card, footer, inside blog copy — is counted without
 * touching each one. No cookies: the landing page and its source are kept in
 * sessionStorage for this tab only, so a click can be credited to the page a
 * search brought the visitor to.
 */

const KEY = "ih_entry";

function channelOf(href: string): string | null {
  if (/wa\.me|whatsapp\.com/i.test(href)) return "whatsapp";
  if (/line\.me/i.test(href)) return "line";
  if (/facebook\.com|m\.me|fb\.me/i.test(href)) return "facebook";
  if (href.startsWith("tel:")) return "phone";
  if (href.startsWith("mailto:")) return "email";
  return null;
}

function intentOf(path: string): "rent" | "buy" | "other" {
  const listing = document.querySelector<HTMLElement>("[data-listing-intent]");
  const fromListing = listing?.dataset.listingIntent;
  if (fromListing === "rent" || fromListing === "buy") return fromListing;
  if (path === "/rent" || path.startsWith("/rent/")) return "rent";
  if (path === "/buy" || path.startsWith("/buy/")) return "buy";
  return "other";
}

/** "google", "facebook", "direct", or the referring host. utm_source wins. */
function sourceOf(): string {
  try {
    const utm = new URLSearchParams(location.search).get("utm_source");
    if (utm) return utm.slice(0, 100);
    if (!document.referrer) return "direct";
    const host = new URL(document.referrer).hostname.replace(/^www\./, "");
    if (host === location.hostname.replace(/^www\./, "")) return "internal";
    const known = host.match(/(google|bing|yahoo|duckduckgo|facebook|instagram|line|chatgpt|openai|perplexity)/);
    return known ? known[1] : host;
  } catch {
    return "unknown";
  }
}

function readEntry(): { landing_path?: string; source?: string } {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function ContactClickTracker() {
  useEffect(() => {
    // First page of this tab's visit = the landing page.
    try {
      if (!sessionStorage.getItem(KEY)) {
        sessionStorage.setItem(KEY, JSON.stringify({ landing_path: location.pathname, source: sourceOf() }));
      }
    } catch {
      /* storage blocked — clicks still count, without the landing page */
    }

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const channel = channelOf(a.getAttribute("href") ?? "");
      if (!channel) return;

      const path = location.pathname;
      const placement =
        a.closest<HTMLElement>("[data-cta]")?.dataset.cta ??
        (a.closest("header") ? "header" : a.closest("footer") ? "footer" : "page");
      const entry = readEntry();
      const body = JSON.stringify({
        channel,
        intent: intentOf(path),
        path,
        placement,
        property_ref:
          document.querySelector<HTMLElement>("[data-listing-intent]")?.dataset.listingRef ?? null,
        landing_path: entry.landing_path ?? null,
        source: entry.source ?? null,
        device: matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop",
      });
      try {
        // sendBeacon survives the page handing over to WhatsApp.
        if (!navigator.sendBeacon?.("/api/click", new Blob([body], { type: "text/plain" }))) {
          void fetch("/api/click", { method: "POST", body, keepalive: true });
        }
      } catch {
        /* never block the click */
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
