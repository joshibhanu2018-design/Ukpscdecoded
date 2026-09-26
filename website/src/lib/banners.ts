import { supabaseAdmin } from "./supabase";

export type Banner = {
  id: string;
  package_id: string | null;
  title: string;
  subtitle: string | null;
  gradient_from: string;
  gradient_to: string;
  sort_order: number;
  /** Designed banner, desktop: 1920×600 JPG/WebP under 200 KB. Empty → text banner. */
  image_url: string | null;
  /** Designed banner, phones: 1080×1080. Empty → `image_url` is used on phones too. */
  image_url_mobile: string | null;
};

function text(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

export async function getActiveBanners(): Promise<Banner[]> {
  // select("*") so the page keeps working before schema-phase16 adds the
  // image columns (they simply read as empty).
  const { data, error } = await supabaseAdmin()
    .from("banners")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[banners] Could not load banners:", error);
    return [];
  }
  return (data ?? []).map((b: Record<string, unknown>) => ({
    id: String(b.id),
    package_id: (b.package_id as string | null) ?? null,
    title: String(b.title ?? ""),
    subtitle: text(b.subtitle),
    gradient_from: text(b.gradient_from) ?? "#9a6a0c",
    gradient_to: text(b.gradient_to) ?? "#1b1a19",
    sort_order: Number(b.sort_order ?? 0),
    image_url: text(b.image_url),
    image_url_mobile: text(b.image_url_mobile),
  }));
}
