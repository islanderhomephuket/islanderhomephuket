import type { MetadataRoute } from "next";
import { SITE, AREAS } from "@/lib/constants";
import { getAllPropertySlugs, getAllBlogSlugs } from "@/lib/data";

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

  const [propertySlugs, blogSlugs] = await Promise.all([
    getAllPropertySlugs(),
    getAllBlogSlugs(),
  ]);

  const propertyRoutes = propertySlugs.map((slug) => ({
    url: `${base}/properties/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogRoutes = blogSlugs.map((slug) => ({
    url: `${base}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...areaRoutes, ...propertyRoutes, ...blogRoutes];
}
