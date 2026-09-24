"use client";

import { useCallback, useEffect, useState } from "react";
import { Copy, Download } from "lucide-react";

type CouponRow = {
  code: string;
  type: string;
  percent_off: number | null;
  price_lock_until: string | null;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  status: string;
  used_by_email: string;
  used_on_order: string;
};

type ReferralRow = {
  id: string;
  order_id: string;
  status: string;
  referee_discount_amount: number;
  referrer_credit_amount: number;
  credited_at: string | null;
  created_at: string;
  referrer: { email: string; full_name: string } | null;
  referee: { email: string; full_name: string } | null;
};

export default function AdminCouponsPage() {
  return <Dashboard />;
}

function Dashboard() {
  const [coupons, setCoupons] = useState<CouponRow[]>([]);
  const [referrals, setReferrals] = useState<ReferralRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [generateCount, setGenerateCount] = useState(10);
  const [percentOff, setPercentOff] = useState(10);
  const [expiresAt, setExpiresAt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedCodes, setGeneratedCodes] = useState<string[] | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const [plCode, setPlCode] = useState("");
  const [plUntil, setPlUntil] = useState("2026-10-07T23:59");
  const [plMaxUses, setPlMaxUses] = useState("");
  const [plStatus, setPlStatus] = useState<"idle" | "saving">("idle");
  const [plMessage, setPlMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [couponsRes, referralsRes] = await Promise.all([
        fetch("/api/admin/coupons"),
        fetch("/api/admin/referrals"),
      ]);
      const couponsData = await couponsRes.json();
      const referralsData = await referralsRes.json();
      setCoupons(couponsData.coupons || []);
      setReferrals(referralsData.referrals || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setGenerateError(null);
    setGeneratedCodes(null);

    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "generate",
          count: generateCount,
          percent_off: percentOff,
          expires_at: expiresAt ? new Date(expiresAt).toISOString() : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) setGenerateError(data.error || "Could not generate codes.");
      else {
        setGeneratedCodes(data.codes);
        loadData();
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleCreatePriceLock = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlStatus("saving");
    setPlMessage(null);

    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "price_lock",
          code: plCode,
          price_lock_until: plUntil ? new Date(plUntil).toISOString() : undefined,
          max_uses: plMaxUses ? Number(plMaxUses) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) setPlMessage({ ok: false, text: data.error || "Could not create code." });
      else {
        setPlMessage({ ok: true, text: `Created ${data.code}` });
        setPlCode("");
        loadData();
      }
    } finally {
      setPlStatus("idle");
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code).catch(() => {});
  };

  const exportCsv = async () => {
    const res = await fetch("/api/admin/coupons?format=csv");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `coupons-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-1 text-2xl font-bold text-white">Coupons &amp; Referrals</h1>
        <p className="mb-6 text-sm text-slate-400">Generate discount codes and review referral activity.</p>

        <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
          <h2 className="mb-4 text-lg font-semibold text-white">Generate single-use codes</h2>
          <form onSubmit={handleGenerate} className="flex flex-wrap items-end gap-3">
            <div>
              <label className="mb-1 block text-xs text-slate-400">How many</label>
              <input
                type="number"
                min={1}
                max={500}
                value={generateCount}
                onChange={(e) => setGenerateCount(Number(e.target.value))}
                className="w-24 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">% off</label>
              <input
                type="number"
                min={1}
                max={100}
                value={percentOff}
                onChange={(e) => setPercentOff(Number(e.target.value))}
                className="w-20 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">Expires (optional)</label>
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none focus:border-yellow-500"
              />
            </div>
            <button
              type="submit"
              disabled={generating}
              className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-yellow-400 disabled:opacity-60"
            >
              {generating ? "Generating…" : "Generate codes"}
            </button>
          </form>
          {generateError && <p className="mt-3 text-sm text-red-400">{generateError}</p>}
          {generatedCodes && (
            <div className="mt-4 rounded-lg border border-green-500/30 bg-green-500/10 p-3">
              <p className="mb-2 text-xs font-semibold text-green-300">{generatedCodes.length} codes generated:</p>
              <div className="flex flex-wrap gap-2">
                {generatedCodes.map((c) => (
                  <button
                    key={c}
                    onClick={() => copyCode(c)}
                    className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700"
                    title="Copy"
                  >
                    <code>{c}</code>
                    <Copy className="h-3 w-3" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
          <h2 className="mb-4 text-lg font-semibold text-white">Create price-lock code</h2>
          <p className="mb-4 text-xs text-slate-500">
            Multi-use — anyone with this code gets founding prices even after the founding window
            ends, until the date below.
          </p>
          <form onSubmit={handleCreatePriceLock} className="flex flex-wrap items-end gap-3">
            <div>
              <label className="mb-1 block text-xs text-slate-400">Code name</label>
              <input
                value={plCode}
                onChange={(e) => setPlCode(e.target.value)}
                placeholder="EARLYBIRD"
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">Founding price honored until</label>
              <input
                type="datetime-local"
                value={plUntil}
                onChange={(e) => setPlUntil(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">Max uses (optional)</label>
              <input
                type="number"
                min={1}
                value={plMaxUses}
                onChange={(e) => setPlMaxUses(e.target.value)}
                placeholder="Unlimited"
                className="w-28 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none focus:border-yellow-500"
              />
            </div>
            <button
              type="submit"
              disabled={plStatus === "saving" || !plCode.trim()}
              className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-yellow-400 disabled:opacity-60"
            >
              Create
            </button>
          </form>
          {plMessage && (
            <p className={`mt-3 text-sm ${plMessage.ok ? "text-green-400" : "text-red-400"}`}>{plMessage.text}</p>
          )}
        </div>

        <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">All codes ({coupons.length})</h2>
            <button
              onClick={exportCsv}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:border-yellow-500 hover:text-yellow-400"
            >
              <Download className="h-3.5 w-3.5" /> Export CSV
            </button>
          </div>
          {loading ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-400">
                  <tr>
                    <th className="pb-2 pr-4">Code</th>
                    <th className="pb-2 pr-4">Type</th>
                    <th className="pb-2 pr-4">Status</th>
                    <th className="pb-2 pr-4">Used</th>
                    <th className="pb-2 pr-4">By</th>
                    <th className="pb-2">Order</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {coupons.map((c) => (
                    <tr key={c.code}>
                      <td className="py-2 pr-4">
                        <button onClick={() => copyCode(c.code)} className="flex items-center gap-1 hover:text-yellow-400">
                          <code>{c.code}</code>
                          <Copy className="h-3 w-3" />
                        </button>
                      </td>
                      <td className="py-2 pr-4">
                        {c.type === "single_use_percent" ? `${c.percent_off}% off` : "Price lock"}
                      </td>
                      <td className="py-2 pr-4">
                        <span
                          className={
                            c.status === "used" || c.status === "expired"
                              ? "text-slate-500"
                              : c.status === "reserved"
                                ? "text-yellow-400"
                                : "text-green-400"
                          }
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="py-2 pr-4">
                        {c.used_count}
                        {c.max_uses != null ? ` / ${c.max_uses}` : ""}
                      </td>
                      <td className="py-2 pr-4">{c.used_by_email || "—"}</td>
                      <td className="py-2 text-slate-500">{c.used_on_order ? c.used_on_order.slice(0, 8) : "—"}</td>
                    </tr>
                  ))}
                  {coupons.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-slate-500">
                        No codes yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
          <h2 className="mb-4 text-lg font-semibold text-white">Referrals ({referrals.length})</h2>
          {loading ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-400">
                  <tr>
                    <th className="pb-2 pr-4">Referrer</th>
                    <th className="pb-2 pr-4">Referee</th>
                    <th className="pb-2 pr-4">Status</th>
                    <th className="pb-2 pr-4">Credit</th>
                    <th className="pb-2">Order</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {referrals.map((r) => (
                    <tr key={r.id}>
                      <td className="py-2 pr-4">{r.referrer?.email ?? "—"}</td>
                      <td className="py-2 pr-4">{r.referee?.email ?? "—"}</td>
                      <td className="py-2 pr-4">
                        <span className={r.status === "consumed" ? "text-green-400" : "text-yellow-400"}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-2 pr-4">₹{(r.referrer_credit_amount / 100).toFixed(0)}</td>
                      <td className="py-2 text-slate-500">{r.order_id.slice(0, 8)}</td>
                    </tr>
                  ))}
                  {referrals.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-slate-500">
                        No referrals yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
