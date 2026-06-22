import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { SITE, CONTACT } from "@/lib/constants";

/** Structured data so Google understands the business (local SEO / rich results). */
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: SITE.name,
  description: SITE.description,
  url: SITE.url,
  telephone: SITE.phoneDisplay,
  email: CONTACT.email,
  image: `${SITE.url}/og.png`,
  logo: `${SITE.url}/logo.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "35/294 Wichit",
    addressLocality: "Mueang Phuket",
    addressRegion: "Phuket",
    postalCode: "83000",
    addressCountry: "TH",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 7.8804,
    longitude: 98.3923,
  },
  areaServed: { "@type": "Place", name: "Phuket, Thailand" },
  openingHours: "Mo-Sa 09:00-18:00",
  sameAs: [CONTACT.facebook],
};

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const body = Jost({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "Phuket real estate",
    "Phuket villas for sale",
    "Phuket property",
    "luxury villas Phuket",
    "Bang Tao villas",
    "Rawai property",
    "Phuket condos",
    "buy property Phuket",
    "rent villa Phuket",
  ],
  authors: [{ name: SITE.name }],
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-paper text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
