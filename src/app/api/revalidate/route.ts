import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/**
 * On-demand cache refresh for the public site.
 *
 * Pages are cached for an hour (see `(site)/layout.tsx`). Listings are published
 * straight into Supabase by script, so after a batch the publishing script calls
 *   POST /api/revalidate   with header  x-revalidate-secret: <REVALIDATE_SECRET>
 * and every public page re-renders on its next visit — new listings show at once
 * without paying for a re-render every five minutes all day.
 */
export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || req.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, at: new Date().toISOString() });
}
