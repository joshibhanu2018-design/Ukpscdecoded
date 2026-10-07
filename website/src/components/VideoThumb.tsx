"use client";

import { useState } from "react";
import { PlayCircle } from "lucide-react";

/**
 * 16:9 lesson thumbnail (Bunny) with a numbered placeholder when there is no
 * image yet or it fails to load.
 */
export default function VideoThumb({
  src,
  label,
  className = "",
}: {
  src: string | null;
  label: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`relative aspect-video flex-shrink-0 overflow-hidden rounded-lg bg-graphite-800 ${className}`}>
      {src && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element -- Bunny CDN image, already sized
        <img src={src} alt="" loading="lazy" decoding="async" onError={() => setFailed(true)} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-0.5 text-graphite-300">
          <PlayCircle className="h-5 w-5" />
          <span className="text-[10px] font-semibold">{label}</span>
        </div>
      )}
    </div>
  );
}
