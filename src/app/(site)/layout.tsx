import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingContact } from "@/components/layout/floating-contact";

/**
 * Cache public pages for an hour instead of rendering every request.
 *
 * Listings are published straight into Supabase by script, so the site cannot go
 * fully static — but re-rendering on every hit was costing ~3s TTFB per listing
 * page. It was 5 minutes until 14/11/2026, when Vercel paused the site for
 * exceeding the Hobby plan's fair-use CPU: ~900 listing and hub pages, each
 * re-rendered every 5 minutes as crawlers walked them, was the bulk of it.
 * Publishing scripts call POST /api/revalidate after a batch, so new listings
 * still show immediately; edits made without that call show within the hour.
 * The admin dashboard still revalidates explicitly on write.
 */
export const revalidate = 3600;


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
    </div>
  );
}
