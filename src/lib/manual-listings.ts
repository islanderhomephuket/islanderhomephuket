import type { Property } from "./types";

/**
 * Hand-curated property listings, added house-by-house from the owner's data.
 * Landlord contact details are never included here — only public marketing info.
 */

/**
 * Build the image list for a listing.
 * Photos stay in natural file order (1..N) so the gallery counter always
 * matches the file number. `cover` is the 1-based photo flagged as the main
 * image — it's used for the card and the gallery opens on it.
 */
function imgs(
  id: string,
  dir: string,
  count: number,
  cover = 1,
): Property["images"] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${id}-img-${i}`,
    property_id: id,
    url: `/listings/${dir}/${i + 1}.jpg`,
    alt: null,
    sort_order: i,
    is_cover: i + 1 === cover,
  }));
}

const NOW = "2026-06-09T09:00:00.000Z";

export const MANUAL_LISTINGS: Property[] = [
  {
    id: "kk-burasiri-01",
    slug: "burasiri-koh-kaew",
    title: "Burasiri Koh Kaew — House for Sale or Rent",
    description: `Prime location directly opposite the fence of British International School, Phuket.

A modern family home in the sought-after Burasiri Koh Kaew development — perfect for families looking to live close to international schools, marinas and Phuket Town.

Property details:
• 3 Bedrooms
• 3 Bathrooms
• Land size: 65.5 sq.wah (≈262 m²)
• Parking for 4 cars — the only house in the project with space for four cars

Rental terms: 2 months advance payment + 1 month agent commission.`,
    listing_type: "both",
    status: "available",
    property_type: "House",
    area_slug: "koh-kaew",
    price: 9890000, // sale
    rent_price: 58000, // monthly
    rent_period: "month",
    bedrooms: 3,
    bathrooms: 3,
    living_area: null,
    land_area: 262,
    address: "Burasiri, Koh Kaew, Phuket (opposite British International School)",
    latitude: 7.9335,
    longitude: 98.3786,
    features: [
      "Opposite British International School",
      "Parking for 4 cars (only house in the project)",
      "Close to international schools",
      "Near marinas & Phuket Town",
      "3 bedrooms · 3 bathrooms",
      "Family-friendly gated development",
    ],
    is_featured: true,
    reference: "KK01",
    created_at: NOW,
    updated_at: NOW,
    images: imgs("kk-burasiri-01", "kk-burasiri", 30),
  },
  {
    id: "kk-soi10-villa-02",
    slug: "pool-villa-koh-kaew-soi-10",
    title: "Private Pool Villa Near BIS — Koh Kaew",
    description: `Prime location near British International School Phuket — perfect for families seeking a peaceful lifestyle with convenient access to top international schools and shopping centres.

This beautiful private pool villa offers the perfect balance of comfort, privacy and convenience, making it an excellent choice for both homeowners and investors looking for a property in one of Phuket's most sought-after areas.

Property details:
• 3 Bedrooms
• 3 Bathrooms
• Land size: 276 m²
• Private saltwater swimming pool (3.5 × 7 m)
• Fully built-in furniture
• Move-in ready
• Quiet and private residential community

Location highlights:
• 4 minutes to British International School Phuket
• 10 minutes to Robinson Lifestyle Thalang
• 15 minutes to Central Phuket`,
    listing_type: "both",
    status: "available",
    property_type: "Villa",
    area_slug: "koh-kaew",
    price: 10900000, // sale
    rent_price: 85000, // monthly (1-year contract)
    rent_period: "month",
    bedrooms: 3,
    bathrooms: 3,
    living_area: null,
    land_area: 276,
    address: "Koh Kaew, Phuket",
    latitude: 7.9335,
    longitude: 98.3786,
    features: [
      "Private saltwater pool (3.5 × 7 m)",
      "Fully built-in furniture",
      "Move-in ready",
      "4 minutes to British International School",
      "Quiet, private residential community",
      "276 m² land",
    ],
    is_featured: true,
    reference: "KK02",
    created_at: NOW,
    updated_at: NOW,
    images: imgs("kk-soi10-villa-02", "kk-soi10-villa", 33),
  },
  {
    id: "kk-villa-03",
    slug: "private-pool-villa-koh-kaew-kk03",
    title: "Private Pool Villa — Koh Kaew",
    description: `Prime Koh Kaew location — one of Phuket's most practical areas, just 4 minutes from British International School Phuket.

A move-in-ready private pool villa with a functional open-plan layout and a kitchen connected to the living area. Whether you're looking for a family home near BIS or an investment property in a high-demand area, this villa offers excellent value in a sought-after location.

Property details:
• 3 Bedrooms
• 3 Bathrooms
• Land size: 276 m²
• Functional open-plan layout, kitchen connected to the living area
• Private swimming pool
• Fully furnished — ready to move in

Location highlights:
• 4 minutes to British International School Phuket
• 10 minutes to Robinson Lifestyle Thalang
• 15 minutes to Central Phuket
• Convenient access to marinas, hospitals and major shopping centres`,
    listing_type: "sale",
    status: "available",
    property_type: "Villa",
    area_slug: "koh-kaew",
    price: 10900000,
    rent_price: null,
    rent_period: null,
    bedrooms: 3,
    bathrooms: 3,
    living_area: null,
    land_area: 276,
    address: "Koh Kaew, Phuket",
    latitude: 7.9335,
    longitude: 98.3786,
    features: [
      "Private swimming pool",
      "Fully furnished — ready to move in",
      "Open-plan living & kitchen",
      "4 minutes to British International School",
      "276 m² land",
      "High-demand investment area",
    ],
    is_featured: true,
    reference: "KK03",
    created_at: NOW,
    updated_at: NOW,
    images: imgs("kk-villa-03", "kk-villa-03", 21),
  },
  {
    id: "kk-resort-villa-04",
    slug: "resort-style-pool-villa-koh-kaew-kk04",
    title: "Resort-Style Tropical Pool Villa — Koh Kaew",
    description: `A resort-style tropical pool villa in Koh Kaew — perfect for private living or investment with strong rental potential.

Set in a lush tropical garden with a relaxing sala by the pool and spacious outdoor living areas, this villa delivers a true holiday-at-home atmosphere in one of Phuket's most practical and sought-after areas.

Property details:
• 3 Bedrooms
• 3 Bathrooms
• Land size: 644 m²
• Built-up area: 244 m²
• Private swimming pool (4 × 10 m)
• Relaxing garden sala by the pool
• Lush tropical garden & spacious outdoor living area

Location highlights:
• 5 minutes to BISC International School
• 8 minutes to Robinson Lifestyle Thalang
• 20 minutes to Bang Tao Beach
• 30 minutes to Laguna Phuket`,
    listing_type: "both",
    status: "available",
    property_type: "Villa",
    area_slug: "koh-kaew",
    price: 19900000, // sale
    rent_price: 150000, // monthly
    rent_period: "month",
    bedrooms: 3,
    bathrooms: 3,
    living_area: 244,
    land_area: 644,
    address: "Koh Kaew, Phuket",
    latitude: 7.9335,
    longitude: 98.3786,
    features: [
      "Private swimming pool (4 × 10 m)",
      "Garden sala by the pool",
      "Lush tropical garden",
      "Spacious outdoor living area",
      "5 minutes to BISC International School",
      "Strong rental potential",
    ],
    is_featured: true,
    reference: "KK04",
    created_at: NOW,
    updated_at: NOW,
    images: imgs("kk-resort-villa-04", "kk-resort-villa-04", 27),
  },
  {
    id: "kk-garden-villa-05",
    slug: "tropical-garden-villa-koh-kaew-kk05",
    title: "Tropical Garden Villa Near BISP — Koh Kaew",
    description: `Your private oasis in the heart of the city. Step away from the chaos and into serenity — this tropical modern garden home offers a true resort-style living experience: spacious, tranquil and thoughtfully designed for family life.

Located in the city centre, the villa blends oriental elegance with contemporary comfort, creating a peaceful retreat while remaining close to every convenience Phuket has to offer.

Property highlights:
• Ready to move in
• 4 Bedrooms | 4 Bathrooms
• Land area: 400 m²
• Tropical modern garden-style villa
• Peaceful and private environment
• Freehold — ideal for families and long-term living

Prime location — excellent accessibility:
• British International School Phuket (BISP): 6 km (10-minute drive)
• HeadStart International School: 7 km
• KFC / Pizza Company: 800 m
• Hypermarket: 1 km · IKEA: 3 km
• Central Festival & Phuket Old Town: 5 km`,
    listing_type: "both",
    status: "available",
    property_type: "Villa",
    area_slug: "koh-kaew",
    price: 14900000, // sale (freehold)
    rent_price: 70000, // monthly
    rent_period: "month",
    bedrooms: 4,
    bathrooms: 4,
    living_area: null,
    land_area: 400,
    address: "Koh Kaew, Phuket",
    latitude: 7.9335,
    longitude: 98.3786,
    features: [
      "Freehold title",
      "Tropical modern garden villa",
      "Ready to move in",
      "Peaceful & private environment",
      "10 minutes to British International School (BISP)",
      "Central — close to schools, IKEA & Central Festival",
    ],
    is_featured: true,
    reference: "KK05",
    created_at: NOW,
    updated_at: NOW,
    images: imgs("kk-garden-villa-05", "kk-garden-villa-05", 20, 2),
  },
  {
    id: "kk-saransiri-06",
    slug: "saransiri-corner-house-koh-kaew-kk06",
    title: "Saransiri Corner House Opposite BIS — Koh Kaew",
    description: `Located directly opposite British International School Phuket, this corner single house in Saransiri Koh Kaew offers extra privacy and space — perfect for families.

Fully furnished and ready to move in, with a flexible layout including a home office that can be converted into a 5th bedroom.

Property details:
• Land size: 65.5 sq.wah (≈262 m²)
• 4 Bedrooms
• 2 Bathrooms
• 1 Home office (can be converted into a 5th bedroom)
• Upstairs exercise area / multipurpose space
• 2 storage rooms downstairs
• Fully furnished — ready to move in

Included appliances:
• 6 air conditioners
• TV · Refrigerator · Washing machine · Internet

Note: currently rented on a yearly contract. Rental terms: 2 months advance payment.`,
    listing_type: "both",
    status: "available",
    property_type: "House",
    area_slug: "koh-kaew",
    price: 12900000, // sale
    rent_price: 68000, // monthly
    rent_period: "month",
    bedrooms: 4,
    bathrooms: 2,
    living_area: null,
    land_area: 262,
    address: "Saransiri, Koh Kaew, Phuket (opposite British International School)",
    latitude: 7.9335,
    longitude: 98.3786,
    features: [
      "Corner house — extra privacy",
      "Opposite British International School",
      "Home office (convertible 5th bedroom)",
      "Upstairs exercise / multipurpose area",
      "Fully furnished · 6 air conditioners",
      "2 downstairs storage rooms",
    ],
    is_featured: true,
    reference: "KK06",
    created_at: NOW,
    updated_at: NOW,
    images: imgs("kk-saransiri-06", "kk-saransiri-06", 28, 15),
  },
  {
    id: "kk-tharua-villa-07",
    slug: "pool-villa-tharua-koh-kaew-kk07",
    title: "Modern Pool Villa, Tharua — Koh Kaew",
    description: `A modern pool villa in a prime Tharua – Koh Kaew location (opposite Kruwitt 2 Pier), ideal for family living or investment near British International School Phuket.

Property details:
• Land size: 90 sq.wah (≈360 m²)
• 3 Bedrooms | 3 Bathrooms
• Private swimming pool (5 × 10 m)
• Built-in kitchen
• Groundwater well system
• Electric gate
• Quiet and convenient residential area

Note: furniture not included.`,
    listing_type: "sale",
    status: "available",
    property_type: "Villa",
    area_slug: "koh-kaew",
    price: 11900000,
    rent_price: null,
    rent_period: null,
    bedrooms: 3,
    bathrooms: 3,
    living_area: null,
    land_area: 360,
    address: "Tharua, Koh Kaew, Phuket (opposite Kruwitt 2 Pier)",
    latitude: 7.9335,
    longitude: 98.3786,
    features: [
      "Private swimming pool (5 × 10 m)",
      "Built-in kitchen",
      "Groundwater well system",
      "Electric gate",
      "Near British International School",
      "Quiet residential area",
    ],
    is_featured: true,
    reference: "KK07",
    created_at: NOW,
    updated_at: NOW,
    images: imgs("kk-tharua-villa-07", "kk-tharua-villa-07", 29),
  },
  {
    id: "kk-lakeville-villa-08",
    slug: "luxury-pool-villa-koh-kaew-kk08",
    title: "Luxury 2-Storey Pool Villa — Koh Kaew",
    description: `An exceptional 2-storey luxury pool villa in a prime Koh Kaew location — just 5 minutes to British International School, on the main road before 88 Land & Houses Koh Kaew and opposite Supalai Lake Ville.

Finished to the highest standard with teak wood throughout, marble flooring and a marble saltwater pool — fully fitted with imported furniture.

Property details:
• 2-storey pool villa
• 4 Bedrooms | 3 Bathrooms
• Land: 124 sq.wah (≈496 m²)
• House usable area: 411.35 m²
• Pool area: 47.05 m² (salt system + circulation)
• Outdoor usable area: 180 m²

Features:
• Teak wood throughout the house
• Marble flooring + marble swimming pool
• Anti-theft system + CCTV
• Private well + plumbing system & water storage tank
• Full-option imported furniture

Rental terms: 2 months deposit. (Currently has a yearly tenant until the end of this month.)`,
    listing_type: "both",
    status: "available",
    property_type: "Villa",
    area_slug: "koh-kaew",
    price: 26900000, // sale
    rent_price: 160000, // monthly
    rent_period: "month",
    bedrooms: 4,
    bathrooms: 3,
    living_area: 411,
    land_area: 496,
    address: "Koh Kaew, Phuket (opposite Supalai Lake Ville)",
    latitude: 7.9335,
    longitude: 98.3786,
    features: [
      "Teak wood throughout",
      "Marble flooring + marble saltwater pool",
      "Anti-theft system + CCTV",
      "Private well + water storage tank",
      "Full-option imported furniture",
      "5 minutes to British International School",
    ],
    is_featured: true,
    reference: "KK08",
    created_at: NOW,
    updated_at: NOW,
    images: imgs("kk-lakeville-villa-08", "kk-lakeville-villa-08", 31, 7),
  },

  /* ─────────────── Chalong ─────────────── */
  {
    id: "ch-seaview-villas-01",
    slug: "chalong-seaview-pool-villas-ch01",
    title: "Chalong Seaview Pool Villas — 2 Available",
    description: `Exclusive seaview pool villas in Chalong, Phuket — only 2 villas available.

Each villa offers 4 bedrooms, a private swimming pool, smart-home system and a private underground water system, fully furnished and ready to move in.

Shared features (both villas):
• 4 Bedrooms | 6 Bathrooms
• Private swimming pool
• Smart-home system
• Fully furnished — ready to move in
• Private underground water system
• Built-up area: 429 m² each

Villa 1 — Lower Villa
• Land size: 1 Ngan 94.4 sq.wah (≈778 m²)
• Sale price: ฿24,900,000 · Rent: ฿290,000/month

Villa 2 — Upper Villa
• Land size: 2 Ngan 5.6 sq.wah (≈822 m²)
• Sale price: ฿26,900,000 · Rent: ฿290,000/month`,
    listing_type: "both",
    price: 24900000, // from (Villa 1)
    rent_price: 290000,
    rent_period: "month",
    status: "available",
    property_type: "Villa",
    area_slug: "chalong",
    bedrooms: 4,
    bathrooms: 6,
    living_area: 429,
    land_area: 778,
    address: "Chalong, Phuket",
    latitude: 7.8462,
    longitude: 98.3381,
    features: [
      "Sea view",
      "Private swimming pool",
      "Smart-home system",
      "Fully furnished — ready to move in",
      "Private underground water system",
      "2 villas available (from ฿24.9M)",
    ],
    is_featured: true,
    reference: "CH01",
    created_at: NOW,
    updated_at: NOW,
    images: imgs("ch-seaview-villas-01", "ch-seaview-villas-01", 37),
  },
  {
    id: "ch-aer-villa-02",
    slug: "aer-house-pool-villa-chalong-ch02",
    title: "Aer House — Modern Mountain-View Pool Villa, Chalong",
    description: `Aer House is a modern mountain-view pool villa in Chom Thong, Chalong — an open-plan home with pool and garden views, and a rooftop with panoramic mountain views.

A strong investment with high rental yield potential (estimated ฿120,000–150,000/month).

Property details:
• 3 Bedrooms | 3 Bathrooms | 2 Parking
• Land: 45 sq.wah (≈180 m²)
• Built-up area: 360 m²
• Private pool (3 × 7 m)
• Rooftop with panoramic mountain view

Highlights:
• Modern open-plan design with pool & garden view
• Spacious master bedroom with private balcony
• Rooftop panoramic mountain view

Nearby: Robinson, HomePro, BCIS, Oak Meadow, Dibuk Hospital.`,
    listing_type: "sale",
    price: 11900000,
    rent_price: null,
    rent_period: null,
    status: "available",
    property_type: "Villa",
    area_slug: "chalong",
    bedrooms: 3,
    bathrooms: 3,
    living_area: 360,
    land_area: 180,
    address: "Chom Thong, Chalong, Phuket",
    latitude: 7.8462,
    longitude: 98.3381,
    features: [
      "Private pool (3 × 7 m)",
      "Rooftop panoramic mountain view",
      "Modern open-plan design",
      "Master bedroom with private balcony",
      "2 parking spaces",
      "High rental yield potential",
    ],
    is_featured: true,
    reference: "CH02",
    created_at: NOW,
    updated_at: NOW,
    images: imgs("ch-aer-villa-02", "ch-aer-villa-02", 14),
  },
  {
    id: "ch-88house-03",
    slug: "family-home-88-land-houses-chalong-ch03",
    title: "Spacious Family Home, 88 Land & Houses — Wichit / Chalong",
    description: `A beautifully maintained detached family home in the popular Wichit–Chalong area (88 Land and Houses) — plenty of space and a convenient location for a growing family.

The home offers easy access to schools, shopping centres, restaurants and Phuket Town while providing a peaceful residential atmosphere.

Property details:
• Land size: 60.4 sq.wah (≈242 m²)
• 4 Bedrooms
• 4 Bathrooms
• Walk-in closet & storage room
• Laundry & drying area
• Large kitchen
• Fully furnished
• Air conditioning in every room
• Water pump & water storage tank
• Green garden around the house
• Covered parking for 2 cars`,
    listing_type: "sale",
    price: 11500000,
    rent_price: null,
    rent_period: null,
    status: "available",
    property_type: "House",
    area_slug: "chalong",
    bedrooms: 4,
    bathrooms: 4,
    living_area: null,
    land_area: 242,
    address: "Wichit / Chalong, Phuket (88 Land and Houses)",
    latitude: 7.8462,
    longitude: 98.3381,
    features: [
      "Fully furnished",
      "Air conditioning in every room",
      "Walk-in closet & storage room",
      "Green garden around the house",
      "Covered parking for 2 cars",
      "Water pump & storage tank",
    ],
    is_featured: true,
    reference: "CH03",
    created_at: NOW,
    updated_at: NOW,
    images: imgs("ch-88house-03", "ch-88house-03", 39, 15),
  },
  {
    id: "ch-the8-villa-04",
    slug: "the-8-pool-villa-chalong-ch04",
    title: "The 8 — 2-Bed Pool Villa, Chalong",
    description: `Urgent sale — ready to transfer. A 2-bedroom pool villa at The 8 Pool Villa, Chalong (near Rawai & Nai Harn) at a special price, clearly below market value in the same area. Ideal for both living and investment.

Property details:
• Land size: 36.10 sq.wah (≈144 m²)
• Built-up area: 118 m²
• 2 Bedrooms | 2 Bathrooms | 1 Parking
• Private swimming pool (2.9 × 4.7 m)
• Approximately 2 years old
• Fully furnished — move-in ready or rent out immediately

Before transfer, the owner will renovate the villa to like-new condition (repaint and repair any damaged areas).

Investment potential:
• Average rental ฿35,000–50,000/month (short or long term)
• Strong rental demand year-round in the Chalong–Rawai–Nai Harn area
• Close to international schools, malls, supermarkets & beaches
• High growth potential in land value

Note: ready to transfer within 2 weeks of signing; transfer fee, stamp duty & taxes paid by buyer.`,
    listing_type: "sale",
    price: 6290000,
    rent_price: null,
    rent_period: null,
    status: "available",
    property_type: "Villa",
    area_slug: "chalong",
    bedrooms: 2,
    bathrooms: 2,
    living_area: 118,
    land_area: 144,
    address: "The 8 Pool Villa, Chalong, Phuket (near Rawai & Nai Harn)",
    latitude: 7.8462,
    longitude: 98.3381,
    features: [
      "Below market value — urgent sale",
      "Private pool (2.9 × 4.7 m)",
      "Fully furnished — move-in ready",
      "Owner renovates to like-new before transfer",
      "Strong year-round rental demand",
      "Near Rawai & Nai Harn beaches",
    ],
    is_featured: true,
    reference: "CH04",
    created_at: NOW,
    updated_at: NOW,
    images: imgs("ch-the8-villa-04", "ch-the8-villa-04", 13, 2),
  },
  {
    id: "ch-palai-villa-05",
    slug: "private-pool-villa-palai-chalong-ch05",
    title: "Private Pool Villa, Palai — Chalong",
    description: `A private pool villa for sale in Palai, Chalong — one of only 5 exclusive units in a peaceful development with mountain views.

Property features:
• 3 Bedrooms
• 4 Bathrooms
• 2 private parking spaces
• Private swimming pool
• Land area: 284 m²
• Premium construction with structural warranty
• Optional villa management services

Lifestyle & facilities:
• Peaceful natural surroundings with mountain views
• 24/7 security
• Fitness centre
• Well-maintained common areas

Prime location — Palai, Chalong:
• Minutes to Palai Beach
• Close to BCIS & Ruamrudee International Schools
• Near Robinson Lifestyle Chalong
• Easy access to Phuket Town & main marinas`,
    listing_type: "sale",
    price: 13990000,
    rent_price: null,
    rent_period: null,
    status: "available",
    property_type: "Villa",
    area_slug: "chalong",
    bedrooms: 3,
    bathrooms: 4,
    living_area: null,
    land_area: 284,
    address: "Palai, Chalong, Phuket",
    latitude: 7.8462,
    longitude: 98.3381,
    features: [
      "Private swimming pool",
      "Mountain views",
      "24/7 security & fitness centre",
      "Premium construction with structural warranty",
      "2 private parking spaces",
      "Close to international schools & Palai Beach",
    ],
    is_featured: true,
    reference: "CH05",
    created_at: NOW,
    updated_at: NOW,
    images: imgs("ch-palai-villa-05", "ch-palai-villa-05", 15),
  },
  {
    id: "ch-sriwali-villa-06",
    slug: "luxury-pool-villa-sriwali-chalong-ch06",
    title: "Luxury Pool Villa, Sriwali 2 — Chalong",
    description: `A luxury pool villa at Land & Houses Sriwali 2, Chalong — the perfect blend of luxury, privacy and family-friendly living in one of Phuket's most sought-after residential communities.

Property features:
• 4 spacious bedrooms
• 5 modern bathrooms
• Private swimming pool (3.5 × 7.5 m)
• Covered parking for 2 cars
• Land size: 75.50 sq.wah (≈302 m²)
• Built-up area: 279.35 m²
• Extended kitchen with built-in countertops
• FREE Hafele electric hob & cooker hood
• Landscaped garden area
• FREE water pump & water storage tank
• Hot water system installed

Prime location:
• 5 minutes to BCIS Phuket International School
• 10 minutes to Chalong Pier
• 15 minutes to Rawai Beach
• 15 minutes to major shopping malls & lifestyle destinations

Ideal as a permanent residence, holiday home or investment property in the heart of South Phuket.`,
    listing_type: "sale",
    price: 15900000,
    rent_price: null,
    rent_period: null,
    status: "available",
    property_type: "Villa",
    area_slug: "chalong",
    bedrooms: 4,
    bathrooms: 5,
    living_area: 279,
    land_area: 302,
    address: "Land & Houses Sriwali 2, Chalong, Phuket",
    latitude: 7.8462,
    longitude: 98.3381,
    features: [
      "Private swimming pool (3.5 × 7.5 m)",
      "Extended kitchen with Hafele hob & hood",
      "Covered parking for 2 cars",
      "Landscaped garden",
      "Hot water system & water storage tank",
      "5 minutes to BCIS International School",
    ],
    is_featured: true,
    reference: "CH06",
    created_at: NOW,
    updated_at: NOW,
    images: imgs("ch-sriwali-villa-06", "ch-sriwali-villa-06", 20),
  },
  {
    id: "ch-songkhun-villa-07",
    slug: "new-luxury-pool-villa-songkhun-chalong-ch07",
    title: "New Luxury Pool Villa, Songkhun Village — Chalong",
    description: `A brand-new modern pool villa at Songkhun Village, Na Bon – Chalong, near Phuket Town — ready to move in. Perfect for living, a holiday home or investment.

Property details:
• Land size: 85 sq.wah (≈350 m²)
• Usable area: 454 m²
• 4 Bedrooms | 5 Bathrooms
• Spacious rooftop terrace
• Private swimming pool
• Parking for 2 cars

Included features:
• Built-in kitchen + electrical appliances
• Beautiful garden landscaping
• 6 air conditioning units included
• Modern design with spacious living areas

Note: transfer fees shared 50/50. Ready to move in — limited availability.`,
    listing_type: "sale",
    price: 13900000,
    rent_price: null,
    rent_period: null,
    status: "available",
    property_type: "Villa",
    area_slug: "chalong",
    bedrooms: 4,
    bathrooms: 5,
    living_area: 454,
    land_area: 350,
    address: "Songkhun Village, Na Bon, Chalong, Phuket",
    latitude: 7.8462,
    longitude: 98.3381,
    features: [
      "Brand new — ready to move in",
      "Private swimming pool",
      "Spacious rooftop terrace",
      "Built-in kitchen + appliances",
      "6 air conditioning units included",
      "Parking for 2 cars · near Phuket Town",
    ],
    is_featured: true,
    reference: "CH07",
    created_at: NOW,
    updated_at: NOW,
    images: imgs("ch-songkhun-villa-07", "ch-songkhun-villa-07", 40, 6),
  },
  {
    id: "ch-parichat-villa-08",
    slug: "parichat-modern-tropical-pool-villa-chalong-ch08",
    title: "Parichat Modern Tropical Pool Villa — Chalong",
    description: `A beautifully designed modern tropical pool villa at Parichat Pool Villa, Chalong — combining privacy, comfort and seamless indoor-outdoor living. Surrounded by lush greenery, with a private swimming pool, outdoor rain shower and thoughtfully designed living spaces perfect for families or lifestyle buyers.

Designed to maximise natural light and airflow, the villa offers a relaxing tropical atmosphere while maintaining privacy and functionality for everyday living.

Property features:
• 3 Bedrooms
• 3 Bathrooms
• Private swimming pool
• Outdoor rain shower
• Fully built-in throughout
• Fully furnished
• Landscaped garden
• Move-in ready
• Peaceful residential neighbourhood

Prime location:
• Close to BCIS International School
• Close to Ruamrudee International School Phuket (RIS)
• Easy access to Rawai, Nai Harn, Chalong Pier & major shopping destinations
• Quiet, established residential area of Chalong`,
    listing_type: "sale",
    price: 12900000,
    rent_price: null,
    rent_period: null,
    status: "available",
    property_type: "Villa",
    area_slug: "chalong",
    bedrooms: 3,
    bathrooms: 3,
    living_area: null,
    land_area: null,
    address: "Parichat Pool Villa, Chalong, Phuket",
    latitude: 7.8462,
    longitude: 98.3381,
    features: [
      "Private swimming pool",
      "Outdoor rain shower",
      "Fully built-in & furnished",
      "Landscaped garden",
      "Move-in ready",
      "Close to BCIS & RIS international schools",
    ],
    is_featured: true,
    reference: "CH08",
    created_at: NOW,
    updated_at: NOW,
    images: imgs("ch-parichat-villa-08", "ch-parichat-villa-08", 27, 14),
  },
  {
    id: "ch-lagoon-villa-09",
    slug: "private-lagoon-villas-sky-deck-chalong-ch09",
    title: "Brand-New 3-Storey Sky-Deck Pool Villa — Chalong",
    description: `Be among the first to own this stunning brand-new modern pool villa at Private Lagoon Villas, in one of Chalong's most desirable residential locations — near BCIS International School.

Contemporary design with spacious living areas and a spectacular private sky deck, perfect for entertaining or enjoying Phuket's tropical sunsets.

Construction progress: 70% complete · expected completion: October.

Property features:
• 3-storey luxury pool villa
• Private sky deck
• 4 Bedrooms (all ensuite)
• 1 multi-purpose room (office, gym, media room or guest room)
• 5 Bathrooms
• Covered parking for 2 cars
• Private saltwater swimming pool (4 × 8 m)

Property size:
• Land area: 412 m²
• Built-up area: 380 m²

Prime location:
• Near BCIS International School
• Easy access to Chalong Pier
• Convenient to Rawai & Nai Harn beaches
• Close to shopping centres, restaurants & lifestyle amenities
• Within the exclusive Private Lagoon Villas community`,
    listing_type: "sale",
    price: 16990000,
    rent_price: null,
    rent_period: null,
    status: "available",
    property_type: "Villa",
    area_slug: "chalong",
    bedrooms: 4,
    bathrooms: 5,
    living_area: 380,
    land_area: 412,
    address: "Private Lagoon Villas, Chalong, Mueang Phuket 83130",
    latitude: 7.8462,
    longitude: 98.3381,
    features: [
      "Brand new — 3-storey luxury villa",
      "Private sky deck",
      "4 bedrooms (all ensuite)",
      "Private saltwater pool (4 × 8 m)",
      "Multi-purpose room (office/gym/media)",
      "Near BCIS International School",
    ],
    is_featured: true,
    reference: "CH09",
    created_at: NOW,
    updated_at: NOW,
    images: imgs("ch-lagoon-villa-09", "ch-lagoon-villa-09", 35, 4),
  },
  {
    id: "pt-anocha-villa-ct01",
    slug: "luxury-pool-villa-phuket-town-ct01",
    title: "Super Luxury Pool Villa — Near Phuket Town",
    description: `Reduced from THB 19.9 Million to only THB 15.9 Million — a rare opportunity to own a stunning Modern Tropical residence offering over 400+ sq.m. of living space, designed for comfort, privacy, and convenience.

Only 2 minutes from Phuket Bus Terminal 2, with easy access to Phuket Town and a convenient route to Phuket International Airport.

Property features:
• 4 Bedrooms
• 5 Bathrooms
• Private swimming pool
• Private elevator inside the house
• Parking for 3 cars
• 400+ sq.m. living space

Included in price:
• Built-in furniture throughout
• Private home elevator
• Termite protection system
• 7 air conditioning units
• Fully equipped kitchen with refrigerator
• Water tank & water pump

Community facilities:
• Keycard access control
• CCTV throughout the project
• 24-hour security guards`,
    listing_type: "sale",
    status: "available",
    property_type: "Villa",
    area_slug: "phuket-town",
    price: 15900000,
    rent_period: null,
    bedrooms: 4,
    bathrooms: 5,
    living_area: 400,
    land_area: null,
    address: "Near Phuket Bus Terminal 2, Phuket Town",
    latitude: 7.893,
    longitude: 98.385,
    features: [
      "Private swimming pool",
      "Private in-house elevator",
      "Built-in furniture included",
      "7 air conditioning units",
      "Parking for 3 cars",
      "Keycard access & 24-hr security",
      "CCTV throughout",
      "2 mins to Phuket Bus Terminal 2",
    ],
    is_featured: true,
    reference: "CT01",
    created_at: NOW,
    updated_at: NOW,
    images: imgs("pt-anocha-villa-ct01", "pt-anocha-villa-ct01", 26, 1),
  },
  {
    id: "bt-sararat-villa-bt01",
    slug: "luxury-pool-villa-layan-bangtao-bt01",
    title: "Modern Luxury Pool Villa — Layan–Bangtao",
    description: `Newly renovated and move-in ready — this stunning 3-bedroom pool villa sits in the heart of the Layan–Bangtao area, just 5 minutes to Choeng Thale Beach and 10 minutes to Bang Tao Beach.

Interior design by Ticha, awarded Best Luxury Home Staging by STAGED4MORE. Located close to Project Artisan and behind Laguna Village.

Property features:
• 3 Bedrooms
• 3 Bathrooms
• Private swimming pool with spacious outdoor area
• Western & Thai-style kitchens
• Parking for 2 cars
• Land: 79.9 sq.wah (319.6 sq.m.)
• 24-hour security
• 5 mins to Choeng Thale Beach
• 10 mins to Bang Tao Beach
• 17 mins to Phuket International Airport`,
    listing_type: "both",
    status: "available",
    property_type: "Villa",
    area_slug: "bang-tao",
    price: 20000000,
    rent_period: "month",
    bedrooms: 3,
    bathrooms: 3,
    living_area: null,
    land_area: 320,
    address: "Layan–Bangtao, Cherng Talay, Thalang, Phuket",
    latitude: 8.0012,
    longitude: 98.2921,
    features: [
      "Newly renovated",
      "Award-winning interior design",
      "Private swimming pool",
      "Western & Thai-style kitchens",
      "Parking for 2 cars",
      "24-hour security",
      "5 mins to Choeng Thale Beach",
      "Near Laguna Village & Project Artisan",
    ],
    is_featured: true,
    reference: "BT01",
    created_at: NOW,
    updated_at: NOW,
    images: imgs("bt-sararat-villa-bt01", "bt-sararat-villa-bt01", 18, 1),
  },
  {
    id: "bt-bougainvillea-villa-bt02",
    slug: "bougainvillea-pool-villa-bangtao-bt02",
    title: "Bougainvillea — Brand-New Pool Villa, Bang Tao",
    description: `Brand new modern tropical pool villa in Bang Tao, available for long-term rent from January 2026.

Property features:
• 3 Bedrooms
• 4 Bathrooms
• Salt-chlorinated pool (9.5 × 4 m)
• Plot size: approx. 460 sq.m.
• Built-up area: 343 sq.m.
• Fully furnished
• Western kitchen
• Parking for 2 cars

Included in rent:
• Pool cleaning twice per week
• Garden maintenance once per month
• Housekeeping 4 times per month
• Pest control
• Internet

Not included: laundry, water (50 THB/unit), electricity (6 THB/unit)`,
    listing_type: "rent",
    status: "available",
    property_type: "Villa",
    area_slug: "bang-tao",
    price: 180000,
    rent_period: "month",
    bedrooms: 3,
    bathrooms: 4,
    living_area: 343,
    land_area: 460,
    address: "Pasak, Bang Tao, Cherng Talay, Phuket",
    latitude: 7.9985,
    longitude: 98.2955,
    features: [
      "Brand new — move-in ready",
      "Salt-chlorinated pool (9.5 × 4 m)",
      "Fully furnished",
      "Western kitchen",
      "Pool cleaning 2×/week included",
      "Housekeeping 4×/month included",
      "Internet included",
      "Parking for 2 cars",
    ],
    is_featured: true,
    reference: "BT02",
    created_at: NOW,
    updated_at: NOW,
    images: imgs("bt-bougainvillea-villa-bt02", "bt-bougainvillea-villa-bt02", 35, 1),
  },
  {
    id: "bt-laguna-villa-bt03",
    slug: "bali-inspired-pool-villa-laguna-bangtao-bt03",
    title: "Bali-Inspired Luxury Villa — Laguna, Bang Tao",
    description: `A stunning 5-bedroom Bali-inspired estate in the prestigious Laguna / Cherngtalay area, reduced from 78 MB to 65 MB.

Generously proportioned with 470 sq.m. of indoor living space on a 987 sq.m. plot, featuring a private pool, lush tropical garden and a secure gated community.

Prime location near Bang Tao & Layan Beach, Boat Avenue and Porto de Phuket.

Property features:
• 5 Bedrooms
• 4.5 Bathrooms
• Private swimming pool
• Tropical garden
• Indoor area: 470 sq.m.
• Land: 987 sq.m.
• Secure gated community
• Near Bang Tao & Layan Beach
• Near Boat Avenue & Porto de Phuket`,
    listing_type: "sale",
    status: "available",
    property_type: "Villa",
    area_slug: "bang-tao",
    price: 65000000,
    rent_period: null,
    bedrooms: 5,
    bathrooms: 5,
    living_area: 470,
    land_area: 987,
    address: "Laguna, Cherng Talay, Thalang, Phuket",
    latitude: 8.0005,
    longitude: 98.2981,
    features: [
      "Bali-inspired design",
      "Private swimming pool",
      "Tropical garden",
      "470 sq.m. indoor living space",
      "987 sq.m. land",
      "Secure gated community",
      "Near Bang Tao & Layan Beach",
      "Near Boat Avenue & Porto de Phuket",
    ],
    is_featured: true,
    reference: "BT03",
    created_at: NOW,
    updated_at: NOW,
    images: imgs("bt-laguna-villa-bt03", "bt-laguna-villa-bt03", 33, 1),
  },
  {
    id: "bt-laguna-villa-bt04",
    slug: "modern-pool-villa-near-laguna-bt04",
    title: "Modern 3+1 Bed Pool Villa — Near Laguna",
    description: `Ready to move in — a beautifully designed modern pool villa near Laguna, featuring a private pool with pool bar and outdoor bathroom.

Property features:
• 3 Bedrooms + Office (convertible to 4th bedroom)
• 5 Bathrooms
• Private pool with pool bar & bathroom
• Land area: 545 sq.m.
• Built-up area: 340 sq.m.
• Fully furnished with modern design
• CCTV security system`,
    listing_type: "sale",
    status: "available",
    property_type: "Villa",
    area_slug: "bang-tao",
    price: 25900000,
    rent_period: null,
    bedrooms: 4,
    bathrooms: 5,
    living_area: 340,
    land_area: 545,
    address: "Near Laguna, Cherng Talay, Thalang, Phuket",
    latitude: 8.0001,
    longitude: 98.2975,
    features: [
      "Private pool with pool bar",
      "3 bedrooms + convertible office",
      "Fully furnished modern design",
      "545 sq.m. land",
      "CCTV security system",
      "Ready to move in",
      "Near Laguna",
    ],
    is_featured: true,
    reference: "BT04",
    created_at: NOW,
    updated_at: NOW,
    images: imgs("bt-laguna-villa-bt04", "bt-laguna-villa-bt04", 20, 1),
  },
  {
    id: "bt-marnik-villa-bt05",
    slug: "luxury-pool-villa-marnik-cherng-talay-bt05",
    title: "Luxury Pool Villa — Marnik, Cherng Talay",
    description: `A stunning stand-alone villa designed like a premium resort at Marnik, Cherng Talay — offering peaceful mountain views and a guaranteed 8% rental yield per year.

Currently tenanted at 100,000 THB/month until August 2026 — generating income from day one.

Property features:
• 3 Bedrooms
• 4 Bathrooms
• Saltwater private pool (3 × 7 m)
• Land: 200 sq.m. | Built-up: 315 sq.m.
• Fully furnished & equipped kitchen
• Modern, private & peaceful setting

Prime location:
• 4 mins to Kajonkiet School
• 5 mins to Robinson Lifestyle Thalang
• 5 mins to HEL & HeadStart School
• 8 mins to Boat Avenue / Porto de Phuket
• 13 mins to Surin & Bang Tao Beaches
• 25 mins to Phuket International Airport`,
    listing_type: "sale",
    status: "available",
    property_type: "Villa",
    area_slug: "bang-tao",
    price: 14990000,
    rent_period: null,
    bedrooms: 3,
    bathrooms: 4,
    living_area: 315,
    land_area: 200,
    address: "Marnik, Cherng Talay, Thalang, Phuket",
    latitude: 7.9971,
    longitude: 98.3012,
    features: [
      "8% guaranteed rental yield",
      "Saltwater pool (3 × 7 m)",
      "Tenanted at 100K/month until Aug 2026",
      "Fully furnished & equipped",
      "Mountain view",
      "8 mins to Boat Avenue",
      "13 mins to Surin & Bang Tao Beaches",
    ],
    is_featured: true,
    reference: "BT05",
    created_at: NOW,
    updated_at: NOW,
    images: imgs("bt-marnik-villa-bt05", "bt-marnik-villa-bt05", 21, 1),
  },
  {
    id: "bt-sierra-vista-bt06",
    slug: "sierra-vista-luxury-pool-villas-bangtao-bt06",
    title: "Sierra Vista — Luxury Pool Villas Near Bang Tao",
    description: `An exclusive boutique development of 7 luxury pool villas just 10 minutes from Bang Tao Beach — starting from only 19.9 MB, fully furnished and ready to move in today.

Two completed show villas available now:
• A1 (Type A) — 4 Bed | 5 Bath | 24.9 MB
• B2 (Type B) — 4 Bed | 4 Bath | 19.9 MB

Project overview:
• 7 exclusive villas, 2 floors each
• Land size: 284–400 sq.m. per villa
• Built-up area: 375–465 sq.m. per villa
• Freehold & leasehold options available
• Flexible installment plan (up to 3 months during construction)
• Fully furnished & decorated — move in today

Prime location:
• 10 mins to Bang Tao Beach
• 12 mins to Maya Beach Club Phuket
• 26 mins to Phuket International Airport`,
    listing_type: "sale",
    status: "available",
    property_type: "Villa",
    area_slug: "bang-tao",
    price: 19900000,
    rent_period: null,
    bedrooms: 4,
    bathrooms: 4,
    living_area: 420,
    land_area: 342,
    address: "Sierra Vista, near Bang Tao, Cherng Talay, Phuket",
    latitude: 7.9968,
    longitude: 98.2998,
    features: [
      "Show villas ready to move in",
      "Freehold & leasehold options",
      "7 exclusive villas in boutique project",
      "Fully furnished & decorated",
      "10 mins to Bang Tao Beach",
      "12 mins to Maya Beach Club",
      "Flexible installment plan",
    ],
    is_featured: true,
    reference: "BT06",
    created_at: NOW,
    updated_at: NOW,
    images: imgs("bt-sierra-vista-bt06", "bt-sierra-vista-bt06", 12, 1),
  },
  {
    id: "bt-layan-villa-bt07",
    slug: "luxury-pool-villa-layan-beach-bt07",
    title: "Aileen — Luxury Pool Villa, Layan Beach",
    description: `Ready to move in — a beautifully crafted 3-bedroom luxury villa just 2 minutes from Layan Beach, featuring Italian designer furniture and an open mountain view.

Property features:
• 3 Bedrooms
• 4 Bathrooms
• Private swimming pool
• Plot: 242 sq.m. | Built-up: 265 sq.m.
• Open mountain view
• Bright living area with high ceiling
• Western kitchen
• Italian designer furniture
• Outdoor shower
• Spacious terraces & balconies
• Storage room
• Covered parking for 2 cars

Location:
• 2 mins to Layan Beach
• Quiet & peaceful area surrounded by nature`,
    listing_type: "sale",
    status: "available",
    property_type: "Villa",
    area_slug: "bang-tao",
    price: 22000000,
    rent_period: null,
    bedrooms: 3,
    bathrooms: 4,
    living_area: 265,
    land_area: 242,
    address: "Layan, Cherng Talay, Thalang, Phuket",
    latitude: 8.0035,
    longitude: 98.2912,
    features: [
      "2 mins to Layan Beach",
      "Italian designer furniture",
      "Private swimming pool",
      "Open mountain view",
      "High ceiling living area",
      "Western kitchen",
      "Spacious terraces & balconies",
      "Covered parking for 2 cars",
    ],
    is_featured: true,
    reference: "BT07",
    created_at: NOW,
    updated_at: NOW,
    images: imgs("bt-layan-villa-bt07", "bt-layan-villa-bt07", 142, 1),
  },
  {
    id: "bt-annara-villa-bt08",
    slug: "annara-luxury-pool-villa-cherng-talay-bt08",
    title: "Annara — Tropical Modern Pool Villa, Cherng Talay",
    description: `Only 2 units remaining out of 9 — a rare opportunity to own a resort-inspired Tropical Modern villa in the heart of Cherng Talay, Bang Tao.

Inspired by the concept of "Abundance & Sustainable Happiness," featuring warm wooden textures, coastal tones and sunset-inspired elements that create a calm, 5-star resort atmosphere.

Prime location:
• Close to Bang Tao Beach, Porto de Phuket, Boat Avenue & Catch Beach Club
• Surrounded by world-class international schools
• 20 mins to Phuket International Airport`,
    listing_type: "sale",
    status: "available",
    property_type: "Villa",
    area_slug: "bang-tao",
    price: 36500000,
    rent_period: null,
    bedrooms: 4,
    bathrooms: 4,
    living_area: null,
    land_area: null,
    address: "Cherng Talay, Bang Tao, Thalang, Phuket",
    latitude: 7.9978,
    longitude: 98.2963,
    features: [
      "Only 2 units remaining",
      "Tropical Modern 5-star resort design",
      "Private swimming pool",
      "Near Bang Tao Beach & Catch Beach Club",
      "Near Porto de Phuket & Boat Avenue",
      "Near international schools",
      "20 mins to Phuket Airport",
    ],
    is_featured: true,
    reference: "BT08",
    created_at: NOW,
    updated_at: NOW,
    images: imgs("bt-annara-villa-bt08", "bt-annara-villa-bt08", 10, 1),
  },
  {
    id: "bt-pasak-villa-bt09",
    slug: "investment-pool-villa-pasak-laguna-bt09",
    title: "Investment Pool Villa — Pasak Soi 2, Near Laguna",
    description: `One of the closest residential villas to Laguna Phuket — a high-yield investment property in the flood-free Pasak Soi 2 area, generating approx. THB 80,000/month in long-term rental income.

Property features:
• 3 Bedrooms
• 4 Bathrooms
• Private swimming pool
• 2-storey villa
• Land size: 28–30 sq.wah
• Fully furnished

Prime location — minutes from Laguna Phuket, Boat Avenue, Porto de Phuket, international schools, restaurants and Bang Tao Beach.

Suitable for both investment and personal use.`,
    listing_type: "sale",
    status: "available",
    property_type: "Villa",
    area_slug: "bang-tao",
    price: 7990000,
    rent_period: null,
    bedrooms: 3,
    bathrooms: 4,
    living_area: null,
    land_area: 116,
    address: "Pasak Soi 2, Cherng Talay, Thalang, Phuket",
    latitude: 7.9982,
    longitude: 98.2941,
    features: [
      "~80,000 THB/month rental potential",
      "Private swimming pool",
      "Fully furnished",
      "Flood-free location",
      "Closest residential area to Laguna",
      "Near Boat Avenue & Porto de Phuket",
      "Near Bang Tao Beach",
    ],
    is_featured: false,
    reference: "BT09",
    created_at: NOW,
    updated_at: NOW,
    images: imgs("bt-pasak-villa-bt09", "bt-pasak-villa-bt09", 12, 1),
  },
  {
    id: "bt-manik-villa-bt10",
    slug: "hot-deal-villa-bangjo-cherng-talay-bt10",
    title: "Hot Deal — 2-Bed Villa, Bang Jo / Cherng Talay",
    description: `A smart investment or cozy private home in one of Phuket's most desirable areas — Bang Jo / Cherng Talay, near Laguna.

Property features:
• 2 Bedrooms
• 3 Bathrooms
• Private parking for 2 cars
• Land size: 216 sq.m. (54 sq.wah)
• Transfer fee split 50/50

Location:
• 15 mins to Bang Tao Beach
• 15 mins to Laguna Phuket
• 20 mins to Surin Beach
• 25 mins to Nai Yang & Nai Thon Beach

Perfect for first-time investors, holiday home buyers or rental income in a high-demand area.`,
    listing_type: "sale",
    status: "available",
    property_type: "Villa",
    area_slug: "bang-tao",
    price: 7000000,
    rent_period: null,
    bedrooms: 2,
    bathrooms: 3,
    living_area: null,
    land_area: 216,
    address: "Bang Jo, Cherng Talay, Thalang, Phuket",
    latitude: 7.9991,
    longitude: 98.2978,
    features: [
      "Transfer fee split 50/50",
      "Parking for 2 cars",
      "15 mins to Bang Tao Beach",
      "15 mins to Laguna Phuket",
      "Near Surin & Nai Yang Beach",
      "Great rental income potential",
    ],
    is_featured: false,
    reference: "BT10",
    created_at: NOW,
    updated_at: NOW,
    images: imgs("bt-manik-villa-bt10", "bt-manik-villa-bt10", 20, 1),
  },
  {
    id: "bt-reef-villa-bt11",
    slug: "cash-flowing-pool-villa-bang-tao-bt11",
    title: "Cash-Flowing Pool Villa — Bang Tao, 9.4% ROI",
    description: `Already tenanted and already generating income — this is a ready-made investment with a tenant in place until October 2026 at 150,000 THB/month, delivering a 9.4% ROI from day one.

Price reduced from 20.9M → 19.5M THB.

Property features:
• 4 Bedrooms
• 4 Bathrooms
• Private balconies in every bedroom
• Built-up area: 372.4 sq.m.
• Land size: 276.2 sq.m.
• Fully furnished — move-in ready
• Air-conditioning in every room

Prime Bang Tao location:
• 3 mins to Boat Avenue & Porto de Phuket
• 2.7 km to Bang Tao Beach
• 1 min from main road (PTT Pasak)
• 20 mins to Phuket International Airport
• Surrounded by restaurants, supermarkets & hospitals`,
    listing_type: "sale",
    status: "available",
    property_type: "Villa",
    area_slug: "bang-tao",
    price: 19500000,
    rent_period: null,
    bedrooms: 4,
    bathrooms: 4,
    living_area: 372,
    land_area: 276,
    address: "Pasak, Bang Tao, Cherng Talay, Phuket",
    latitude: 7.9976,
    longitude: 98.2948,
    features: [
      "9.4% ROI — tenant until Oct 2026",
      "150,000 THB/month rental income",
      "Fully furnished — move-in ready",
      "Private balcony in every bedroom",
      "3 mins to Boat Avenue",
      "2.7 km to Bang Tao Beach",
      "Price reduced from 20.9M",
    ],
    is_featured: true,
    reference: "BT11",
    created_at: NOW,
    updated_at: NOW,
    images: imgs("bt-reef-villa-bt11", "bt-reef-villa-bt11", 42, 42),
  },
  {
    id: "rw-orbita-villa-rw01",
    slug: "orbita-villa-town-rawai-rw01",
    title: "Orbita Villa Town — Premium Pool Villa, Rawai",
    description: `A gated community of 16 premium pool villas in prime Rawai, just minutes from Nai Harn & Yanui Beach — designed for both luxury living and strong investment returns.

Phase 1 ready end of 2025. From 26.8M THB with 30% down payment.

Villa features:
• 3–6 bedrooms (all en-suite), options available
• Land: from 308 sq.m. | Living: 310 sq.m.
• Private pool & terrace
• 2-storey modern design by international architects
• Smart Home system + Solar power
• Covered parking for 2 cars
• Built to international standards

Project facilities:
• 24/7 security & reception
• Clubhouse with café & lounge
• Outdoor workout zone & yoga space
• Badminton court & 300m jogging track
• Shuttle bus service
• Co-working space
• Electric car charger
• Kids' pool & playground

Ownership & benefits:
• Leasehold / Freehold available
• No sinking fund
• 3 years free pool & garden service
• Guaranteed rental return 7% for 3 years
• Flexible financing options
• 5-year structural warranty`,
    listing_type: "sale",
    status: "available",
    property_type: "Villa",
    area_slug: "rawai",
    price: 26800000,
    rent_period: null,
    bedrooms: 4,
    bathrooms: 4,
    living_area: 310,
    land_area: 308,
    address: "Rawai, Mueang Phuket",
    latitude: 7.7745,
    longitude: 98.3241,
    features: [
      "7% guaranteed rental return for 3 years",
      "3 years free pool & garden service",
      "Smart Home + Solar power",
      "Freehold & leasehold options",
      "Gated community — 16 villas",
      "Minutes from Nai Harn & Yanui Beach",
      "No sinking fund",
      "5-year structural warranty",
    ],
    is_featured: true,
    reference: "RW01",
    created_at: NOW,
    updated_at: NOW,
    images: imgs("rw-orbita-villa-rw01", "rw-orbita-villa-rw01", 16, 1),
  },
  {
    id: "rw-warudom-villa-rw02",
    slug: "private-pool-villa-rawai-rw02",
    title: "Hot Deal — Private Pool Villa, Rawai",
    description: `Price reduced by 1.4M — now only 14.5M THB. A fully furnished 3-bedroom pool villa in Rawai, just 5 minutes to the beach and ready to move in.

Property features:
• 3 Bedrooms
• 4 Bathrooms
• Private pool: 2.8 × 7.2 m (depth 1.3 m)
• Plot size: 250.4 sq.m.
• Built-up area: 357.47 sq.m. (2 storeys)
• Fully furnished
• Water well & landscaping included
• No maintenance fee | No sinking fund`,
    listing_type: "sale",
    status: "available",
    property_type: "Villa",
    area_slug: "rawai",
    price: 14500000,
    rent_period: null,
    bedrooms: 3,
    bathrooms: 4,
    living_area: 357,
    land_area: 250,
    address: "Rawai, Mueang Phuket",
    latitude: 7.7758,
    longitude: 98.3255,
    features: [
      "Price reduced from 15.9M to 14.5M",
      "5 mins to the beach",
      "Private pool (2.8 × 7.2 m)",
      "Fully furnished — move-in ready",
      "No maintenance fee, no sinking fund",
      "Water well & landscaping included",
    ],
    is_featured: false,
    reference: "RW02",
    created_at: NOW,
    updated_at: NOW,
    images: imgs("rw-warudom-villa-rw02", "rw-warudom-villa-rw02", 25, 1),
  },
  {
    id: "rw-vimannaya-villa-rw03",
    slug: "vimannaya-residence-nai-harn-rw03",
    title: "Vimannaya Residence — Luxury Pool Villa, Nai Harn",
    description: `Modern tropical living just 5 minutes from Nai Harn Beach in an exclusive high-end villa community. Villa 1 is ready to move in now — this is not an off-plan project, construction is actively progressing.

Property features:
• 3 Bedrooms
• 4 Bathrooms
• Land plot: 600 sq.m.
• Smart Home system
• Solar panels & EV charging station
• Private 6,000L water tank + central water system
• Underground utilities & eco-friendly construction
• Beautiful separation between garden and pool areas

Project timeline:
• Villa 1 — Ready to move in
• Villas 2–3 — Completion: April 2026
• Villas 4–7 — Completion: December 2026

Prices start from 40.8M THB.`,
    listing_type: "sale",
    status: "available",
    property_type: "Villa",
    area_slug: "rawai",
    price: 40800000,
    rent_period: null,
    bedrooms: 3,
    bathrooms: 4,
    living_area: null,
    land_area: 600,
    address: "Nai Harn, Rawai, Mueang Phuket",
    latitude: 7.7698,
    longitude: 98.3058,
    features: [
      "Villa 1 ready to move in now",
      "Smart Home system",
      "Solar panels & EV charging station",
      "5 mins to Nai Harn Beach",
      "Eco-friendly construction",
      "Private 6,000L water tank",
      "Underground utilities",
      "600 sq.m. land plot",
    ],
    is_featured: true,
    reference: "RW03",
    created_at: NOW,
    updated_at: NOW,
    images: imgs("rw-vimannaya-villa-rw03", "rw-vimannaya-villa-rw03", 43, 1),
  },
  {
    id: "rw-rattanaporn-villa-rw04",
    slug: "modern-pool-villa-nai-harn-rawai-rw04",
    title: "Modern Pool Villa — Nai Harn / Rawai",
    description: `A fully equipped modern pool villa in a prime Nai Harn / Rawai location, 100m from Big C & Tops Supermarket and just 3 km to Nai Harn Beach.

Property features:
• 3 Bedrooms
• 3+1 Bathrooms
• Private pool: 3 × 5.5 m (depth 1.4 m)
• Land size: 240 sq.m. (60 sq.wah)
• Living area: 205 sq.m.
• Rooftop area
• Parking (1 car, inside)

Fully equipped:
• Washer & dryer, dishwasher, oven, microwave, fridge & mini fridge
• TVs: 65", 55", 43"
• 4 air conditioners (1 ceiling + 3 wall units)
• 3 water heaters, water tank/pump/well water

Ownership:
• Thai owner — Chanote title, Freehold
• Transfer fees shared 50/50

Location:
• 1 min to main Siyuan Road
• 100 m to Big C & Tops Supermarket
• 3 km to Nai Harn Beach | 2.7 km to Rawai Beach
• 10 mins to Cape Phrom Thep`,
    listing_type: "sale",
    status: "available",
    property_type: "Villa",
    area_slug: "rawai",
    price: 13900000,
    rent_period: null,
    bedrooms: 3,
    bathrooms: 4,
    living_area: 205,
    land_area: 240,
    address: "Nai Harn, Rawai, Mueang Phuket",
    latitude: 7.7721,
    longitude: 98.3147,
    features: [
      "Chanote title — Freehold",
      "Transfer fees 50/50",
      "Private pool (3 × 5.5 m)",
      "100m to Big C & Tops Supermarket",
      "3 km to Nai Harn Beach",
      "Fully furnished & equipped",
      "Rooftop area",
    ],
    is_featured: false,
    reference: "RW04",
    created_at: NOW,
    updated_at: NOW,
    images: imgs("rw-rattanaporn-villa-rw04", "rw-rattanaporn-villa-rw04", 24, 1),
  },
  {
    id: "rw-gan-villa-rw05",
    slug: "pool-villa-naiharn-rawai-rw05",
    title: "Pool Villa — 5 Mins to Nai Harn Beach",
    description: `A fully furnished 3-bedroom pool villa just 5 minutes to Nai Harn Beach and 8 minutes to Rawai Beach — move-in ready with everything included.

Property features:
• 3 Bedrooms
• 3 Bathrooms
• Private swimming pool
• European kitchen
• Spacious land: 50 sq.wah (198 sq.m.)
• Fully furnished (indoor & outdoor) + appliances
• Private parking
• Free water supply
• Air conditioning & curtains included
• Automatic gate included

Location:
• 5 mins to Nai Harn Beach
• 8 mins to Rawai Beach`,
    listing_type: "sale",
    status: "available",
    property_type: "Villa",
    area_slug: "rawai",
    price: 15500000,
    rent_period: null,
    bedrooms: 3,
    bathrooms: 3,
    living_area: null,
    land_area: 198,
    address: "Nai Harn, Rawai, Mueang Phuket",
    latitude: 7.7712,
    longitude: 98.3121,
    features: [
      "5 mins to Nai Harn Beach",
      "8 mins to Rawai Beach",
      "Private swimming pool",
      "Fully furnished + appliances",
      "Free water supply included",
      "Automatic gate included",
      "European kitchen",
    ],
    is_featured: false,
    reference: "RW05",
    created_at: NOW,
    updated_at: NOW,
    images: imgs("rw-gan-villa-rw05", "rw-gan-villa-rw05", 39, 1),
  },
  {
    id: "rw-jonathan-villa-rw06",
    slug: "brand-new-smart-home-villa-rawai-rw06",
    title: "Brand-New Smart Home Villa — Rawai",
    description: `Completed January 2025 and ready to move in — a high-spec 4-bedroom smart home villa in Rawai, available for rent or sale.

Rent: 65,000 THB/month (1-year contract) | Sale: 7.5M THB

Property features:
• 4 Bedrooms (all en-suite)
• 4 Bathrooms with rain showers
• Land: 52 sq.wah (≈210 sq.m.) | Building: ≈220 sq.m.
• Modern kitchen with island (Hafele appliances)
• Double garage | CCTV

Smart home features:
• Controlled via Sonoff & Google Home
• Smart curtains, lights & fans
• Solar panels (reduce electricity ~50%)
• 5 air conditioners (18,000 BTU each)
• Ceiling insulation for energy efficiency

Appliances included:
• 75" Smart TV, Haier side-by-side fridge
• Gas stove, hood, microwave, dishwasher, oven
• 3BB fibre internet with access points
• 1-year pest control service`,
    listing_type: "both",
    status: "available",
    property_type: "Villa",
    area_slug: "rawai",
    price: 7500000,
    rent_period: "month",
    bedrooms: 4,
    bathrooms: 4,
    living_area: 220,
    land_area: 210,
    address: "Rawai, Mueang Phuket",
    latitude: 7.7748,
    longitude: 98.3268,
    features: [
      "Smart home — Google Home & Sonoff",
      "Solar panels (50% electricity saving)",
      "Brand new — completed Jan 2025",
      "4 bedrooms all en-suite",
      "Double garage & CCTV",
      "Hafele kitchen appliances",
      "Rain showers in all bathrooms",
      "3BB fibre internet included",
    ],
    is_featured: true,
    reference: "RW06",
    created_at: NOW,
    updated_at: NOW,
    images: imgs("rw-jonathan-villa-rw06", "rw-jonathan-villa-rw06", 13, 1),
  },
  {
    id: "bt-taraburi-villa-bt12",
    slug: "spacious-luxury-house-cherng-talay-bt12",
    title: "Spacious Luxury Home — Cherng Talay, Bang Tao",
    description: `A rare large family home in Cherng Talay with a private pool and over 700 sq.m. of living space — ideal for large families, holiday home buyers or investors.

Property features:
• 6 Bedrooms
• 6 Bathrooms
• Private swimming pool (5 × 9 m)
• Land size: 800 sq.m.
• Built-up area: 700 sq.m.
• Fully furnished
• Common fee: 10,000 THB/month

Prime location in Cherng Talay with easy access to Laguna Phuket, Boat Avenue, Porto de Phuket, Bang Tao Beach and international schools.`,
    listing_type: "sale",
    status: "available",
    property_type: "Villa",
    area_slug: "bang-tao",
    price: 18500000,
    rent_period: null,
    bedrooms: 6,
    bathrooms: 6,
    living_area: 700,
    land_area: 800,
    address: "Cherng Talay, Thalang, Phuket",
    latitude: 7.9969,
    longitude: 98.2989,
    features: [
      "6 bedrooms — ideal for large families",
      "Private pool (5 × 9 m)",
      "700 sq.m. built-up area",
      "800 sq.m. land",
      "Fully furnished",
      "Near Laguna & Boat Avenue",
      "Near Bang Tao Beach",
    ],
    is_featured: true,
    reference: "BT12",
    created_at: NOW,
    updated_at: NOW,
    images: imgs("bt-taraburi-villa-bt12", "bt-taraburi-villa-bt12", 65, 1),
  },
  {
    id: "rw-sasinee-villa-rw07",
    slug: "villa-sasinee-pool-villa-rawai-rw07",
    title: "Villa Sasinee — Modern Tropical Pool Villa in Rawai",
    description: `Villa Sasinee — a stunning 5-bedroom pool villa surrounded by lush tropical gardens, offering privacy, space and resort-style living just minutes from Nai Harn and Rawai Beach.

Property details:
• 5 Bedrooms | 5 Ensuite Bathrooms
• Two separate buildings for extra privacy
• Fully furnished & move-in ready
• Spacious living area
• Large Western kitchen
• Laundry room
• Air conditioning throughout
• Covered parking
• Land size: 600 m²
• Built-up area: 450 m²

Outdoor features:
• 12m private swimming pool
• Jacuzzi & kids pool area
• Pool bar
• Sala & BBQ area
• Large tropical garden
• Relaxing outdoor living spaces

Prime location — Rawai:
• 7 minutes to Nai Harn Beach
• 9 minutes to Rawai Beach

Rental terms: 2 months security deposit + 1 month advance rent.`,
    listing_type: "rent",
    status: "available",
    property_type: "Villa",
    area_slug: "rawai",
    price: 150000, // monthly rent
    rent_price: null,
    rent_period: "month",
    bedrooms: 5,
    bathrooms: 5,
    living_area: 450,
    land_area: 600,
    address: "Rawai, Phuket (near Nai Harn & Rawai Beach)",
    latitude: 7.7741,
    longitude: 98.3245,
    features: [
      "5 ensuite bedrooms · two separate buildings",
      "12m private swimming pool",
      "Jacuzzi, kids pool & pool bar",
      "Sala & BBQ area",
      "Large tropical garden",
      "Fully furnished & move-in ready",
      "Large Western kitchen · laundry room",
      "7 mins to Nai Harn · 9 mins to Rawai Beach",
    ],
    is_featured: true,
    reference: "RW07",
    created_at: NOW,
    updated_at: NOW,
    images: imgs("rw-sasinee-villa-rw07", "rw-sasinee-villa-rw07", 73),
  },
];
