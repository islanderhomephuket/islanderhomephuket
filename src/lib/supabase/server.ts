import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_URL,
} from "./config";

/**
 * Server-side Supabase client bound to the request cookies.
 * Returns null when Supabase is not configured (DEMO mode).
 */
export async function createClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  let cookieStore: Awaited<ReturnType<typeof cookies>>;
  try {
    cookieStore = await cookies();
  } catch {
    // No request scope (build time, e.g. generateStaticParams) — cookie-less anon client.
    return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: { getAll: () => [], setAll: () => {} },
    });
  }

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component — safe to ignore when middleware refreshes sessions.
        }
      },
    },
  });
}

/**
 * Cookie-free anon client for the public, read-only pages.
 *
 * `createClient()` calls `cookies()`, which opts every page that touches it out of
 * static rendering — that was costing the public site ~3s TTFB per listing page.
 * Nothing public depends on a session, so read through this instead and let the
 * pages cache.
 */
export function createPublicClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: { getAll: () => [], setAll: () => {} },
  });
}

/**
 * Privileged server client using the service-role key for admin writes.
 * Bypasses RLS — only use in trusted server contexts (admin actions).
 */
export function createAdminClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  return createServerClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    cookies: { getAll: () => [], setAll: () => {} },
  });
}
