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
import { getPackageTestList, type TestListItem } from "@/lib/tests";
import { courseHeader, demoVideos, groupTestsByTab } from "@/lib/course-display";
import FreeSampleTest from "@/components/FreeSampleTest";
import { courseTone } from "@/components/CourseHeader";
import DemoVideo from "@/components/DemoVideo";
import TestTabs from "@/components/TestTabs";
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

  const [allPackages, includes] = await Promise.all([getActivePackages(), getPackageIncludes()]);
  // A combo / mentorship page lists the tests and demo videos of what it
  // includes (the combo itself has no package_tests rows).
  const includedPackages = includes
    .filter((i) => i.combo_package_id === pkg.id)
    .map((i) => allPackages.find((p) => p.id === i.included_package_id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const testLists = await Promise.all([pkg, ...includedPackages].map((p) => getPackageTestList(p.id)));
  const seenTests = new Set<string>();
  const testList: TestListItem[] = testLists.flat().filter((t) => !seenTests.has(t.id) && Boolean(seenTests.add(t.id)));
  const seenVideos = new Set<string>();
  const videos = [pkg, ...includedPackages]
    .flatMap(demoVideos)
    .filter((v) => !seenVideos.has(v.youtubeId) && Boolean(seenVideos.add(v.youtubeId)));
  const header = courseHeader(pkg);
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

  const testTabs = groupTestsByTab(testList);

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
      <div className="px-4 py-8 sm:py-12" style={{ background: courseTone(pkg) }}>
        <div
          className={`container-custom mx-auto ${pkg.image_url ? "grid grid-cols-1 items-center gap-6 lg:grid-cols-2" : ""}`}
        >
          {pkg.image_url && (
            // eslint-disable-next-line @next/next/no-img-element -- admin-supplied URL from any host; next/image would need every host allow-listed
            <img
              src={pkg.image_url}
              alt=""
              decoding="async"
              className="aspect-[16/9] w-full rounded-xl object-cover shadow-xl lg:order-2"
            />
          )}
          <div>
            <h1 className="text-3xl font-extrabold uppercase leading-tight tracking-wide text-white sm:text-4xl">
              {header.title}
            </h1>
            {header.tagline && (
              <p className="mt-3 max-w-3xl text-lg font-semibold leading-snug text-white sm:text-2xl">
                {header.tagline}
              </p>
            )}
            {header.title.toLowerCase() !== pkg.package_name.toLowerCase() && (
              <p className="mt-2 text-sm text-white/90">{pkg.package_name}</p>
            )}
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
      </div>

      <div className="container-custom mx-auto grid grid-cols-1 gap-8 px-4 py-10 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          {/* Highlights */}
          {(pkg.highlights.length > 0 || pkg.description) && (
            <section>
              <h2 className="mb-4 text-lg font-bold text-white">इसमें क्या मिलेगा / What&apos;s Included</h2>
              {pkg.description && (
                <p className="mb-4 whitespace-pre-line text-sm leading-relaxed text-slate-200">{pkg.description}</p>
              )}
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {pkg.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-start gap-2 rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-200"
                  >
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-500" /> {h}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <FreeSampleTest compact />

          {/* Free demo videos — packages.metadata.demo_videos (YouTube until Bunny is set up) */}
          {videos.length > 0 ? (
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                <PlayCircle className="h-5 w-5 text-yellow-500" /> फ्री डेमो देखें / Watch Free Demo
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {videos.map((v) => (
                  <DemoVideo key={v.youtubeId} title={v.title} youtubeId={v.youtubeId} />
                ))}
              </div>
            </section>
          ) : (
            <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex items-center gap-3">
                <PlayCircle className="h-6 w-6 text-yellow-500" />
                <div>
                  <p className="font-semibold text-white">फ्री डेमो देखें / Watch Free Demo</p>
                  <p className="text-xs text-slate-300">जल्द आ रहा है / Coming soon</p>
                </div>
              </div>
            </section>
          )}

          {/* Curriculum */}
          {pkg.curriculum.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-bold text-white">पाठ्यक्रम / Curriculum</h2>
              <ol className="space-y-2">
                {pkg.curriculum.map((c, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-200"
                  >
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
              <TestTabs
                tabs={testTabs.map((tab) => ({
                  key: tab.key,
                  label: tab.label,
                  hindi: tab.hindi,
                  count: tab.count,
                  panel: (
                    <div className="space-y-6">
                      {tab.groups.map((g) => (
                        <div key={g.subject}>
                          {tab.groups.length > 1 && (
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
                              {g.subject}
                            </p>
                          )}
                          <div className="space-y-2">
                            {g.tests.map((t) => {
                              const releaseLabel = t.release_at ? formatDateLabel(t.release_at) : null;
                              const isReleased = t.release_at ? new Date(t.release_at) <= new Date() : true;
                              return (
                                <div
                                  key={t.id}
                                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm"
                                >
                                  <span className="font-medium text-slate-200">{t.test_name}</span>
                                  <div className="flex items-center gap-3 text-xs text-slate-300">
                                    {!!t.total_questions && <span>{t.total_questions} प्रश्न / Q</span>}
                                    {!!t.duration_minutes && (
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
                  ),
                }))}
              />
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
              {!!pkg.total_tests && (
                <div className="flex justify-between">
                  <dt className="text-slate-300">Total Tests</dt>
                  <dd>{pkg.total_tests}</dd>
                </div>
              )}
              {!!pkg.total_questions && (
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
