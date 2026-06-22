import { cache } from "react";
import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";
import {
  MOCK_PROPERTIES,
  MOCK_BLOG_POSTS,
  MOCK_LEADS,
} from "./mock-data";
import { NOTION_PROPERTIES } from "./notion-data";
import { MANUAL_LISTINGS } from "./manual-listings";
import type { BlogPost, Lead, Property, PropertyFilters } from "./types";

/**
 * Listings shown when Supabase isn't configured.
 * Combines hand-curated houses (added one-by-one) with any Notion imports.
 */
const DEMO_PROPERTIES: Property[] = [...MANUAL_LISTINGS, ...NOTION_PROPERTIES];
void MOCK_PROPERTIES;

/** Whether the live database is wired up. */
export function isLive(): boolean {
  return isSupabaseConfigured();
}

function withCover(p: Property): Property {
  const cover =
    p.cover_image ??
    p.images?.find((i) => i.is_cover)?.url ??
    p.images?.[0]?.url ??
    "/properties/villa-1.png";
  return { ...p, cover_image: cover };
}

/** Price relevant to the current filter context (sale vs rent) for dual listings. */
function effectivePrice(p: Property, ctx?: "sale" | "rent" | "both"): number {
  if (p.listing_type === "both" && ctx === "rent") return p.rent_price ?? 0;
  return p.price ?? 0;
}

function applyFilters(list: Property[], f: PropertyFilters = {}): Property[] {
  let out = list.filter((p) => p.status !== "draft");

  // "both" listings appear under both Buy and Rent.
  if (f.listingType)
    out = out.filter(
      (p) => p.listing_type === f.listingType || p.listing_type === "both",
    );
  if (f.area) out = out.filter((p) => p.area_slug === f.area);
  if (f.propertyType)
    out = out.filter((p) => p.property_type === f.propertyType);
  if (f.minPrice != null)
    out = out.filter((p) => effectivePrice(p, f.listingType) >= f.minPrice!);
  if (f.maxPrice != null)
    out = out.filter((p) => effectivePrice(p, f.listingType) <= f.maxPrice!);
  if (f.bedrooms != null)
    out = out.filter((p) => p.bedrooms >= f.bedrooms!);
  if (f.featured) out = out.filter((p) => p.is_featured);
  if (f.query) {
    const q = f.query.toLowerCase();
    out = out.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.area_slug.toLowerCase().includes(q) ||
        (p.reference ?? "").toLowerCase().includes(q),
    );
  }

  switch (f.sort) {
    case "price-asc":
      out = [...out].sort(
        (a, b) => effectivePrice(a, f.listingType) - effectivePrice(b, f.listingType),
      );
      break;
    case "price-desc":
      out = [...out].sort(
        (a, b) => effectivePrice(b, f.listingType) - effectivePrice(a, f.listingType),
      );
      break;
    default:
      out = [...out].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
  }
  return out.map(withCover);
}

/* ─────────────────────────── Properties ─────────────────────────── */

export const getProperties = cache(
  async (filters: PropertyFilters = {}): Promise<Property[]> => {
    const supabase = await createClient();
    if (!supabase) return applyFilters(DEMO_PROPERTIES, filters);

    let query = supabase
      .from("properties")
      .select("*, images:property_images(*)")
      .neq("status", "draft");

    if (filters.listingType) query = query.eq("listing_type", filters.listingType);
    if (filters.area) query = query.eq("area_slug", filters.area);
    if (filters.propertyType) query = query.eq("property_type", filters.propertyType);
    if (filters.minPrice != null) query = query.gte("price", filters.minPrice);
    if (filters.maxPrice != null) query = query.lte("price", filters.maxPrice);
    if (filters.bedrooms != null) query = query.gte("bedrooms", filters.bedrooms);
    if (filters.featured) query = query.eq("is_featured", true);
    if (filters.query) query = query.ilike("title", `%${filters.query}%`);

    if (filters.sort === "price-asc") query = query.order("price", { ascending: true });
    else if (filters.sort === "price-desc") query = query.order("price", { ascending: false });
    else query = query.order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error || !data) return applyFilters(DEMO_PROPERTIES, filters);
    return (data as Property[]).map(withCover);
  },
);

export const getFeaturedProperties = cache(
  async (limit = 6): Promise<Property[]> => {
    const all = await getProperties({ featured: true });
    return all.slice(0, limit);
  },
);

export const getPropertyBySlug = cache(
  async (slug: string): Promise<Property | null> => {
    const supabase = await createClient();
    if (!supabase) {
      const found = DEMO_PROPERTIES.find((p) => p.slug === slug);
      return found ? withCover(found) : null;
    }
    const { data, error } = await supabase
      .from("properties")
      .select("*, images:property_images(*)")
      .eq("slug", slug)
      .single();
    if (error || !data) {
      const found = DEMO_PROPERTIES.find((p) => p.slug === slug);
      return found ? withCover(found) : null;
    }
    return withCover(data as Property);
  },
);

export const getPropertyById = cache(
  async (id: string): Promise<Property | null> => {
    const supabase = await createClient();
    if (!supabase) {
      const found = DEMO_PROPERTIES.find((p) => p.id === id);
      return found ? withCover(found) : null;
    }
    const { data, error } = await supabase
      .from("properties")
      .select("*, images:property_images(*)")
      .eq("id", id)
      .single();
    if (error || !data) {
      const found = DEMO_PROPERTIES.find((p) => p.id === id);
      return found ? withCover(found) : null;
    }
    return withCover(data as Property);
  },
);

export const getRelatedProperties = cache(
  async (property: Property, limit = 3): Promise<Property[]> => {
    const all = await getProperties({ listingType: property.listing_type });
    return all
      .filter((p) => p.id !== property.id)
      .sort((a, b) => {
        const aScore = a.area_slug === property.area_slug ? 0 : 1;
        const bScore = b.area_slug === property.area_slug ? 0 : 1;
        return aScore - bScore;
      })
      .slice(0, limit);
  },
);

export const getPropertiesByArea = cache(
  async (areaSlug: string): Promise<Property[]> => {
    return getProperties({ area: areaSlug });
  },
);

/** All property slugs (for static params / sitemap). */
export async function getAllPropertySlugs(): Promise<string[]> {
  const all = await getProperties();
  return all.map((p) => p.slug);
}

/* ─────────────────────────── Blog ─────────────────────────── */

export const getBlogPosts = cache(
  async (opts: { includeUnpublished?: boolean } = {}): Promise<BlogPost[]> => {
    const supabase = await createClient();
    if (!supabase) {
      return MOCK_BLOG_POSTS.filter(
        (p) => opts.includeUnpublished || p.published,
      ).sort(
        (a, b) =>
          new Date(b.published_at ?? b.created_at).getTime() -
          new Date(a.published_at ?? a.created_at).getTime(),
      );
    }
    let query = supabase.from("blog_posts").select("*");
    if (!opts.includeUnpublished) query = query.eq("published", true);
    const { data, error } = await query.order("published_at", {
      ascending: false,
      nullsFirst: false,
    });
    if (error || !data)
      return MOCK_BLOG_POSTS.filter((p) => p.published);
    return data as BlogPost[];
  },
);

export const getBlogPostBySlug = cache(
  async (slug: string): Promise<BlogPost | null> => {
    const supabase = await createClient();
    if (!supabase) {
      return MOCK_BLOG_POSTS.find((p) => p.slug === slug) ?? null;
    }
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .single();
    if (error || !data)
      return MOCK_BLOG_POSTS.find((p) => p.slug === slug) ?? null;
    return data as BlogPost;
  },
);

export const getBlogPostById = cache(
  async (id: string): Promise<BlogPost | null> => {
    const supabase = await createClient();
    if (!supabase) {
      return MOCK_BLOG_POSTS.find((p) => p.id === id) ?? null;
    }
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .single();
    if (error || !data)
      return MOCK_BLOG_POSTS.find((p) => p.id === id) ?? null;
    return data as BlogPost;
  },
);

export async function getAllBlogSlugs(): Promise<string[]> {
  const posts = await getBlogPosts();
  return posts.map((p) => p.slug);
}

/* ─────────────────────────── Leads ─────────────────────────── */

export const getLeads = cache(async (): Promise<Lead[]> => {
  const supabase = await createClient();
  if (!supabase) return MOCK_LEADS;
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return MOCK_LEADS;
  return data as Lead[];
});
