import Link from "next/link";
import { ArrowRight, Package as PackageIcon, Rocket, Trophy } from "lucide-react";
import { formatINR } from "@/lib/format";
import { getPriceInfo } from "@/lib/pricing";
import type { Package } from "@/lib/packages";

/**
 * "Which one is for me?" — the three choices we recommend in the last month,
 * at the top of Courses and Test Series, so students don't have to compare
 * every product. Prices come from the database (hidden in the app).
 */
export default function WhichOne({ packages }: { packages: Package[] }) {
  const price = (slug: string) => {
    const p = packages.find((x) => x.slug === slug);
    return p ? formatINR(getPriceInfo(p).amount) : null;
  };
  const choices = [
    {
      icon: Trophy,
      want: "I want to test myself with live ranks",
      name: "Mock Mahasangram",
      what: "6 full mocks, live Uttarakhand rank · Mock 1 free",
      price: price("mock-mahasangram"),
      href: "/mahasangram",
      highlight: false,
    },
    {
      icon: Rocket,
      want: "I want full revision in the last month",
      name: "Revision Test Series",
      what: "6 mocks + 800 UK GK + 600 CA questions + 2 CSAT",
      price: price("revision-test-series"),
      href: "/revision",
      highlight: true,
    },
    {
      icon: PackageIcon,
      want: "I want everything: videos + all tests",
      name: "Complete Prelims Pack",
      what: "Crash Course + Premium Test Series + Revision Series",
      price: price("complete-prelims-pack"),
      href: "/courses/complete-prelims-pack",
      highlight: false,
    },
  ];

  return (
    <section aria-labelledby="which-one" className="rounded-2xl border border-graphite-800 bg-graphite-900/60 p-4 sm:p-6">
      <h2 id="which-one" className="text-center font-display text-xl font-bold text-white sm:text-2xl">
        Which one is for me?
      </h2>
      <p className="mt-1 text-center text-sm text-graphite-300">Exam on 29 Nov. Pick the one line that sounds like you.</p>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {choices.map((c) => (
          <Link
            key={c.name}
            href={c.href}
            className={`group relative flex flex-col rounded-xl border p-4 transition-colors ${
              c.highlight ? "border-saffron-400 bg-saffron-400/10" : "border-graphite-700 bg-graphite-950 hover:border-saffron-400/60"
            }`}
          >
            {c.highlight && (
              <span className="absolute -top-2.5 left-4 rounded-full bg-saffron-400 px-2 py-0.5 text-[10px] font-bold uppercase text-graphite-950">
                Most popular
              </span>
            )}
            <p className="text-sm italic text-graphite-300">&ldquo;{c.want}&rdquo;</p>
            <p className="mt-2 flex items-center gap-2 font-display text-lg font-bold text-white">
              <c.icon className="h-5 w-5 text-saffron-400" /> {c.name}
            </p>
            <p className="mt-1 text-sm text-graphite-300">{c.what}</p>
            <p className="mt-3 flex items-center justify-between">
              <span className="web-only font-display text-xl font-bold text-saffron-300">{c.price}</span>
              <ArrowRight className="h-5 w-5 text-saffron-400 transition-transform group-hover:translate-x-1" />
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
