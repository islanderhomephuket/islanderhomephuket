import type { MetadataRoute } from "next";
import { SITE, AREAS } from "@/lib/constants";
import { getProperties, getAllBlogSlugs } from "@/lib/data";
import { INDEXABLE_MIN_LISTINGS, matchesIntent } from "@/lib/seo";
import {
  PROPERTY_TYPE_PAGES,
  isPropertyTypeMatch,
} from "@/lib/property-type-pages";
import { allCombos, comboPath, comboProperties } from "@/lib/area-type-pages";
import { PRICE_BAND_PAGES, isInPriceBand } from "@/lib/price-band-pages";

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

  // Property-type hubs — /buy/villas, /rent/condos — on the same stock threshold.
  const typeRoutes = PROPERTY_TYPE_PAGES.flatMap((t) =>
    (["rent", "buy"] as const).map((intent) => ({
      intent,
      slug: t.slug,
      count: properties.filter(
        (p) => matchesIntent(p, intent) && isPropertyTypeMatch(p, t),
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

  // Area × type combinations — "villas for sale in Rawai", "condos for rent in
  // Kathu" — listed only where the stock clears the threshold the pages index on.
  const comboRoutes = (["rent", "buy"] as const).flatMap((intent) =>
    allCombos()
      .map((combo) => ({
        intent,
        combo,
        count: comboProperties(properties, combo, intent).length,
      }))
      .filter((c) => c.count >= INDEXABLE_MIN_LISTINGS)
      .map((c) => ({
        url: `${base}${comboPath(c.intent, c.combo)}`,
        lastModified: now,
        changeFrequency: "daily" as const,
        priority: 0.8,
      })),
  );

  // Budget pages — /buy/villas-under-15m, /rent/condos-under-20k.
  const bandRoutes = PRICE_BAND_PAGES.map((band) => ({
    band,
    count: properties.filter(
      (p) => matchesIntent(p, band.intent) && isInPriceBand(p, band),
    ).length,
  }))
    .filter((b) => b.count >= INDEXABLE_MIN_LISTINGS)
    .map((b) => ({
      url: `${base}/${b.band.intent}/${b.band.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
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
    ...typeRoutes,
    ...comboRoutes,
    ...bandRoutes,
    ...areaRoutes,
    ...propertyRoutes,
    ...blogRoutes,
  ];
}
