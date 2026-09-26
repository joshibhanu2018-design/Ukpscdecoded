import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  formatINR,
  getActivePackages,
  getOwnedPackageIds,
  getPackageBySlug,
  getPackageIncludes,
  getSeatsRemaining,
  getUserActiveEnrollments,
} from "@/lib/packages";
import { getPriceInfo, formatFoundingLabel } from "@/lib/pricing";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";
import CheckoutForm from "@/components/CheckoutForm";
import { supabaseAdmin } from "@/lib/supabase";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  return { title: pkg ? `Checkout — ${pkg.package_name}` : "Checkout" };
}

export default async function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) notFound();

  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserFromSession(token);
  if (!user) {
    redirect(`/student/login?next=${encodeURIComponent(`/checkout/${slug}`)}`);
  }

  const [allPackages, includes] = await Promise.all([getActivePackages(), getPackageIncludes()]);
  const enrollments = await getUserActiveEnrollments(user.id);
  const owned = getOwnedPackageIds(enrollments, includes, allPackages).has(pkg.id);
  if (owned) {
    redirect("/test-platform?already=owned");
  }

  if (process.env.PAYMENTS_ENABLED !== "true") {
    redirect(`/courses/${slug}`);
  }

  const seatsRemaining = pkg.seats_total != null ? await getSeatsRemaining(pkg.id, pkg.seats_total) : null;
  if (seatsRemaining != null && seatsRemaining <= 0) {
    redirect(`/courses/${slug}`);
  }

  const priceInfo = getPriceInfo(pkg);
  const { data: creditRow } = await supabaseAdmin()
    .from("users")
    .select("store_credit_paise")
    .eq("id", user.id)
    .maybeSingle();
  const storeCreditPaise = Number(creditRow?.store_credit_paise ?? 0);
  const foundingLabel = formatFoundingLabel(priceInfo);

  return (
    <div className="bg-graphite-950 px-4 py-10">
      <div className="container-custom mx-auto max-w-lg">
        <h1 className="mb-6 text-2xl font-bold text-white">
          Checkout
        </h1>

        <div className="rounded-xl border border-graphite-800 bg-graphite-900/60 p-5">
          <p className="text-sm text-graphite-300">You are purchasing</p>
          <p className="mt-1 text-lg font-bold text-white">{pkg.package_name}</p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{formatINR(priceInfo.amount)}</span>
            {priceInfo.isFounding && priceInfo.regularPrice && (
              <span className="text-sm text-graphite-300 line-through">{formatINR(priceInfo.regularPrice)}</span>
            )}
          </div>
          {foundingLabel && <p className="mt-1 text-xs font-medium text-saffron-300">{foundingLabel}</p>}
          {seatsRemaining != null && (
            <p className="mt-1 text-xs text-graphite-300">{seatsRemaining} seats left</p>
          )}
        </div>

        <div className="mt-6">
          <CheckoutForm
            pkg={{ id: pkg.id, package_name: pkg.package_name, basePrice: priceInfo.amount }}
            userName={user.full_name}
            userEmail={user.email}
            userPhone={user.phone}
            storeCreditPaise={storeCreditPaise}
          />
        </div>
      </div>
    </div>
  );
}
