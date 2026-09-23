/** Static site configuration — brand, contacts, navigation, areas. */

export const SITE = {
  name: "Islander Home Phuket",
  shortName: "Islander Home",
  tagline: "Luxury Real Estate in Phuket",
  description:
    "Islander Home Phuket — curated luxury villas, condos and land for sale and rent across Phuket's most desirable areas. Sea-view estates, private-pool villas and trusted local expertise.",
  // Must be the host Vercel actually serves. The apex 308-redirects to www, so
  // pointing canonicals/sitemap at the apex made every URL Google fetched a redirect.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.islanderhomephuket.com",
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
  instagram: "https://www.instagram.com/islanderhomephuket",
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


/**
 * Hand-picked hero photography.
 *
 * Leave this array EMPTY and the hero falls back to the featured listings'
 * cover photos (self-updating as inventory changes). Put entries here to pin
 * specific images instead — drop the files in `public/hero/` and reference them
 * as `/hero/<file>.jpg`. `location`, `price` and `href` are optional; omit them
 * and the hero shows the photo with no caption.
 */
export const HERO_SLIDES: {
  image: string;
  title: string;
  location?: string;
  price?: string;
  href?: string;
}[] = [
  // Serrena — the lakefront show villa at Manik (BTA-059). Professional shoot,
  // stored at 2560px under property-media/hero/ so the repo stays light.
  "serrena-1",
  "serrena-2",
  "serrena-3",
  "serrena-4",
  "serrena-5",
].map((f) => ({
  image: `https://qqxfozlkizcgpwpgukcx.supabase.co/storage/v1/object/public/property-media/hero/${f}.jpg`,
  title: "Lakefront Pool Villa — Manik, Cherng Talay",
  location: "Cherng Talay · Lakefront Villa",
  price: "From THB 48,500,000",
  href: "/properties/cherngtalay-lakefront-pool-villa-485m",
}));

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
  /** Optional full-bleed marketing poster shown on the area card instead of the photo. */
  poster?: string;
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
    poster: "/areas/koh-kaew.jpg",
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
    poster: "/areas/bang-tao.jpg",
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
    poster: "/areas/phuket-town.jpg",
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
    poster: "/areas/chalong.jpg",
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
    poster: "/areas/rawai.jpg",
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
    poster: "/areas/thalang.jpg",
  },
  {
    slug: "kathu",
    name: "Kathu",
    tagline: "Central, convenient & well connected",
    blurb:
      "Wedged between Phuket Town and Patong, Kathu is the island's practical centre — Central Floresta and Central Festival, international schools and the Loch Palm golf courses are all minutes away, and the beach is a ten-minute drive over the hill.",
    highlights: [
      "Minutes to Central Floresta & Central Festival",
      "Quick hill road to Patong Beach",
      "Loch Palm & Red Mountain golf",
      "Modern condominiums & family houses",
    ],
    mapQuery: "Kathu, Phuket, Thailand",
    coords: { lat: 7.911, lng: 98.332 },
    image: "/properties/villa-2.png",
  },
  {
    slug: "patong",
    name: "Patong",
    tagline: "The island's beachfront city",
    blurb:
      "Phuket's most energetic beach town — a three-kilometre bay backed by hotels, restaurants and nightlife, with hillside condominiums above it taking in the whole sweep of the sea.",
    highlights: [
      "Patong Beach & Bangla Road",
      "Strong short-term rental demand",
      "Hillside sea-view apartments",
      "Everything within walking distance",
    ],
    mapQuery: "Patong Beach, Phuket, Thailand",
    coords: { lat: 7.8965, lng: 98.296 },
    image: "/properties/villa-4.png",
  },
  {
    slug: "kata",
    name: "Kata",
    tagline: "Surf beach & laid-back living",
    blurb:
      "Two sheltered bays on the west coast with a long-standing surf and yoga community, good restaurants and a quieter, greener pace than the resort towns to the north.",
    highlights: [
      "Kata & Kata Noi beaches",
      "Surf season from May to October",
      "Hillside villas with sea views",
      "Close to Karon, Chalong & Rawai",
    ],
    mapQuery: "Kata Beach, Phuket, Thailand",
    coords: { lat: 7.818, lng: 98.298 },
    image: "/properties/villa-5.png",
  },
  {
    slug: "karon",
    name: "Karon",
    tagline: "Wide sands & sea-view condos",
    blurb:
      "The island's longest west-coast beach, backed by a low-rise resort strip and a hillside of condominiums — a steady rental market with easy access to Kata and Patong.",
    highlights: [
      "Three kilometres of Karon Beach",
      "Sea-view condominium stock",
      "Reliable holiday rental demand",
      "Ten minutes to Patong & Kata",
    ],
    mapQuery: "Karon Beach, Phuket, Thailand",
    coords: { lat: 7.846, lng: 98.294 },
    image: "/properties/villa-6.png",
  },
  {
    slug: "kamala",
    name: "Kamala",
    tagline: "Millionaire's Mile & quiet bays",
    blurb:
      "A calm family beach north of Patong, with the clifftop estates of Millionaire's Mile above it — one of Phuket's most exclusive addresses, yet still a working Thai village at heart.",
    highlights: [
      "Kamala Beach & Millionaire's Mile",
      "Quiet, family-friendly village",
      "Luxury sea-view villas & residences",
      "Fifteen minutes to Bang Tao & Patong",
    ],
    mapQuery: "Kamala Beach, Phuket, Thailand",
    coords: { lat: 7.954, lng: 98.283 },
    image: "/properties/villa-1.png",
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
  // Commercial hotel leases (whole-building, sold by the room count rather than
  // the bedroom count). Added 2026-09-20 with the two Phuket lease listings.
  "Hotel",
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];
