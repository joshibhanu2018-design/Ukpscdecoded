"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize, Minimize } from "lucide-react";

const POSITIONS = [
  { top: "12%", left: "8%" },
  { top: "70%", left: "55%" },
  { top: "40%", left: "30%" },
  { top: "18%", left: "58%" },
  { top: "62%", left: "10%" },
];

/**
 * Lesson video with a drifting watermark of the student's email/phone (so a
 * screen recording shows who shared it). Full screen is done on our wrapper,
 * not the player's own button, so the watermark stays on top in full screen.
 * For YouTube, transparent covers stop taps on the title bar and logo that
 * would open (and expose) the video on YouTube.
 */
export default function ProtectedPlayer({
  src,
  kind,
  title,
  watermark,
}: {
  src: string;
  kind: "youtube" | "bunny";
  title: string;
  watermark: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(0);
  const [full, setFull] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setPos((p) => (p + 1) % POSITIONS.length), 15000);
    const onChange = () => setFull(document.fullscreenElement === wrapRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => {
      clearInterval(t);
      document.removeEventListener("fullscreenchange", onChange);
    };
  }, []);

  const toggleFull = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => {});
      return;
    }
    await wrapRef.current?.requestFullscreen().catch(() => {});
    const orientation = screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> };
    await orientation.lock?.("landscape").catch(() => {});
  };

  return (
    <div>
      <div
        ref={wrapRef}
        onContextMenu={(e) => e.preventDefault()}
        className={`relative overflow-hidden bg-black ${full ? "h-full w-full" : "aspect-video rounded-2xl border border-graphite-800"}`}
      >
        <iframe
          src={src}
          title={title}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full"
        />
        {kind === "youtube" && (
          <>
            <div aria-hidden className="absolute inset-x-0 top-0 h-14" />
            <div aria-hidden className="absolute bottom-0 right-0 h-12 w-28" />
          </>
        )}
        <p
          aria-hidden
          style={POSITIONS[pos]}
          className="pointer-events-none absolute select-none whitespace-nowrap text-[11px] font-semibold text-white/40 transition-all duration-1000 [text-shadow:0_0_3px_rgba(0,0,0,0.8)] sm:text-sm"
        >
          {watermark}
        </p>
        {full && (
          <button
            type="button"
            onClick={() => void toggleFull()}
            className="absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-lg bg-black/60 px-3 py-1.5 text-xs text-white"
          >
            <Minimize className="h-3.5 w-3.5" /> Exit full screen
          </button>
        )}
      </div>
      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={() => void toggleFull()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-graphite-700 px-3 py-1.5 text-xs text-graphite-200 hover:border-saffron-400"
        >
          {full ? <Minimize className="h-3.5 w-3.5" /> : <Maximize className="h-3.5 w-3.5" />} {full ? "Exit full screen" : "Full screen"}
        </button>
      </div>
    </div>
  );
}
