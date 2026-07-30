"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Video,
  Send,
  Clock,
  PlayCircle,
  Filter,
} from "lucide-react";

const categories = [
  "All",
  "History & Culture",
  "Polity",
  "Geography",
  "Economy",
  "Disaster & HRD",
  "Current Affairs",
];

const videos = [
  {
    title: "Complete History of Uttarakhand — Ancient Period",
    category: "History & Culture",
    youtubeId: "dQw4w9WgXcQ",
    duration: "45:12",
  },
  {
    title: "Katyuri & Chand Dynasty — Detailed Analysis",
    category: "History & Culture",
    youtubeId: "jNQXAC9IVRw",
    duration: "38:20",
  },
  {
    title: "Uttarakhand Legislative Assembly — Structure & Functions",
    category: "Polity",
    youtubeId: "9bZkp7q19f0",
    duration: "32:45",
  },
  {
    title: "Panchayati Raj System in Uttarakhand",
    category: "Polity",
    youtubeId: "kJQP7kiw5Fk",
    duration: "28:30",
  },
  {
    title: "Rivers & Glaciers of Uttarakhand — Complete Mapping",
    category: "Geography",
    youtubeId: "RgKAFK5djSk",
    duration: "52:18",
  },
  {
    title: "Climate Zones & Biodiversity of Uttarakhand",
    category: "Geography",
    youtubeId: "JGwWNGJdvx8",
    duration: "41:05",
  },
  {
    title: "Uttarakhand Economy — Key Sectors & GDP Analysis",
    category: "Economy",
    youtubeId: "OPf0YbXqDm0",
    duration: "35:40",
  },
  {
    title: "Tourism & Char Dham Economy Impact",
    category: "Economy",
    youtubeId: "fRh_vgS2dFE",
    duration: "29:15",
  },
  {
    title: "Disaster Management Framework — SDMA Uttarakhand",
    category: "Disaster & HRD",
    youtubeId: "60ItHLz5WEA",
    duration: "44:30",
  },
  {
    title: "2013 Kedarnath Disaster — Case Study & Lessons",
    category: "Disaster & HRD",
    youtubeId: "hT_nvWreIhg",
    duration: "37:22",
  },
  {
    title: "Weekly Current Affairs — January 2025 Week 3",
    category: "Current Affairs",
    youtubeId: "lp-EO5I60KA",
    duration: "25:10",
  },
  {
    title: "Uttarakhand Budget 2025 — Key Highlights for Exams",
    category: "Current Affairs",
    youtubeId: "pRpeEdMmmQ0",
    duration: "33:48",
  },
];

export default function FreeContentPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredVideos =
    activeCategory === "All"
      ? videos
      : videos.filter((video) => video.category === activeCategory);

  return (
    <div>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-graphite-950 via-graphite-900 to-graphite-800 text-white">
        <div className="container-custom text-center">
          <div className="inline-flex items-center gap-2 bg-saffron-500/10 border border-saffron-500/20 rounded-full px-4 py-1.5 mb-6">
            <PlayCircle className="w-4 h-4 text-saffron-400" />
            <span className="text-sm text-saffron-300 font-medium">
              100% Free — No Sign-up Required
            </span>
          </div>
          <h1 className="heading-xl text-white mb-6 max-w-4xl mx-auto">
            Free Video Lectures —{" "}
            <span className="text-saffron-400">
              Learn Uttarakhand GK Systematically
            </span>
          </h1>
          <p className="text-lg md:text-xl text-graphite-300 max-w-2xl mx-auto leading-relaxed">
            Chapter-wise video lectures covering the complete UKPSC syllabus.
            Watch at your own pace, revise anytime. All content available on our
            YouTube channel.
          </p>
        </div>
      </section>

      {/* Category Filter + Video Grid */}
      <section className="section-padding bg-ivory-50">
        <div className="container-custom">
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
            {filteredVideos.map((video, index) => (
              <a
                key={index}
                href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="card group cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="relative overflow-hidden">
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <PlayCircle className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  {/* Duration Badge */}
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {video.duration}
                  </div>
                </div>
                {/* Content */}
                <div className="p-5">
                  <span className="inline-block bg-jade-50 text-jade-700 text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
                    {video.category}
                  </span>
                  <h3 className="font-display font-semibold text-graphite-900 group-hover:text-saffron-600 transition-colors line-clamp-2">
                    {video.title}
                  </h3>
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
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-padding bg-graphite-900 text-white">
        <div className="container-custom text-center">
          <h2 className="heading-md text-white mb-4">
            Never Miss a New Lecture
          </h2>
          <p className="text-graphite-400 text-lg max-w-xl mx-auto mb-8">
            Subscribe to our YouTube channel for weekly video uploads and join
            Telegram for instant notifications & study material.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://youtube.com/@ukpscdecoded"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Video className="w-5 h-5" />
              Subscribe on YouTube
            </a>
            <a
              href="https://t.me/ukpscdecoded"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Join Telegram Channel
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
