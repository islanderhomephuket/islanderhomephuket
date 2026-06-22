"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ADMIN_COOKIE, makeToken, verifyPassword } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

type ActionState = { error?: string; ok?: boolean };

/* ─────────────── Auth ─────────────── */

export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const password = String(formData.get("password") ?? "");
  if (!verifyPassword(password)) {
    return { error: "Incorrect password. Please try again." };
  }
  const store = await cookies();
  store.set(ADMIN_COOKIE, makeToken(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  redirect("/admin");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

/* ─────────────── Helpers ─────────────── */

function parseFeatures(raw: string): string[] {
  return raw
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseLines(raw: string): string[] {
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

/* ─────────────── Properties ─────────────── */

export async function savePropertyAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = createAdminClient();
  if (!supabase) {
    return {
      error:
        "Demo mode — connect Supabase (set SUPABASE_SERVICE_ROLE_KEY) to save changes.",
    };
  }

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Title is required." };

  const slug =
    String(formData.get("slug") ?? "").trim() || slugify(title);
  const priceRaw = String(formData.get("price") ?? "").trim();

  const record = {
    slug,
    title,
    description: String(formData.get("description") ?? ""),
    listing_type: String(formData.get("listing_type") ?? "sale"),
    status: String(formData.get("status") ?? "available"),
    property_type: String(formData.get("property_type") ?? "Villa"),
    area_slug: String(formData.get("area_slug") ?? ""),
    price: priceRaw ? Number(priceRaw) : null,
    rent_period: String(formData.get("rent_period") ?? "") || null,
    bedrooms: Number(formData.get("bedrooms") ?? 0),
    bathrooms: Number(formData.get("bathrooms") ?? 0),
    living_area: formData.get("living_area")
      ? Number(formData.get("living_area"))
      : null,
    land_area: formData.get("land_area")
      ? Number(formData.get("land_area"))
      : null,
    address: String(formData.get("address") ?? "") || null,
    latitude: formData.get("latitude") ? Number(formData.get("latitude")) : null,
    longitude: formData.get("longitude") ? Number(formData.get("longitude")) : null,
    features: parseFeatures(String(formData.get("features") ?? "")),
    is_featured: formData.get("is_featured") === "on",
    reference: String(formData.get("reference") ?? "") || null,
  };

  let propertyId = id;

  if (id) {
    const { error } = await supabase.from("properties").update(record).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { data, error } = await supabase
      .from("properties")
      .insert(record)
      .select("id")
      .single();
    if (error) return { error: error.message };
    propertyId = data.id;
  }

  // Replace images from the newline-separated URL list.
  const imageUrls = parseLines(String(formData.get("images") ?? ""));
  if (propertyId && imageUrls.length) {
    await supabase.from("property_images").delete().eq("property_id", propertyId);
    await supabase.from("property_images").insert(
      imageUrls.map((url, i) => ({
        property_id: propertyId,
        url,
        sort_order: i,
        is_cover: i === 0,
      })),
    );
  }

  revalidatePath("/admin/properties");
  revalidatePath("/buy");
  revalidatePath("/rent");
  redirect("/admin/properties");
}

export async function deletePropertyAction(formData: FormData) {
  const supabase = createAdminClient();
  const id = String(formData.get("id") ?? "");
  if (supabase && id) {
    await supabase.from("properties").delete().eq("id", id);
    revalidatePath("/admin/properties");
  }
  redirect("/admin/properties");
}

/* ─────────────── Blog ─────────────── */

export async function savePostAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = createAdminClient();
  if (!supabase) {
    return {
      error:
        "Demo mode — connect Supabase (set SUPABASE_SERVICE_ROLE_KEY) to save changes.",
    };
  }
  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Title is required." };

  const published = formData.get("published") === "on";
  const record = {
    slug: String(formData.get("slug") ?? "").trim() || slugify(title),
    title,
    excerpt: String(formData.get("excerpt") ?? ""),
    content: String(formData.get("content") ?? ""),
    cover_image: String(formData.get("cover_image") ?? "") || null,
    author: String(formData.get("author") ?? "Islander Home Team"),
    tags: parseFeatures(String(formData.get("tags") ?? "")),
    published,
    published_at: published ? new Date().toISOString() : null,
  };

  if (id) {
    const { error } = await supabase.from("blog_posts").update(record).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("blog_posts").insert(record);
    if (error) return { error: error.message };
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function deletePostAction(formData: FormData) {
  const supabase = createAdminClient();
  const id = String(formData.get("id") ?? "");
  if (supabase && id) {
    await supabase.from("blog_posts").delete().eq("id", id);
    revalidatePath("/admin/blog");
  }
  redirect("/admin/blog");
}

/* ─────────────── Leads ─────────────── */

export async function updateLeadStatusAction(formData: FormData) {
  const supabase = createAdminClient();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "new");
  if (supabase && id) {
    await supabase.from("leads").update({ status }).eq("id", id);
    revalidatePath("/admin/leads");
  }
  redirect("/admin/leads");
}
