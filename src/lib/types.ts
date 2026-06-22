/** Domain & database types for Islander Home Phuket. */

export type ListingType = "sale" | "rent" | "both";

export type PropertyStatus =
  | "available"
  | "reserved"
  | "sold"
  | "rented"
  | "draft";

export interface PropertyImage {
  id: string;
  property_id: string;
  url: string;
  alt: string | null;
  sort_order: number;
  is_cover: boolean;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  listing_type: ListingType;
  status: PropertyStatus;
  property_type: string; // Villa, Condominium, etc.
  area_slug: string; // references AREAS
  price: number | null; // sale price (for "sale"/"both") or monthly rent (for "rent")
  rent_price?: number | null; // monthly rent when listing_type is "both"
  rent_period: string | null; // "month" | "year" | "day"
  bedrooms: number;
  bathrooms: number;
  living_area: number | null; // m²
  land_area: number | null; // m²
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  features: string[];
  is_featured: boolean;
  reference: string | null;
  created_at: string;
  updated_at: string;
  // Joined / computed
  images?: PropertyImage[];
  cover_image?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  property_id: string | null;
  property_title: string | null;
  source: string; // "contact-page" | "property-detail" | "home" ...
  status: "new" | "contacted" | "qualified" | "closed";
  created_at: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // markdown / html
  cover_image: string | null;
  author: string;
  tags: string[];
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PropertyFilters {
  listingType?: ListingType;
  area?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  query?: string;
  featured?: boolean;
  sort?: "newest" | "price-asc" | "price-desc";
}
