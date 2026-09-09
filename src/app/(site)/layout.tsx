import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingContact } from "@/components/layout/floating-contact";

/**
 * Cache public pages for 5 minutes instead of rendering every request.
 *
 * Listings are published straight into Supabase by script, so the site cannot go
 * fully static — but re-rendering on every hit was costing ~3s TTFB per listing
 * page, which Google both measures and pays for out of the crawl budget. Five
 * minutes keeps a new listing effectively instant while making the common case a
 * cache hit. The admin dashboard still revalidates explicitly on write.
 */
export const revalidate = 300;


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
