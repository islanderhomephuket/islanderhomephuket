import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/server";

/**
 * One row per contact-button click — WhatsApp, LINE, Facebook, phone, email.
 *
 * Built so organic landing pages can be tied to enquiries without cookies or a
 * consent banner: no IP, no user agent, no identifiers — only the page, the
 * RENT/BUY label, the button's placement and where the visit started.
 * Table: `contact_clicks` (supabase/migrations/2026-11-16-contact-clicks.sql).
 */

const CHANNELS = new Set(["whatsapp", "line", "facebook", "phone", "email"]);
const INTENTS = new Set(["rent", "buy", "other"]);

const str = (v: unknown, max: number) =>
  typeof v === "string" && v.length > 0 ? v.slice(0, max) : null;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const channel = str(body.channel, 20);
  const intent = str(body.intent, 10);
  const path = str(body.path, 300);
  if (!channel || !CHANNELS.has(channel) || !intent || !INTENTS.has(intent) || !path?.startsWith("/")) {
    return new NextResponse(null, { status: 422 });
  }

  const supabase = createPublicClient();
  if (!supabase) return new NextResponse(null, { status: 204 });

  const { error } = await supabase.from("contact_clicks").insert({
    channel,
    intent,
    path,
    placement: str(body.placement, 30),
    property_ref: str(body.property_ref, 60),
    landing_path: str(body.landing_path, 300),
    source: str(body.source, 100),
    device: body.device === "mobile" ? "mobile" : "desktop",
  });
  if (error) console.error("[click]", error.message);
  // The visitor is already on their way to WhatsApp; never make them wait or see an error.
  return new NextResponse(null, { status: 204 });
}
