"use client";

import { useState } from "react";
import { FileText, PlayCircle, Download, ExternalLink, ListVideo } from "lucide-react";
import { getIcon } from "@/lib/icons";
import type { YouTubeVideo } from "@/lib/youtube";
import VideoGrid from "./VideoGrid";
import freeResources from "@content/freeResources.json";

interface Resource {
  title: string;
  description: string;
  type: string;
  url: string;
  icon?: string;
}
interface Playlist {
  title: string;
  description: string;
  url: string;
}

const tabs = ["Free Resources", "Video Lectures"] as const;
type TabType = (typeof tabs)[number];

export default function FreeContentTabs({ videos }: { videos: YouTubeVideo[] }) {
  const [activeTab, setActiveTab] = useState<TabType>("Free Resources");

  const resources = (freeResources.resources as Resource[]) || [];
  const playlists = (freeResources.playlists as Playlist[]) || [];

  return (
    <>
      {/* Tab Switcher */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex bg-white rounded-xl p-1.5 shadow-md border border-graphite-100">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === tab
                  ? "bg-saffron-500 text-white shadow-md"
                  : "text-graphite-600 hover:text-graphite-900 hover:bg-graphite-50"
              }`}
            >
              {tab === "Free Resources" ? (
                <FileText className="w-4 h-4" />
              ) : (
                <PlayCircle className="w-4 h-4" />
              )}
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ===== FREE RESOURCES TAB ===== */}
      {activeTab === "Free Resources" && (
        <div>
          <div className="text-center mb-10">
            <h2 className="heading-md text-graphite-900 mb-2">{freeResources.heading}</h2>
            <p className="text-graphite-600 max-w-2xl mx-auto">{freeResources.subheading}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {resources.map((res) => {
              const Icon = getIcon(res.icon);
              return (
                <a
                  key={res.title}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card group flex items-start gap-4 p-6 hover:border-saffron-300 transition-all"
                >
                  <span className="flex-shrink-0 w-12 h-12 rounded-xl bg-saffron-50 text-saffron-600 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-jade-100 text-jade-700 uppercase tracking-wide">
                        {res.type}
                      </span>
                    </div>
                    <h3 className="font-display font-semibold text-graphite-900 group-hover:text-saffron-600 transition-colors">
                      {res.title}
                    </h3>
                    <p className="text-sm text-graphite-500 mt-1.5 leading-relaxed">
                      {res.description}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-saffron-600 group-hover:gap-2.5 transition-all">
                      <Download className="w-4 h-4" />
                      Open / Download
                    </span>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Playlists */}
          {playlists.length > 0 && (
            <div className="max-w-4xl mx-auto mt-8">
              {playlists.map((pl) => (
                <a
                  key={pl.title}
                  href={pl.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card group flex items-center gap-4 p-6 hover:border-red-300 transition-all"
                >
                  <span className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                    <ListVideo className="w-6 h-6" />
                  </span>
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-graphite-900 group-hover:text-red-600 transition-colors">
                      {pl.title}
                    </h3>
                    <p className="text-sm text-graphite-500 mt-1">{pl.description}</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-graphite-400 group-hover:text-red-600 transition-colors" />
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===== VIDEO LECTURES TAB ===== */}
      {activeTab === "Video Lectures" && <VideoGrid videos={videos} />}
    </>
  );
}
