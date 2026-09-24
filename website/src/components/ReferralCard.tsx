"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";

export default function ReferralCard({
  referralCode,
  storeCreditPaise,
  storeUrl,
}: {
  referralCode: string;
  storeCreditPaise: number;
  storeUrl: string;
}) {
  const [copied, setCopied] = useState(false);

  const message = `UKPSC Decoded पर मेरा रेफरल कोड इस्तेमाल करें और अपनी पहली खरीद पर ₹200 की छूट पाएं / Use my referral code on UKPSC Decoded and get ₹200 off your first purchase: ${referralCode}\n${storeUrl}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

  const handleCopy = () => {
    navigator.clipboard
      ?.writeText(referralCode)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <h3 className="font-semibold text-white">
        दोस्तों को रेफर करें <span className="text-slate-400">/ Refer Friends</span>
      </h3>
      <p className="mt-1 text-xs text-slate-500">
        Friends get ₹200 off their first purchase. You get ₹200 store credit when they buy.
      </p>

      <div className="mt-3 flex items-center gap-2">
        <code className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-semibold text-yellow-400">
          {referralCode}
        </code>
        <button
          onClick={handleCopy}
          className="flex-shrink-0 rounded-lg border border-slate-700 p-2 text-slate-300 hover:border-yellow-500 hover:text-yellow-400"
          title="Copy code"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-500"
      >
        <Share2 className="h-4 w-4" /> Share on WhatsApp
      </a>

      <p className="mt-3 text-xs text-slate-400">
        Store credit: <span className="font-semibold text-white">₹{(storeCreditPaise / 100).toFixed(0)}</span>
      </p>
    </div>
  );
}
