import type { NextConfig } from "next";

const supabaseHost = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
      : undefined;
  } catch {
    return undefined;
  }
})();

// Photos moved off Supabase Storage to Cloudflare R2 (23/9/2026) after Supabase
// restricted the project for exceed_storage_size_quota + exceed_egress_quota.
// R2 charges nothing for egress, so serving 600+ listings of photos cannot run up
// a bill again. Set NEXT_PUBLIC_R2_PUBLIC_BASE to the bucket's public origin.
const r2Host = (() => {
  try {
    return process.env.NEXT_PUBLIC_R2_PUBLIC_BASE
      ? new URL(process.env.NEXT_PUBLIC_R2_PUBLIC_BASE).hostname
      : undefined;
  } catch {
    return undefined;
  }
})();

/**
 * Listings removed as duplicates of another listing of the same property.
 * The hidden URL would otherwise 404 — and several were the oldest listings on the
 * site, the ones most likely to be indexed and linked. Send them to the survivor.
 * Add a line here whenever a duplicate is taken down; never for a listing that was
 * simply wrong (BTA-062 has no honest target and is left to 404).
 */
const DUPLICATE_LISTINGS: [string, string][] = [
  ["luxury-pool-villa-layan-bangtao-bt01", "bangtao-pool-villa-20m"],
  ["luxury-pool-villa-marnik-cherng-talay-bt05", "cherng-talay-marnik-pool-villa-1499m"],
  ["sierra-vista-luxury-pool-villas-bangtao-bt06", "sierra-vista-pool-villa-199m"],
  ["investment-pool-villa-pasak-laguna-bt09", "pasak-pool-villa-79m"],
  ["brand-new-smart-home-villa-rawai-rw06", "rawai-smart-home-villa-65k"],
  ["pool-villa-naiharn-rawai-rw05", "naiharn-pool-villa-155m"],
  ["modern-pool-villa-nai-harn-rawai-rw04", "rawai-modern-pool-villa-139m"],
  ["chalong-house-109m-2", "chalong-house-109m"],
  ["cherng-talay-pool-villa-220k", "pasak3-chernglay-pool-villa-220k"],
];

const nextConfig: NextConfig = {
  async redirects() {
    return DUPLICATE_LISTINGS.map(([from, to]) => ({
      source: `/properties/${from}`,
      destination: `/properties/${to}`,
      permanent: true,
    }));
  },
  images: {
    // Vercel's image optimizer hit its account quota and started returning 402
    // for EVERY image (including local ones), which blanked the whole site.
    // Photos are already resized on upload (1600px q80 mozjpeg), so serving them
    // straight from Supabase costs little and cannot be rate-limited.
    // Flip back to false if the Vercel plan is upgraded.
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      ...(supabaseHost
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHost,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
      {
        protocol: "https" as const,
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      ...(r2Host ? [{ protocol: "https" as const, hostname: r2Host }] : []),
      // R2's development origin, and a custom image subdomain if one is added later.
      { protocol: "https" as const, hostname: "*.r2.dev" },
      { protocol: "https" as const, hostname: "img.islanderhomephuket.com" },
      { protocol: "https" as const, hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
