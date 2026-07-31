"use client";

import { useEffect, useState } from "react";
import { X, Gift, CheckCircle2, Send, Loader2, Download } from "lucide-react";
import lead from "@content/leadMagnet.json";

const STORAGE_KEY = "ukpsc_lead_popup_seen";

export default function LeadPopup() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!lead.enabled) return;
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    const timer = setTimeout(() => setOpen(true), (lead.delaySeconds || 25) * 1000);

    const onExit = (e: MouseEvent) => {
      if (e.clientY <= 0 && !localStorage.getItem(STORAGE_KEY)) setOpen(true);
    };
    document.addEventListener("mouseleave", onExit);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", onExit);
    };
  }, []);

  const close = () => {
    setOpen(false);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, "1");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (lead.formEndpoint) {
        await fetch(lead.formEndpoint, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, source: "website-popup" }),
        });
      }
      localStorage.setItem(STORAGE_KEY, "1");
      setDone(true);
    } catch {
      setDone(true);
    } finally {
      setLoading(false);
    }
  };


  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-[fadeIn_0.2s_ease-out]">
        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-graphite-100 hover:bg-graphite-200 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-graphite-600" />
        </button>

        {done ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-jade-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-jade-600" />
            </div>
            <h3 className="heading-md text-graphite-900 mb-2">{lead.successHeading}</h3>
            <p className="text-graphite-600 text-sm mb-6">{lead.successMessage}</p>
            <div className="flex flex-col gap-3">
              {lead.pdfUrl && (
                <a
                  href={lead.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download Now
                </a>
              )}
              <a
                href={lead.telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Join Telegram
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-br from-saffron-500 to-saffron-600 p-6 text-white text-center">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                <Gift className="w-7 h-7" />
              </div>
              <span className="inline-block text-xs font-bold uppercase tracking-wider bg-white/20 rounded-full px-3 py-1 mb-2">
                {lead.badge}
              </span>
              <h3 className="text-xl font-display font-bold leading-tight">{lead.title}</h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-graphite-600 mb-4">{lead.subtitle}</p>
              <ul className="space-y-1.5 mb-5">
                {lead.benefits.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-graphite-700">
                    <CheckCircle2 className="w-4 h-4 text-jade-600 flex-shrink-0" /> {b}
                  </li>
                ))}
              </ul>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={lead.namePlaceholder}
                  className="w-full px-4 py-2.5 rounded-lg border border-graphite-200 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 outline-none text-sm text-graphite-800"
                />
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder={lead.phonePlaceholder}
                  className="w-full px-4 py-2.5 rounded-lg border border-graphite-200 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 outline-none text-sm text-graphite-800"
                />
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder={lead.emailPlaceholder}
                  className="w-full px-4 py-2.5 rounded-lg border border-graphite-200 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 outline-none text-sm text-graphite-800"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gift className="w-4 h-4" />}
                  {lead.buttonText}
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="w-full text-xs text-graphite-400 hover:text-graphite-600 transition-colors"
                >
                  No thanks, I'll continue browsing
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
