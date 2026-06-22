import { cookies } from "next/headers";

/**
 * Lightweight cookie-based admin gate.
 *
 * This protects the admin UI with a shared password (ADMIN_PASSWORD).
 * It is intentionally simple so the dashboard works out of the box.
 * For production multi-user auth, swap this for Supabase Auth
 * (the RLS policies in supabase/schema.sql already expect authenticated users).
 */

export const ADMIN_COOKIE = "ih_admin_session";

function expectedToken(): string {
  const pw = process.env.ADMIN_PASSWORD || "changeme";
  // Deterministic, non-reversible-ish token derived from the password.
  return Buffer.from(`islander-home:${pw}`).toString("base64url");
}

export function makeToken(password: string): string {
  return Buffer.from(`islander-home:${password}`).toString("base64url");
}

export function verifyPassword(password: string): boolean {
  const pw = process.env.ADMIN_PASSWORD || "changeme";
  return password === pw;
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === expectedToken();
}
