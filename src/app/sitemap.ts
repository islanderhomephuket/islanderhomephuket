import type { MetadataRoute } from "next";
import { SITE, AREAS } from "@/lib/constants";
import { getProperties, getAllBlogSlugs } from "@/lib/data";
import { INDEXABLE_MIN_LISTINGS, matchesIntent } from "@/lib/seo";

/** Rebuilt hourly so newly published listings enter the sitemap on their own. */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes = ["", "/buy", "/rent", "/areas", "/about", "/contact", "/blog"].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    }),
  );

  const areaRoutes = AREAS.map((a) => ({
    url: `${base}/areas/${a.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const [properties, blogSlugs] = await Promise.all([
    getProperties(),
    getAllBlogSlugs(),
  ]);

  // Area × intent hubs — only the ones with enough stock to be worth indexing,
  // which is the same threshold their own `robots` metadata uses.
  const hubRoutes = AREAS.flatMap((a) =>
    (["rent", "buy"] as const).map((intent) => ({
      intent,
      slug: a.slug,
      count: properties.filter(
        (p) => p.area_slug === a.slug && matchesIntent(p, intent),
      ).length,
    })),
  )
    .filter((h) => h.count >= INDEXABLE_MIN_LISTINGS)
    .map((h) => ({
      url: `${base}/${h.intent}/${h.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.9,
    }));

  const propertyRoutes = properties
    .filter((p) => p.status !== "sold" && p.status !== "rented")
    .map((p) => ({
      url: `${base}/properties/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const blogRoutes = blogSlugs.map((slug) => ({
    url: `${base}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...hubRoutes,
    ...areaRoutes,
    ...propertyRoutes,
    ...blogRoutes,
  ];
}
