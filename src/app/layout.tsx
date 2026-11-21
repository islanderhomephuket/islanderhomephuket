import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
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
  sameAs: [CONTACT.facebook, CONTACT.instagram],
  // Ties the business to the person behind it. The portrait, the name and this
  // job title all appear on the homepage, so the markup says only what a
  // visitor can see — "founder" is not used anywhere on the site, so it is not
  // claimed here either.
  employee: {
    "@type": "Person",
    "@id": `${SITE.url}/#thanya-wigg`,
    name: "Thanawadee Wigg",
    alternateName: "Thanya Wigg",
    jobTitle: "Phuket Property Consultant",
    image: `${SITE.url}/team/thanya-wigg-portrait.webp`,
    worksFor: { "@type": "RealEstateAgent", name: SITE.name, url: SITE.url },
  },
};

const display = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const body = Inter({
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
  verification: {
    google: "EJSksVCGuWfC2vW9XTLwONpiNt0Wv2Gx2b2HjygHIxo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-ink text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
