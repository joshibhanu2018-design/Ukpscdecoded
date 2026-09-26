"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Download, Share, X } from "lucide-react";

const DISMISS_KEY = "ukpsc_install_prompt_dismissed";

// Screens where a bottom bar would cover the controls that matter: the
// exam's Prev/Next/Submit, checkout's Pay button, and the course page's
// sticky mobile Buy Now bar.
const HIDDEN_ON = ["/test-platform/attempts/", "/checkout/", "/courses/"];

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    try {
      if (localStorage.getItem(DISMISS_KEY)) return;
    } catch {
      return;
    }
    setDismissed(false);

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    if (isStandalone) {
      setDismissed(true);
      return;
    }

    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (isIos) {
      setShowIosHint(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const dismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
  };

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    dismiss();
  };

  if (dismissed || (!deferredPrompt && !showIosHint)) return null;
  if (HIDDEN_ON.some((p) => pathname?.startsWith(p))) return null;

  return (
    <div
      className="fixed inset-x-0 z-40 mx-auto flex max-w-sm items-center gap-3 rounded-xl border border-graphite-700 bg-graphite-900 p-3 shadow-2xl sm:hidden"
      style={{ bottom: "calc(1rem + env(safe-area-inset-bottom, 0px))", left: "1rem", right: "1rem" }}
    >
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-saffron-400/10 text-saffron-400">
        <Download className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-white">
          Install app
        </p>
        {showIosHint && !deferredPrompt ? (
          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-graphite-300">
            Tap <Share className="h-3 w-3" /> then &quot;Add to Home Screen&quot;
          </p>
        ) : (
          <p className="mt-0.5 text-[11px] text-graphite-300">Quick access from your home screen</p>
        )}
      </div>
      {deferredPrompt && (
        <button
          onClick={install}
          className="flex-shrink-0 rounded-lg bg-saffron-400 px-3 py-1.5 text-xs font-semibold text-graphite-900 hover:bg-saffron-300"
        >
          Install
        </button>
      )}
      <button onClick={dismiss} className="flex-shrink-0 text-graphite-300 hover:text-white" aria-label="Dismiss">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
