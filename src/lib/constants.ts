/** Static site configuration — brand, contacts, navigation, areas. */

export const SITE = {
  name: "Islander Home Phuket",
  shortName: "Islander Home",
  tagline: "Luxury Real Estate in Phuket",
  description:
    "Islander Home Phuket — curated luxury villas, condos and land for sale and rent across Phuket's most desirable areas. Sea-view estates, private-pool villas and trusted local expertise.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://islanderhomephuket.com",
  email: "islanderhomephuket@gmail.com",
  phoneDisplay: "+66 65 959 4299",
  locale: "en_US",
} as const;

export const CONTACT = {
  whatsapp: "https://wa.me/66659594299",
  whatsappNumber: "+66 65 959 4299",
  line: "https://line.me/ti/p/7Cr_f-bvBX",
  lineId: "@islanderhome",
  facebook: "https://www.facebook.com/share/17zfFD16u2/?mibextid=wwXIfr",
  email: "islanderhomephuket@gmail.com",
} as const;

/** Pre-filled WhatsApp deep link with an optional message. */
export function whatsappLink(message?: string): string {
  const base = "https://wa.me/66659594299";
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const NAV_LINKS = [
  { label: "Buy", href: "/buy" },
  { label: "Rent", href: "/rent" },
  { label: "Areas", href: "/areas" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

export interface AreaInfo {
  slug: string;
  name: string;
  tagline: string;
  blurb: string;
  highlights: string[];
  /** Google Maps query for the embedded map. */
  mapQuery: string;
  coords: { lat: number; lng: number };
  image: string;
}

export const AREAS: AreaInfo[] = [
  {
    slug: "koh-kaew",
    name: "Koh Kaew",
    tagline: "Connected, green & family-friendly",
    blurb:
      "A fast-growing residential hub on Phuket's east coast, Koh Kaew offers easy access to international schools, Central Floresta, marinas and the airport — making it a favourite for families and long-stay residents.",
    highlights: [
      "Near UWC & British International School",
      "Minutes to Boat Avenue & Central Floresta",
      "Excellent airport & town connectivity",
      "Modern pool villas & condominiums",
    ],
    mapQuery: "Koh Kaew, Phuket, Thailand",
    coords: { lat: 7.9335, lng: 98.3786 },
    image: "/listings/kk-lakeville-villa-08/7.jpg",
  },
  {
    slug: "bang-tao",
    name: "Bang Tao",
    tagline: "Beachfront luxury & Laguna living",
    blurb:
      "Home to the famed Laguna Phuket and a sweeping 6km beach, Bang Tao is the island's premier luxury lifestyle destination — beach clubs, fine dining and world-class branded residences.",
    highlights: [
      "6km of golden Bang Tao Beach",
      "Laguna golf, resorts & beach clubs",
      "Boat Avenue & Porto de Phuket dining",
      "High rental yields & capital growth",
    ],
    mapQuery: "Bang Tao Beach, Phuket, Thailand",
    coords: { lat: 7.9989, lng: 98.2945 },
    image: "/properties/villa-1.png",
  },
  {
    slug: "phuket-town",
    name: "Phuket Town",
    tagline: "Sino-Portuguese heritage & culture",
    blurb:
      "The island's vibrant cultural heart, Old Phuket Town blends colourful Sino-Portuguese shophouses, café culture and authentic Thai living with strong rental demand from professionals.",
    highlights: [
      "Historic Old Town & Sunday Walking Street",
      "Best local dining & cafés on the island",
      "Central to hospitals & government services",
      "Townhouses, shophouses & condos",
    ],
    mapQuery: "Phuket Town, Thailand",
    coords: { lat: 7.8804, lng: 98.3923 },
    image: "/properties/villa-3.png",
  },
  {
    slug: "chalong",
    name: "Chalong",
    tagline: "Hillside views & island gateway",
    blurb:
      "Centred on Chalong Pier — the gateway to Phuket's southern islands — Chalong offers sweeping hillside sea views, great value pool villas and quick access to the south's best beaches.",
    highlights: [
      "Chalong Pier — gateway to the islands",
      "Big Buddha & hillside viewpoints",
      "Great-value private-pool villas",
      "Close to Rawai, Nai Harn & Kata",
    ],
    mapQuery: "Chalong, Phuket, Thailand",
    coords: { lat: 7.8462, lng: 98.3381 },
    image: "/listings/ch-songkhun-villa-07/6.jpg",
  },
  {
    slug: "rawai",
    name: "Rawai",
    tagline: "Bohemian seaside & expat haven",
    blurb:
      "A relaxed seaside community on the southern tip of the island, Rawai is loved by expats and digital nomads for its seafood markets, yoga studios and easy access to Phuket's most beautiful southern beaches.",
    highlights: [
      "Rawai & Nai Harn beaches",
      "Thriving expat & wellness community",
      "Fresh seafood markets & beach bars",
      "Sea-view villas & boutique condos",
    ],
    mapQuery: "Rawai Beach, Phuket, Thailand",
    coords: { lat: 7.7741, lng: 98.3245 },
    image: "/properties/villa-7.png",
  },
  {
    slug: "thalang",
    name: "Thalang",
    tagline: "Nature, space & smart investment",
    blurb:
      "Covering Phuket's lush north, Thalang offers larger plots, nature reserves and proximity to the airport and Laguna — an emerging value play for buyers seeking space and long-term growth.",
    highlights: [
      "Spacious land plots & private estates",
      "Sirinat National Park & quiet beaches",
      "Close to the international airport",
      "Strong long-term capital appreciation",
    ],
    mapQuery: "Thalang District, Phuket, Thailand",
    coords: { lat: 8.0353, lng: 98.339 },
    image: "/properties/villa-8.png",
  },
];

export function getArea(slug: string): AreaInfo | undefined {
  return AREAS.find((a) => a.slug === slug);
}

export const PROPERTY_TYPES = [
  "Villa",
  "Condominium",
  "Townhouse",
  "House",
  "Apartment",
  "Land",
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];
