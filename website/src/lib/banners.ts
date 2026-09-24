import { supabaseAdmin } from "./supabase";

export type Banner = {
  id: string;
  package_id: string | null;
  title: string;
  subtitle: string | null;
  gradient_from: string;
  gradient_to: string;
  sort_order: number;
};

export async function getActiveBanners(): Promise<Banner[]> {
  const { data, error } = await supabaseAdmin()
    .from("banners")
    .select("id, package_id, title, subtitle, gradient_from, gradient_to, sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[banners] Could not load banners:", error);
    return [];
  }
  return data ?? [];
}
