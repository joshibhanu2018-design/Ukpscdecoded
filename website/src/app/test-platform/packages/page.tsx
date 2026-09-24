import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";
import {
  computeSavings,
  formatClassDate,
  getActivePackages,
  getOwnedPackageIds,
  getPackageIncludes,
  getSeatsRemaining,
  getUserActiveEnrollments,
  type Package,
} from "@/lib/packages";
import { getPriceInfo } from "@/lib/pricing";
import PackageCard from "@/components/PackageCard";

export const metadata: Metadata = {
  title: "Package Store",
  description: "Test series, crash course and combo packages for UKPSC preparation.",
};

const SECTION_LABELS: Record<string, { title: string; hindiTitle: string }> = {
  test_series: { title: "Test Series", hindiTitle: "टेस्ट सीरीज" },
  combo_bundle: { title: "Combo Bundles", hindiTitle: "कॉम्बो बंडल" },
  video_course: { title: "Crash Course", hindiTitle: "क्रैश कोर्स" },
  mentorship: { title: "Mentorship", hindiTitle: "मेंटरशिप" },
};

function Section({
  title,
  hindiTitle,
  packages,
  ownedIds,
  includes,
  allPackages,
  bestValueId,
  userEmail,
  userName,
  paymentsEnabled,
  seatsByPackage,
}: {
  title: string;
  hindiTitle: string;
  packages: Package[];
  ownedIds: Set<string>;
  includes: { combo_package_id: string; included_package_id: string }[];
  allPackages: Package[];
  bestValueId?: string;
  userEmail: string;
  userName: string;
  paymentsEnabled: boolean;
  seatsByPackage: Map<string, number>;
}) {
  if (packages.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-bold text-white">
        {hindiTitle} <span className="text-slate-400">/ {title}</span>
      </h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => {
          const classStart =
            pkg.package_type === "video_course"
              ? formatClassDate((pkg.metadata?.class_start as string | undefined) ?? undefined)
              : null;
          const seatsRemaining = seatsByPackage.get(pkg.id) ?? null;

          return (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              priceInfo={getPriceInfo(pkg)}
              savings={computeSavings(pkg, includes, allPackages)}
              owned={ownedIds.has(pkg.id)}
              isBestValue={pkg.id === bestValueId}
              classStartLabel={classStart}
              userEmail={userEmail}
              userName={userName}
              paymentsEnabled={paymentsEnabled}
              seatsRemaining={seatsRemaining}
            />
          );
        })}
      </div>
    </section>
  );
}

export default async function PackageStorePage() {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserFromSession(token);
  if (!user) redirect("/student/login");

  const [allPackages, includes, enrollments] = await Promise.all([
    getActivePackages(),
    getPackageIncludes(),
    getUserActiveEnrollments(user.id),
  ]);

  const ownedIds = getOwnedPackageIds(enrollments, includes, allPackages);
  const paymentsEnabled = process.env.PAYMENTS_ENABLED === "true";

  const seatedPackages = allPackages.filter((p) => p.seats_total != null);
  const seatsEntries = await Promise.all(
    seatedPackages.map(async (p) => [p.id, await getSeatsRemaining(p.id, p.seats_total!)] as const)
  );
  const seatsByPackage = new Map(seatsEntries);

  const testSeries = allPackages.filter((p) => p.package_type === "test_series");

  const bestValue = testSeries
    .map((p) => ({ id: p.id, savings: computeSavings(p, includes, allPackages) }))
    .filter((x) => x.savings)
    .sort((a, b) => (b.savings!.savingPercent ?? 0) - (a.savings!.savingPercent ?? 0))[0];

  // Section order (which heading appears first) is derived from data, not
  // hardcoded — each type's section sorts by the lowest sort_order among
  // its packages, so reordering (e.g. supabase/update-package-sort-order.sql)
  // moves whole sections without any code change.
  const sectionsByType = new Map<string, Package[]>();
  for (const pkg of allPackages) {
    const list = sectionsByType.get(pkg.package_type);
    if (list) list.push(pkg);
    else sectionsByType.set(pkg.package_type, [pkg]);
  }
  const sections = [...sectionsByType.entries()]
    .map(([type, packages]) => ({
      type,
      packages,
      minSortOrder: Math.min(...packages.map((p) => p.sort_order)),
      label: SECTION_LABELS[type] ?? { title: type, hindiTitle: type },
    }))
    .sort((a, b) => a.minSortOrder - b.minSortOrder);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            पैकेज स्टोर <span className="text-slate-400">/ Package Store</span>
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            अपनी तैयारी के लिए सही प्लान चुनें{" "}
            <span className="text-slate-500">/ Choose the right plan for your UKPSC preparation.</span>
          </p>
        </div>

        {allPackages.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center text-slate-400">
            No packages are available yet. Check back soon.
          </div>
        ) : (
          sections.map((s) => (
            <Section
              key={s.type}
              title={s.label.title}
              hindiTitle={s.label.hindiTitle}
              packages={s.packages}
              ownedIds={ownedIds}
              includes={includes}
              allPackages={allPackages}
              bestValueId={bestValue?.id}
              userEmail={user.email}
              userName={user.full_name}
              paymentsEnabled={paymentsEnabled}
              seatsByPackage={seatsByPackage}
            />
          ))
        )}
      </div>
    </div>
  );
}
