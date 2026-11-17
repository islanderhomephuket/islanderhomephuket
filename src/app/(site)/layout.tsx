import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingContact } from "@/components/layout/floating-contact";
import { ContactClickTracker } from "@/components/analytics/contact-click-tracker";

/**
 * Public pages are served only as copies prerendered at build time. There is no
 * hourly ISR any more.
 *
 * Workers Free allows 10 ms of CPU per request, and a Next.js page render costs
 * far more. With an hourly window, the first visitor after a page went stale
 * triggered an on-demand render inside the Worker and it was killed mid-flight:
 * on 17/11/2026 roughly half of all requests returned 503 or hung for 25 s+
 * ("Error: Worker exceeded CPU time limit" in `wrangler tail`). The incremental
 * cache is the read-only static-asset store, so a re-render cannot even be
 * saved — every later visitor paid the same failing render.
 *
 * With `revalidate = false` every page is a static asset and costs no render
 * CPU. The trade is that a data change only appears after `npm run deploy`, and
 * POST /api/revalidate must NOT be called: marking a page stale is precisely
 * what brings the CPU limit back. Workers Paid (5 min of CPU, R2 incremental
 * cache) would restore instant publishing.
 */
export const revalidate = false;


export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingContact />
      <ContactClickTracker />
    </div>
  );
}
