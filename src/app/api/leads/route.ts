import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Basic email shape check. */
function isEmail(v: unknown): v is string {
  return typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = body.email;
  const phone = typeof body.phone === "string" ? body.phone.trim() : null;
  const message = typeof body.message === "string" ? body.message.trim() : null;
  const property_id =
    typeof body.property_id === "string" ? body.property_id : null;
  const property_title =
    typeof body.property_title === "string" ? body.property_title : null;
  const source = typeof body.source === "string" ? body.source : "website";

  if (!name) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 422 });
  }
  if (!isEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 422 },
    );
  }

  const supabase = await createClient();

  // DEMO mode — no DB configured. Accept the lead so the UX works end-to-end.
  if (!supabase) {
    console.info("[lead:demo]", { name, email, phone, source, property_title });
    return NextResponse.json({ ok: true, demo: true }, { status: 201 });
  }

  const { error } = await supabase.from("leads").insert({
    name,
    email,
    phone,
    message,
    property_id,
    property_title,
    source,
    status: "new",
  });

  if (error) {
    console.error("[lead:error]", error.message);
    return NextResponse.json(
      { error: "We couldn't submit your enquiry. Please try WhatsApp instead." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
