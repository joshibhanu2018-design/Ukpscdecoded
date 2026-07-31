"use client";

import { useState } from "react";
import {
  Clock,
  PlayCircle,
  Filter,
  Calendar,
} from "lucide-react";
import type { YouTubeVideo } from "@/lib/youtube";

const categories = ["All", "UK Special", "PYQ", "Current Affairs", "Strategy", "National", "Shorts"];

function getCategoryColor(category: string): string {
  switch (category) {
    case "UK Special":
      return "bg-jade-50 text-jade-700";
    case "Shorts":
      return "bg-pink-50 text-pink-700";
    case "PYQ":
      return "bg-saffron-50 text-saffron-700";
    case "Current Affairs":
      return "bg-blue-50 text-blue-700";
    case "Strategy":
      return "bg-purple-50 text-purple-700";
    case "National":
      return "bg-graphite-100 text-graphite-700";
    default:
      return "bg-jade-50 text-jade-700";
  }
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default function VideoGrid({ videos }: { videos: YouTubeVideo[] }) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredVideos = (
    activeCategory === "All"
      ? videos
      : videos.filter((video) => video.category === activeCategory)
  )
    // Keep YouTube Shorts at the end — both in the "All" view and within any tab.
    .slice()
    .sort(
      (a, b) => (a.category === "Shorts" ? 1 : 0) - (b.category === "Shorts" ? 1 : 0)
    );

  return (
    <>
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
        <Filter className="w-5 h-5 text-graphite-500 flex-shrink-0" />
        <div className="flex gap-2 flex-nowrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeCategory === category
                  ? "bg-saffron-500 text-white shadow-md"
                  : "bg-white text-graphite-700 hover:bg-graphite-100 border border-graphite-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <a
            key={video.id}
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="card group cursor-pointer"
          >
            {/* Thumbnail */}
            <div className="relative overflow-hidden">
              <img
                src={video.thumbnail || `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                alt={video.title}
                className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                <PlayCircle className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              {/* Duration Badge */}
              {video.duration && (
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {video.duration}
                </div>
              )}
              {/* Free Preview Badge */}
              {video.freePreview && (
                <div className="absolute top-2 left-2 bg-jade-600 text-white text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                  <PlayCircle className="w-3 h-3" />
                  Free Preview
                </div>
              )}
            </div>
            {/* Content */}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${getCategoryColor(video.category)}`}>
                  {video.category}
                </span>
                {video.publishedAt && (
                  <span className="flex items-center gap-1 text-xs text-graphite-500">
                    <Calendar className="w-3 h-3" />
                    {formatDate(video.publishedAt)}
                  </span>
                )}
              </div>
              <h3 className="font-display font-semibold text-graphite-900 group-hover:text-saffron-600 transition-colors line-clamp-2">
                {video.title}
              </h3>
              {video.description && (
                <p className="text-sm text-graphite-500 mt-2 line-clamp-2">
                  {video.description}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>

      {/* Empty State */}
      {filteredVideos.length === 0 && (
        <div className="text-center py-16">
          <p className="text-graphite-500 text-lg">
            No videos found in this category. Check back soon!
          </p>
        </div>
      )}
    </>
  );
}
