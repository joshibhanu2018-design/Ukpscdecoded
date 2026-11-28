import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Award, BookOpen, CalendarDays, Check, ClipboardList, FileText, Flame, Sparkles } from "lucide-react";
import CourseCard from "@/components/CourseCard";
import AppPurchaseNote from "@/components/AppPurchaseNote";
import { COURSE_ENQUIRY_WHATSAPP } from "@/components/CourseEnquiryButton";
import { LowerPcsBuyButton, LowerPcsMobileBar } from "@/components/LowerPcsBuy";
import { LOWER_COMPLETE_SLUG, FREE_MOCK_TEST_ID, examProducts } from "@/lib/catalog";
import { getPriceInfo } from "@/lib/pricing";
import { formatINR } from "@/lib/format";
import { getActivePackages } from "@/lib/packages";
import { getPackageTestList, getTest } from "@/lib/tests";
import T from "@/components/T";
import { ORG_ID, SITE_URL, breadcrumbJsonLd, faqJsonLd, ldJson } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: { canonical: "/lower-pcs" },
  title: "UKPSC Lower PCS & RO/ARO 2026-27 Course, Test Series and Free Mock",
  description:
    "UKPSC Lower PCS (27 Dec 2026) and RO/ARO prelims, same syllabus: 65+ video lessons with PDF notes, 67 tests with 10 full-length mocks, CSAT classes and 12 CSAT sectionals, and a free 150-question mock. By Bhanu Joshi, UKPSC Rank 9.",
  keywords: [
    "UKPSC Lower PCS course",
    "Lower PCS test series",
    "UKPSC RO ARO course",
    "Lower PCS mock test",
    "Uttarakhand Lower PCS online coaching",
    "लोअर पीसीएस टेस्ट सीरीज़",
  ],
};

const FAQS = [
  {
    q: "Is one course enough for both Lower PCS and RO/ARO?",
    a: "Yes. The RO/ARO prelims has the same pattern and syllabus as Lower PCS: 150 questions in 2 hours, 100 General Studies and 50 General Aptitude. Everything here stays valid till 30 April 2027.",
  },
  {
    q: "What is in the Lower PCS + RO/ARO Complete course?",
    a: "65+ video lessons with PDF notes, 67 tests including 10 full-length mocks, CSAT classes and 12 CSAT sectional tests, valid till 30 April 2027.",
  },
  {
    q: "Is there a free Lower PCS mock test?",
    a: "Yes. A 150-question, 2-hour mock on the exact Lower PCS pattern, with explanations in English and Hindi, is free for every registered student.",
  },
  {
    q: "Who teaches the course?",
    a: "Bhanu Joshi, UKPSC Rank 9, who cleared 7 UKPSC Mains and 5 interviews and wrote the book Uttarakhand Decoded.",
  },
];


export default async function LowerPcsPage() {
  const [all, paper] = await Promise.all([getActivePackages(), getTest(FREE_MOCK_TEST_ID).catch(() => null)]);
  const products = examProducts(all, "lower");
  const complete = products.find((p) => p.slug === LOWER_COMPLETE_SLUG);
  const others = products.filter((p) => p !== complete);
  const paperReady = !!paper && paper.question_ids.length > 0;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbJsonLd([{ name: "Lower PCS & RO/ARO", path: "/lower-pcs" }]),
      faqJsonLd(FAQS),
      {
        "@type": "ItemList",
        name: "UKPSC Lower PCS & RO/ARO courses",
        itemListElement: products.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Course",
            name: p.package_name,
            description: p.description ?? p.package_name,
            url: `${SITE_URL}/courses/${p.slug}`,
            provider: { "@id": ORG_ID },
            offers: { "@type": "Offer", price: getPriceInfo(p).amount, priceCurrency: "INR", category: "Paid" },
          },
        })),
      },
    ],
  };

  // Real test counts of the Lower PCS & RO/ARO Test Series (inside the Complete course).
  const seriesPkg = all.find((p) => p.slug === "lower-pcs-test-series");
  const seriesTests = seriesPkg ? await getPackageTestList(seriesPkg.id).catch(() => []) : [];
  const testsTotal = seriesTests.length;
  const testsLive = seriesTests.filter((t) => t.question_count > 0).length;
  const price = complete ? getPriceInfo(complete) : null;
  const was = price && price.isFounding && price.regularPrice && price.regularPrice > price.amount ? price.regularPrice : null;
  const offerTill =
    was && price?.foundingEndsAt
      ? new Date(price.foundingEndsAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" })
      : null;
  const enquiryText = `Hi UKPSC Decoded, I have a question about the Lower PCS + RO/ARO Complete course. https://www.ukpscdecoded.in/lower-pcs`;
  const enquiryHref = `https://wa.me/${COURSE_ENQUIRY_WHATSAPP}?text=${encodeURIComponent(enquiryText)}`;

  return (
    <div className="bg-graphite-950 pb-24 lg:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(jsonLd) }} />

      {/* 1. Hero: one promise, one price, one button */}
      <section className="border-b border-graphite-800 bg-gradient-to-b from-saffron-400/10 to-transparent px-4 pb-10 pt-10 sm:pb-14 sm:pt-14">
        <div className="container-custom mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron-400">UKPSC Lower PCS 2026 · RO/ARO 2027</p>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-white sm:text-5xl">
            <T
              en={<>The only course you need to crack <span className="text-saffron-400">Lower PCS &amp; RO/ARO</span></>}
              hi={<>लोअर PCS और RO/ARO क्रैक करने के लिए <span className="text-saffron-400">बस यही एक कोर्स</span></>}
            />
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-graphite-200 sm:text-lg">
            <T
              en={<>Video lessons with <b className="text-white">PDF notes</b> + <b className="text-white">organised tests</b> on the exact exam pattern, in one plan. Same syllabus for both exams, so one course covers both.</>}
              hi={<>वीडियो लेक्चर + <b className="text-white">PDF नोट्स</b> + परीक्षा पैटर्न पर <b className="text-white">व्यवस्थित टेस्ट</b>, सब एक ही प्लान में। दोनों परीक्षाओं का सिलेबस एक है, इसलिए एक कोर्स से दोनों।</>}
            />
          </p>

          {complete && price && (
            <div className="mt-7 flex flex-col items-center gap-3">
              <div className="web-only flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1">
                <span className="font-display text-4xl font-bold text-white sm:text-5xl">{formatINR(price.amount)}</span>
                {was && <span className="text-lg text-graphite-400 line-through">{formatINR(was)}</span>}
                {was && (
                  <span className="rounded-full bg-success-500/15 px-2.5 py-0.5 text-xs font-bold text-success-400">
                    {Math.round(((was - price.amount) / was) * 100)}% off
                  </span>
                )}
              </div>
              {offerTill && (
                <p className="web-only inline-flex items-center gap-1.5 text-sm font-medium text-saffron-300">
                  <Flame className="h-4 w-4" aria-hidden />
                  <T en={<>Early bird price till {offerTill}, then {formatINR(was!)}</>} hi={<>अर्ली बर्ड कीमत {offerTill} तक, फिर {formatINR(was!)}</>} />
                </p>
              )}
              <LowerPcsBuyButton packageId={complete.id} slug={LOWER_COMPLETE_SLUG} className="mt-1 w-full max-w-xs" />
              <AppPurchaseNote className="max-w-sm" />
              <Link href={`/courses/${LOWER_COMPLETE_SLUG}`} className="text-sm font-semibold text-graphite-200 underline underline-offset-4 hover:text-saffron-300">
                <T en="See every video and test inside" hi="अंदर के सभी वीडियो और टेस्ट देखें" />
              </Link>
            </div>
          )}

          <ul className="mx-auto mt-7 flex max-w-2xl flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-graphite-200">
            <li className="inline-flex items-center gap-1.5">
              <Award className="h-4 w-4 text-saffron-400" /> By Bhanu Joshi, UKPSC Rank 9
            </li>
            <li className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-saffron-400" /> Lower PCS Prelims: 27 Dec 2026
            </li>
            <li className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-saffron-400" /> RO/ARO Prelims: April 2027
            </li>
          </ul>
        </div>
      </section>

      <div className="container-custom mx-auto space-y-10 px-4 py-10 sm:py-14">
        {/* 2. What you get: notes + organised tests */}
        <section>
          <h2 className="text-center font-display text-2xl font-bold text-white sm:text-3xl">
            <T en="Everything in one course" hi="सब कुछ एक ही कोर्स में" />
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-saffron-400/40 bg-graphite-900 p-6">
              <p className="flex items-center gap-2 font-display text-xl font-bold text-white">
                <BookOpen className="h-6 w-6 text-saffron-400" /> <T en="Video lessons + PDF notes" hi="वीडियो लेक्चर + PDF नोट्स" />
              </p>
              <ul className="mt-4 space-y-2.5 text-sm text-graphite-200">
                {[
                  ["65+ video lectures, watch at your own pace", "65+ वीडियो लेक्चर, अपनी गति से देखें"],
                  ["PDF notes with every lecture, in English and Hindi", "हर लेक्चर के साथ PDF नोट्स, हिंदी और अंग्रेज़ी में"],
                  ["Uttarakhand first, then Culture, India and Current Affairs", "पहले उत्तराखंड, फिर संस्कृति, भारत और करंट अफेयर्स"],
                  ["General Aptitude (CSAT) classes included", "सामान्य बुद्धि (CSAT) की कक्षाएँ शामिल"],
                ].map(([en, hi]) => (
                  <li key={en} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-saffron-400" /> <T en={en} hi={hi} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-saffron-400/40 bg-graphite-900 p-6">
              <p className="flex items-center gap-2 font-display text-xl font-bold text-white">
                <ClipboardList className="h-6 w-6 text-saffron-400" />{" "}
                <T en={testsTotal ? `${testsTotal} organised tests` : "Organised tests"} hi={testsTotal ? `${testsTotal} व्यवस्थित टेस्ट` : "व्यवस्थित टेस्ट"} />
              </p>
              <ul className="mt-4 space-y-2.5 text-sm text-graphite-200">
                {[
                  ...(testsLive > 0 ? [[`${testsLive} tests live today, the rest being added`, `${testsLive} टेस्ट अभी उपलब्ध, बाकी जोड़े जा रहे हैं`]] : []),
                  ["10 Full Length Tests on the Lower PCS pattern (100 GS + 50 Aptitude)", "लोअर PCS पैटर्न पर 10 फुल लेंथ टेस्ट (100 GS + 50 एप्टीट्यूड)"],
                  ["Uttarakhand, subject-wise and current affairs tests", "उत्तराखंड, विषयवार और करंट अफेयर्स टेस्ट"],
                  ["12 CSAT (General Aptitude) sectional tests", "12 CSAT (सामान्य बुद्धि) सेक्शनल टेस्ट"],
                  ["Lower PCS 2025 actual paper as a timed test, analysis after every test", "लोअर PCS 2025 का असली पेपर टाइम्ड टेस्ट के रूप में, हर टेस्ट के बाद विश्लेषण"],
                ].map(([en, hi]) => (
                  <li key={en} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-saffron-400" /> <T en={en} hi={hi} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mx-auto mt-5 max-w-2xl text-center text-sm text-graphite-300">
            <T
              en="RO/ARO Prelims has the same pattern and syllabus as Lower PCS: 150 questions in 2 hours, 100 General Studies + 50 General Aptitude. Everything stays valid till 30 April 2027."
              hi="RO/ARO प्रीलिम्स का पैटर्न और सिलेबस लोअर PCS जैसा ही है: 2 घंटे में 150 प्रश्न, 100 सामान्य अध्ययन + 50 सामान्य बुद्धि। सब कुछ 30 अप्रैल 2027 तक मान्य।"
            />
          </p>
          {complete && (
            <div className="mt-6 flex justify-center">
              <LowerPcsBuyButton packageId={complete.id} slug={LOWER_COMPLETE_SLUG} className="w-full max-w-xs" />
            </div>
          )}
        </section>

        {products.length === 0 && (
          <p className="rounded-2xl border border-dashed border-graphite-700 p-8 text-center text-sm text-graphite-300">
            The Lower PCS courses are being set up. Please check again in a few minutes.
          </p>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <section className="rounded-2xl border border-saffron-400/30 bg-saffron-400/5 p-5">
            <p className="flex items-center gap-2 font-semibold text-white">
              <FileText className="h-5 w-5 text-saffron-400" /> Free Lower PCS Mock Test
            </p>
            <p className="mt-1.5 text-sm text-graphite-300">
              150 questions, 2 hours, on the exact Lower PCS pattern, with explanations in English and Hindi. Free for every registered student.
            </p>
            {paperReady ? (
              <Link
                href={`/test-platform/tests/${FREE_MOCK_TEST_ID}`}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-saffron-400 px-4 py-2 text-sm font-bold text-graphite-900 hover:bg-saffron-300"
              >
                Attempt free <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <p className="mt-3 inline-block rounded-full bg-saffron-400/10 px-3 py-1 text-xs font-semibold text-saffron-300">Coming soon</p>
            )}
          </section>

          <section className="web-only rounded-2xl border border-graphite-800 bg-graphite-900/60 p-5">
            <p className="flex items-center gap-2 font-semibold text-white">
              <Sparkles className="h-5 w-5 text-saffron-400" /> Already bought an Upper PCS course?
            </p>
            <p className="mt-1.5 text-sm text-graphite-300">
              If you have the Upper PCS Crash Course, Premium Test Series or Complete Prelims Pack, you already have the GS videos and
              most tests. Add only:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-graphite-200">
              <li>
                <Link href="/courses/lower-pcs-csat" className="text-saffron-300 underline underline-offset-2">
                  CSAT for Lower PCS / RO-ARO
                </Link>{" "}
                at ₹499 for you (the price shows at checkout when you are logged in)
              </li>
              <li>
                <Link href="/courses/tri-addon" className="text-saffron-300 underline underline-offset-2">
                  TRI Add-on
                </Link>{" "}
                (₹599) if you are also writing TRI
              </li>
            </ul>
          </section>
        </div>

        {others.length > 0 && (
          <section>
            <h2 className="font-display text-xl font-bold text-white">
              <T en="Need only one part?" hi="केवल एक हिस्सा चाहिए?" />
            </h2>
            <p className="mt-1 text-sm text-graphite-300">
              <T en="The Complete course above already includes the Crash Course and the Test Series." hi="ऊपर वाले Complete कोर्स में Crash Course और Test Series दोनों पहले से शामिल हैं।" />
            </p>
            <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
              {others.map((pkg) => (
                <CourseCard key={pkg.id} pkg={pkg} size="sm" />
              ))}
            </div>
          </section>
        )}

        <section aria-label="Free exam guides" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { href: "/ukpsc-lower-pcs-2026", en: "Lower PCS 2026: posts, syllabus, pattern", hi: "लोअर पीसीएस 2026 गाइड" },
            { href: "/ukpsc-ro-aro", en: "RO/ARO: pattern and syllabus", hi: "RO/ARO गाइड" },
            { href: "/ukpsc-previous-year-papers", en: "Previous year papers", hi: "पिछले वर्ष के प्रश्नपत्र" },
          ].map((g) => (
            <Link key={g.href} href={g.href} className="rounded-2xl border border-graphite-800 p-4 hover:border-saffron-400/50">
              <span className="block text-sm font-semibold text-white">{g.en}</span>
              <span lang="hi" className="block text-xs text-graphite-300">
                {g.hi}
              </span>
            </Link>
          ))}
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-white">Questions students ask</h2>
          {FAQS.map((f) => (
            <details key={f.q} className="rounded-xl border border-graphite-800 bg-graphite-900/60 p-4">
              <summary className="cursor-pointer font-semibold text-white">{f.q}</summary>
              <p className="mt-2 text-sm text-graphite-300">{f.a}</p>
            </details>
          ))}
        </section>

        <Link
          href="/tri"
          className="flex items-center justify-between gap-3 rounded-2xl border border-graphite-800 bg-graphite-900/60 p-5 hover:border-saffron-400/50"
        >
          <span>
            <span className="block font-semibold text-white">Also writing TRI on 15 January 2027?</span>
            <span className="text-sm text-graphite-300">The 3-Exam Complete adds the TRI-only GS topics and 3 TRI pattern mocks.</span>
          </span>
          <ArrowRight className="h-5 w-5 flex-shrink-0 text-saffron-400" />
        </Link>

        {/* Final call: one button, the WhatsApp question link stays small */}
        {complete && price && (
          <section className="rounded-2xl border border-saffron-400/50 bg-gradient-to-r from-saffron-400/15 to-transparent p-6 text-center">
            <p className="font-display text-2xl font-bold text-white">
              <T en="Notes + tests for both exams, in one place" hi="दोनों परीक्षाओं के लिए नोट्स + टेस्ट, एक ही जगह" />
            </p>
            <p className="web-only mt-2 text-graphite-200">
              {formatINR(price.amount)}
              {was && <span className="ml-2 text-graphite-400 line-through">{formatINR(was)}</span>}
            </p>
            <LowerPcsBuyButton packageId={complete.id} slug={LOWER_COMPLETE_SLUG} className="mt-4 w-full max-w-xs" />
          </section>
        )}
        <p className="text-center text-sm text-graphite-300">
          <T en="Still have a question?" hi="कोई सवाल है?" />{" "}
          <a href={enquiryHref} target="_blank" rel="noopener noreferrer" className="font-semibold text-success-400 underline underline-offset-2">
            <T en="Ask on WhatsApp" hi="WhatsApp पर पूछें" />
          </a>
        </p>
      </div>

      {complete && price && (
        <LowerPcsMobileBar
          packageId={complete.id}
          slug={LOWER_COMPLETE_SLUG}
          price={formatINR(price.amount)}
          was={was ? formatINR(was) : null}
        />
      )}
    </div>
  );
}
