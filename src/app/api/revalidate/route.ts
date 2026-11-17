import { NextResponse } from "next/server";

/**
 * Disabled on 17/11/2026. Kept as an endpoint only so the publishing scripts
 * that still call it get a clear answer instead of a 404.
 *
 * It used to run `revalidatePath("/", "layout")`, which marks every one of the
 * ~1,100 public pages stale at once. On Workers Free that is a site outage: a
 * stale page has to be re-rendered inside the Worker, a render costs far more
 * than the 10 ms of CPU the plan allows, and the request is killed. The whole
 * site then answered 503 or hung until the next deploy — which is exactly what
 * happened after this endpoint was called four times on 17/11/2026.
 *
 * Public pages are now `revalidate = false` (see `(site)/layout.tsx`), so the
 * only way to publish a change is `npm run deploy`, which rebuilds every page
 * as a static asset. Workers Paid would restore on-demand revalidation.
 */
export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      disabled: true,
      reason:
        "On-demand revalidation is disabled on the Workers Free plan: marking pages stale forces a render that exceeds the 10 ms CPU limit and takes the site down. Run `npm run deploy` to publish changes.",
    },
    { status: 409 },
  );
}
