// Cloudflare Workers build (moved off Vercel 14/11/2026 after the Hobby plan paused the
// site for fair-use CPU).
//
// Page cache: prerendered pages are read from Workers static assets (free, no limits),
// and pages re-rendered by ISR are kept in the Cache API via the regional cache (also
// free, no daily write limit). A KV page cache was tried first and hit the Free plan's
// 1,000 writes/day on the very first deploy (2,008 prerendered entries). If the account
// moves to Workers Paid, switch to r2IncrementalCache for a single global cache.
//
// shouldLazilyUpdateOnCacheHit must stay false: when true, every cache hit re-reads the
// read-only static store and overwrites the newer re-rendered page with the build copy.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";
import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache";
import kvNextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/kv-next-tag-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";

export default defineCloudflareConfig({
  incrementalCache: withRegionalCache(staticAssetsIncrementalCache, {
    mode: "long-lived",
    shouldLazilyUpdateOnCacheHit: false,
  }),
  tagCache: kvNextTagCache,
  queue: doQueue,
});
