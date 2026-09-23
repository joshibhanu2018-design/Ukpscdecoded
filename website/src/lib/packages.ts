import { supabaseAdmin } from "./supabase";

export type PackageType = "test_series" | "video_course" | "combo_bundle" | string;

export type Package = {
  id: string;
  package_name: string;
  description: string | null;
  price: number;
  package_type: PackageType;
  total_tests: number | null;
  total_questions: number | null;
  access_valid_till: string | null;
  validity_days: number | null;
  metadata: Record<string, unknown> | null;
  sort_order: number;
  is_active: boolean;
};

export type PackageInclude = {
  combo_package_id: string;
  included_package_id: string;
};

export type Enrollment = {
  id: string;
  user_id: string;
  package_id: string;
  status: string;
  access_valid_till: string | null;
  attempts_used: Record<string, unknown> | null;
  created_at: string;
};

export async function getActivePackages(): Promise<Package[]> {
  const { data, error } = await supabaseAdmin()
    .from("packages")
    .select(
      "id, package_name, description, price, package_type, total_tests, total_questions, access_valid_till, validity_days, metadata, sort_order, is_active"
    )
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`Could not load packages: ${error.message}`);
  return data ?? [];
}

export async function getPackageIncludes(): Promise<PackageInclude[]> {
  const { data, error } = await supabaseAdmin()
    .from("package_includes")
    .select("combo_package_id, included_package_id");

  if (error) throw new Error(`Could not load package_includes: ${error.message}`);
  return data ?? [];
}

export async function getUserActiveEnrollments(userId: string): Promise<Enrollment[]> {
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabaseAdmin()
    .from("enrollments")
    .select("id, user_id, package_id, status, access_valid_till, attempts_used, created_at")
    .eq("user_id", userId)
    .eq("status", "active")
    .or(`access_valid_till.is.null,access_valid_till.gte.${today}`);

  if (error) throw new Error(`Could not load enrollments: ${error.message}`);
  return data ?? [];
}

/**
 * Package IDs the user has access to — direct enrollments, plus (for a
 * combo_bundle enrollment) every package it includes. A package_includes
 * row is only entitlement-granting when its parent is a combo_bundle;
 * for a monolithic package like Premium Bundle, rows in that table are
 * informational only (used for the savings calculation below).
 */
export function getOwnedPackageIds(
  enrollments: Enrollment[],
  includes: PackageInclude[],
  allPackages: Package[]
): Set<string> {
  const owned = new Set<string>();
  const byId = new Map(allPackages.map((p) => [p.id, p]));

  for (const e of enrollments) {
    owned.add(e.package_id);
    const pkg = byId.get(e.package_id);
    if (pkg?.package_type === "combo_bundle") {
      for (const inc of includes) {
        if (inc.combo_package_id === e.package_id) owned.add(inc.included_package_id);
      }
    }
  }

  return owned;
}

/**
 * The enrollment that actually grants access to `packageId` — either a
 * direct enrollment on it, or (if none) a combo enrollment that includes
 * it. Used to show the real valid-till date for content reached via a
 * combo, since the enrollment row lives on the combo's package_id.
 */
export function getPackageAccessSource(
  packageId: string,
  enrollments: Enrollment[],
  includes: PackageInclude[]
): Enrollment | null {
  const direct = enrollments.find((e) => e.package_id === packageId);
  if (direct) return direct;

  const comboIds = new Set(
    includes.filter((i) => i.included_package_id === packageId).map((i) => i.combo_package_id)
  );
  return enrollments.find((e) => comboIds.has(e.package_id)) ?? null;
}

export type Savings = { componentTotal: number; saving: number; savingPercent: number };

/**
 * Real saving vs buying a package's components separately, computed
 * purely from package_includes + live prices — never a stored/invented
 * number.
 */
export function computeSavings(
  pkg: Package,
  includes: PackageInclude[],
  allPackages: Package[]
): Savings | null {
  const includedIds = includes
    .filter((i) => i.combo_package_id === pkg.id)
    .map((i) => i.included_package_id);
  if (includedIds.length === 0) return null;

  const byId = new Map(allPackages.map((p) => [p.id, p]));
  const componentTotal = includedIds.reduce((sum, id) => sum + Number(byId.get(id)?.price ?? 0), 0);
  const saving = componentTotal - Number(pkg.price);
  if (componentTotal <= 0 || saving <= 0) return null;

  return { componentTotal, saving, savingPercent: Math.round((saving / componentTotal) * 100) };
}

export function formatINR(amount: number): string {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

/**
 * Formats a date/timestamp string as "2 October 2026". Accepts both a
 * plain date ("2026-10-02", from packages.access_valid_till or
 * metadata.class_start) and a full timestamp ("2026-12-31T00:00:00",
 * from enrollments.access_valid_till) — appending a time suffix only
 * when one isn't already present avoids producing an invalid double-"T"
 * string.
 */
export function formatDateLabel(value: string | null | undefined): string | null {
  if (!value) return null;
  const d = new Date(value.includes("T") ? value : `${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export const formatClassDate = formatDateLabel;
