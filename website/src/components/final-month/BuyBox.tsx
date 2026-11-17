import type { ReactNode } from "react";
import Link from "next/link";
import T from "@/components/T";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { formatINR } from "@/lib/format";
import type { ProductState } from "@/lib/finalMonth";

/**
 * Price + one button, fitted to the visitor: "Go to my tests" when owned,
 * the upgrade / 20%-off price when it applies, otherwise the normal price.
 * Prices are hidden inside the app (`web-only`), like the rest of the store.
 */
export default function BuyBox({
  state,
  buyLabel,
  loggedIn,
  includedNote,
}: {
  state: ProductState;
  buyLabel: ReactNode;
  loggedIn: boolean;
  includedNote?: ReactNode;
}) {
  const { pkg } = state;
  if (!pkg) {
    return <p className="text-sm text-graphite-300"><T en="Opening soon." hi="जल्द शुरू होगा।" /></p>;
  }
  if (state.owned) {
    return (
      <div>
        <p className="flex items-center gap-2 text-sm font-semibold text-success-300">
          <CheckCircle2 className="h-5 w-5" /> <T en="You're enrolled" hi="आप जुड़ चुके हैं" />
        </p>
        {includedNote && <p className="mt-1 text-xs text-graphite-300">{includedNote}</p>}
        <Link
          href={`/test-platform/course/${pkg.slug}`}
          className="mt-3 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-success-500 px-5 text-sm font-bold text-graphite-950 hover:bg-success-400 sm:w-auto"
        >
          <T en="Go to my tests" hi="मेरे टेस्ट खोलें" /> <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const checkout = `/checkout/${pkg.slug}`;
  const href = loggedIn ? checkout : `/student/login?next=${encodeURIComponent(checkout)}`;
  return (
    <div>
      <div className="web-only flex flex-wrap items-baseline gap-x-2">
        <span className="font-display text-4xl font-bold text-white">{formatINR(state.price ?? pkg.price)}</span>
        {state.wasPrice && <span className="text-lg text-graphite-400 line-through">{formatINR(state.wasPrice)}</span>}
      </div>
      {state.kind === "upgrade" && (
        <p className="web-only mt-1 text-sm font-semibold text-saffron-300"><T en="Upgrade price for Mock Mahasangram students" hi="मॉक महासंग्राम के छात्रों के लिए अपग्रेड कीमत" /></p>
      )}
      {state.kind === "returning" && (
        <p className="web-only mt-1 text-sm font-semibold text-saffron-300"><T en="20% off: you're already our student" hi="20% छूट: आप पहले से हमारे छात्र हैं" /></p>
      )}
      <Link
        href={href}
        className="mt-3 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-saffron-400 px-6 text-base font-bold text-graphite-950 shadow-lg shadow-saffron-400/20 hover:bg-saffron-300 sm:w-auto"
      >
        {buyLabel} <ArrowRight className="h-5 w-5" />
      </Link>
      {!loggedIn && (
        <p className="web-only mt-2 text-xs text-graphite-300">
          <T
            en={<>Bought from us before? <Link href={`/student/login?next=${encodeURIComponent("/revision")}`} className="text-saffron-300 underline">Log in</Link> to see your 20% / upgrade price.</>}
            hi={<>पहले हमसे कुछ खरीदा है? अपनी 20% छूट / अपग्रेड कीमत देखने के लिए <Link href={`/student/login?next=${encodeURIComponent("/revision")}`} className="text-saffron-300 underline">लॉगिन करें</Link>।</>}
          />
        </p>
      )}
    </div>
  );
}
