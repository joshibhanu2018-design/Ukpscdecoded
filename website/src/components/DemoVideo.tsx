"use client";

import { useState } from "react";
import { PlayCircle } from "lucide-react";

/**
 * A free preview video. Shows the YouTube thumbnail and only loads the
 * player (youtube-nocookie) when tapped, so a course page doesn't pull
 * ~1 MB of player script per video on a slow phone connection.
 */
export default function DemoVideo({ title, youtubeId }: { title: string; youtubeId: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <figure className="overflow-hidden rounded-xl border border-graphite-800 bg-graphite-900/60">
      <div className="relative aspect-video w-full bg-graphite-950">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 flex h-full w-full items-center justify-center"
            aria-label={`Play: ${title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- YouTube thumbnail host isn't allow-listed for next/image */}
            <img
              src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
            />
            <PlayCircle className="relative h-16 w-16 text-saffron-300 drop-shadow-lg" />
          </button>
        )}
      </div>
      <figcaption className="px-4 py-3 text-sm font-medium text-graphite-200">{title}</figcaption>
    </figure>
  );
}
