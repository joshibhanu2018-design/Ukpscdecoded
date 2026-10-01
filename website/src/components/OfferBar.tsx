"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Copy, Check } from "lucide-react";

// No bar during a test, in admin, or on checkout (the code is already filled in there).
const HIDDEN_PREFIXES = ["/test-platform/tests", "/test-platform/admin", "/checkout"];

function left(ms: number): string {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return h > 0 ? `${h}h ${m}m` : `${m}m ${String(s).padStart(2, "0")}s`;
}

export default function OfferBar({ code, percentOff, expiresAt }: { code: string; percentOff: number; expiresAt: string }) {
  const pathname = usePathname();
  const [now, setNow] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const remaining = new Date(expiresAt).getTime() - (now ?? 0);
  if (HIDDEN_PREFIXES.some((p) => pathname?.startsWith(p)) || (now !== null && remaining <= 0)) return null;

  return (
    <div className="bg-saffron-400 px-3 py-2 text-center text-xs font-semibold text-graphite-950 sm:text-sm">
      <span>{percentOff}% off every course &amp; test series with code </span>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(code).catch(() => {});
          setCopied(true);
        }}
        className="mx-0.5 inline-flex items-center gap-1 rounded border border-dashed border-graphite-950/60 px-1.5 py-0.5 font-mono font-bold"
        aria-label={`Copy code ${code}`}
      >
        {code}
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      </button>
      {now !== null && <span> · ends in {left(remaining)} · </span>}
      <Link href="/courses" className="underline underline-offset-2">
        Buy now
      </Link>
    </div>
  );
}
