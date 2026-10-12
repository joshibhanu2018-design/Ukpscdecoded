"use client";

import { useEffect, useRef, useState } from "react";
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
  const img = useRef<HTMLImageElement>(null);
  // An image that failed before hydration never fires onError in React: check it once mounted.
  useEffect(() => {
    const el = img.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, [src]);
  return (
    <div className={`relative aspect-video flex-shrink-0 overflow-hidden rounded-lg bg-graphite-800 ${className}`}>
      {src && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element -- Bunny CDN image, already sized
        <img ref={img} src={src} alt="" loading="lazy" decoding="async" onError={() => setFailed(true)} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-0.5 text-graphite-300">
          <PlayCircle className="h-5 w-5" />
          <span className="text-[10px] font-semibold">{label}</span>
        </div>
      )}
    </div>
  );
}
