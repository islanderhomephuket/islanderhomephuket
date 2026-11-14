// Cloudflare Workers build (moved off Vercel 14/11/2026 after the Hobby plan paused the
// site for fair-use CPU). ISR pages live in R2, revalidatePath tags in KV, and
// background revalidation runs through a Durable Object queue.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import kvNextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/kv-next-tag-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";

export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
  tagCache: kvNextTagCache,
  queue: doQueue,
});
