import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Check, Clock, FileText, PlayCircle, ShieldCheck } from "lucide-react";
import {
  computeSavings,
  formatDateLabel,
  formatINR,
  getActivePackages,
  getOwnedPackageIds,
  getPackageBySlug,
  getPackageIncludes,
  getSeatsRemaining,
  getUserActiveEnrollments,
} from "@/lib/packages";
import { formatFoundingLabel, getPriceInfo } from "@/lib/pricing";
import { getPackageTestList } from "@/lib/tests";
import FreeSampleTest from "@/components/FreeSampleTest";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) return {};
  return {
    title: pkg.package_name,
    description: pkg.description ?? `${pkg.package_name} — UKPSC Decoded`,
  };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) notFound();

  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserFromSession(token);

  const [allPackages, includes, testList] = await Promise.all([
    getActivePackages(),
    getPackageIncludes(),
    getPackageTestList(pkg.id),
  ]);
  const enrollments = user ? await getUserActiveEnrollments(user.id) : [];
  const owned = getOwnedPackageIds(enrollments, includes, allPackages).has(pkg.id);

  const priceInfo = getPriceInfo(pkg);
  const foundingLabel = formatFoundingLabel(priceInfo);
  const savings = computeSavings(pkg, includes, allPackages);
  const seatsRemaining = pkg.seats_total != null ? await getSeatsRemaining(pkg.id, pkg.seats_total) : null;
  const validityLabel = pkg.access_valid_till
    ? formatDateLabel(pkg.access_valid_till)
    : pkg.validity_days
      ? `${pkg.validity_days} दिन / ${pkg.validity_days} days`
      : null;

  const testsBySubject = testList.reduce<Record<string, typeof testList>>((acc, t) => {
    const key = t.subject ?? "अन्य / Other";
    (acc[key] ??= []).push(t);
    return acc;
  }, {});

  const checkoutHref = `/checkout/${pkg.slug}`;

  return (
    <div className="bg-slate-950 pb-28 lg:pb-0">
      {/* Sticky Buy bar — top on desktop, bottom on mobile */}
      <div className="sticky top-16 z-40 hidden border-b border-slate-800 bg-slate-900/95 backdrop-blur lg:block">
        <div className="container-custom mx-auto flex items-center justify-between px-4 py-3">
          <span className="font-semibold text-white">{pkg.package_name}</span>
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold text-white">{formatINR(priceInfo.amount)}</span>
            {owned ? (
              <Link
                href="/test-platform"
                className="rounded-lg border border-green-500/40 bg-green-500/10 px-5 py-2 text-sm font-bold text-green-400"
              >
                Purchased — Go to My Courses
              </Link>
            ) : (
              <Link
                href={checkoutHref}
                className="rounded-lg bg-yellow-500 px-6 py-2 text-sm font-bold text-slate-900 hover:bg-yellow-400"
              >
                Buy Now
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800 bg-slate-900/95 p-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-slate-300">कीमत / Price</p>
            <p className="text-lg font-bold text-white">{formatINR(priceInfo.amount)}</p>
          </div>
          {owned ? (
            <Link
              href="/test-platform"
              className="flex-1 rounded-lg border border-green-500/40 bg-green-500/10 px-4 py-3 text-center text-sm font-bold text-green-400"
            >
              Purchased — My Courses
            </Link>
          ) : (
            <Link
              href={checkoutHref}
              className="flex-1 rounded-lg bg-yellow-500 px-4 py-3 text-center text-sm font-bold text-slate-900"
            >
              Buy Now
            </Link>
          )}
        </div>
      </div>

      {/* Header */}
      <div
        className="px-4 py-10 sm:py-14"
        style={{ background: "linear-gradient(135deg, #f59307, #78300d)" }}
      >
        <div className="container-custom mx-auto">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">{pkg.package_name}</h1>
          {pkg.description && <p className="mt-2 max-w-2xl text-sm text-white/90 sm:text-base">{pkg.description}</p>}
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <span className="text-3xl font-extrabold text-white">{formatINR(priceInfo.amount)}</span>
            {priceInfo.isFounding && priceInfo.regularPrice && (
              <span className="text-sm text-white/70 line-through">{formatINR(priceInfo.regularPrice)}</span>
            )}
            {savings && (
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                {savings.savingPercent}% बचत / saving
              </span>
            )}
            {seatsRemaining != null && (
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                {seatsRemaining} सीटें बाकी / seats left
              </span>
            )}
          </div>
          {foundingLabel && <p className="mt-2 text-xs font-medium text-white/90">{foundingLabel}</p>}
          <div className="mt-6 hidden sm:block">
            {owned ? (
              <Link
                href="/test-platform"
                className="inline-block rounded-lg border border-white/40 bg-white/10 px-6 py-3 text-sm font-bold text-white"
              >
                Purchased — Go to My Courses
              </Link>
            ) : (
              <Link
                href={checkoutHref}
                className="inline-block rounded-lg bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800"
              >
                Buy Now / अभी खरीदें
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container-custom mx-auto grid grid-cols-1 gap-8 px-4 py-10 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          {/* Highlights */}
          {pkg.highlights.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-bold text-white">इसमें क्या मिलेगा / What&apos;s Included</h2>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {pkg.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-200">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-500" /> {h}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <FreeSampleTest compact />

          {/* Free demo placeholder */}
          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center gap-3">
              <PlayCircle className="h-6 w-6 text-yellow-500" />
              <div>
                <p className="font-semibold text-white">फ्री डेमो देखें / Watch Free Demo</p>
                <p className="text-xs text-slate-300">जल्द आ रहा है / Coming soon</p>
              </div>
            </div>
          </section>

          {/* Curriculum */}
          {pkg.curriculum.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-bold text-white">पाठ्यक्रम / Curriculum</h2>
              <ol className="space-y-2">
                {pkg.curriculum.map((c, i) => (
                  <li key={i} className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-200">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-yellow-400">
                      {i + 1}
                    </span>
                    {c.title}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Test list */}
          {testList.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-bold text-white">
                टेस्ट लिस्ट / Test List <span className="text-slate-300">({testList.length})</span>
              </h2>
              <div className="space-y-6">
                {Object.entries(testsBySubject).map(([subject, tests]) => (
                  <div key={subject}>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-300">{subject}</p>
                    <div className="space-y-2">
                      {tests.map((t) => {
                        const releaseLabel = t.release_at ? formatDateLabel(t.release_at) : null;
                        const isReleased = t.release_at ? new Date(t.release_at) <= new Date() : true;
                        return (
                          <div
                            key={t.id}
                            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm"
                          >
                            <span className="font-medium text-slate-200">{t.test_name}</span>
                            <div className="flex items-center gap-3 text-xs text-slate-300">
                              {t.total_questions && <span>{t.total_questions} प्रश्न / Q</span>}
                              {t.duration_minutes && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" /> {t.duration_minutes} min
                                </span>
                              )}
                              {releaseLabel && (
                                <span className={isReleased ? "text-green-400" : "text-yellow-400"}>
                                  {isReleased ? "उपलब्ध / Live" : `${releaseLabel} से`}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* FAQ */}
          {pkg.faq.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-bold text-white">सामान्य प्रश्न / FAQ</h2>
              <div className="space-y-3">
                {pkg.faq.map((f, i) => (
                  <details key={i} className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
                    <summary className="cursor-pointer text-sm font-semibold text-slate-200">{f.question}</summary>
                    <p className="mt-2 text-sm text-slate-300">{f.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
              <FileText className="h-4 w-4 text-yellow-500" /> विवरण / Details
            </h3>
            <dl className="space-y-2 text-sm text-slate-300">
              {pkg.total_tests && (
                <div className="flex justify-between">
                  <dt className="text-slate-300">Total Tests</dt>
                  <dd>{pkg.total_tests}</dd>
                </div>
              )}
              {pkg.total_questions && (
                <div className="flex justify-between">
                  <dt className="text-slate-300">Total Questions</dt>
                  <dd>{pkg.total_questions}</dd>
                </div>
              )}
              {validityLabel && (
                <div className="flex justify-between">
                  <dt className="text-slate-300">वैधता / Validity</dt>
                  <dd>{validityLabel}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
              <ShieldCheck className="h-4 w-4 text-yellow-500" /> रिफंड नीति / Refund Policy
            </h3>
            <p>
              Refund only within 2 days of purchase and if fewer than 3 videos watched (tests attempted, for a test
              series). One account per student — shared accounts are suspended without refund.{" "}
              <Link href="/refund-policy" className="underline">
                Full policy
              </Link>
            </p>
            <Link href="/terms" className="mt-2 inline-block text-yellow-400 underline">
              पूरे नियम पढ़ें / Read full terms
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
