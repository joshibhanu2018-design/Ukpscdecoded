import {
  Video,
  Send,
  PlayCircle,
} from "lucide-react";
import { fetchChannelVideos, type YouTubeVideo } from "@/lib/youtube";
import VideoGrid from "./VideoGrid";

// Fallback data in case YouTube API fails or returns empty
const fallbackVideos: YouTubeVideo[] = [
  {
    id: "dQw4w9WgXcQ",
    title: "Complete History of Uttarakhand — Ancient Period",
    description: "Detailed lecture covering the ancient history of Uttarakhand from prehistoric times to early kingdoms.",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    publishedAt: "2025-01-15T10:00:00Z",
    category: "UK Special",
  },
  {
    id: "jNQXAC9IVRw",
    title: "Katyuri & Chand Dynasty — Detailed Analysis",
    description: "In-depth analysis of the Katyuri and Chand dynasties, their contributions and important facts for exams.",
    thumbnail: "https://img.youtube.com/vi/jNQXAC9IVRw/hqdefault.jpg",
    publishedAt: "2025-01-12T10:00:00Z",
    category: "UK Special",
  },
  {
    id: "9bZkp7q19f0",
    title: "Weekly Current Affairs — July 2026 Week 1",
    description: "Complete coverage of Uttarakhand and national current affairs for the first week of July 2026.",
    thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg",
    publishedAt: "2026-07-07T10:00:00Z",
    category: "Current Affairs",
  },
  {
    id: "kJQP7kiw5Fk",
    title: "UKPSC PYQ Analysis — Polity & Governance 2023",
    description: "Complete analysis of Previous Year Questions from UKPSC PCS Prelims 2023 on Polity & Governance.",
    thumbnail: "https://img.youtube.com/vi/kJQP7kiw5Fk/hqdefault.jpg",
    publishedAt: "2025-02-10T10:00:00Z",
    category: "PYQ",
  },
  {
    id: "RgKAFK5djSk",
    title: "Rivers & Glaciers of Uttarakhand — Complete Mapping",
    description: "Detailed mapping and explanation of all major rivers, tributaries, and glaciers of Uttarakhand.",
    thumbnail: "https://img.youtube.com/vi/RgKAFK5djSk/hqdefault.jpg",
    publishedAt: "2025-01-20T10:00:00Z",
    category: "UK Special",
  },
  {
    id: "JGwWNGJdvx8",
    title: "Climate Zones & Biodiversity of Uttarakhand",
    description: "Explore the diverse climate zones and rich biodiversity of Uttarakhand for UKPSC exams.",
    thumbnail: "https://img.youtube.com/vi/JGwWNGJdvx8/hqdefault.jpg",
    publishedAt: "2025-02-01T10:00:00Z",
    category: "UK Special",
  },
  {
    id: "OPf0YbXqDm0",
    title: "Uttarakhand Economy — Key Sectors & GDP Analysis",
    description: "Comprehensive analysis of Uttarakhand's economic sectors, GDP trends, and key statistics.",
    thumbnail: "https://img.youtube.com/vi/OPf0YbXqDm0/hqdefault.jpg",
    publishedAt: "2025-02-15T10:00:00Z",
    category: "UK Special",
  },
  {
    id: "60ItHLz5WEA",
    title: "PYQ Analysis — Geography & Environment 2022-23",
    description: "Previous year question analysis covering Geography and Environment from recent UKPSC papers.",
    thumbnail: "https://img.youtube.com/vi/60ItHLz5WEA/hqdefault.jpg",
    publishedAt: "2025-03-01T10:00:00Z",
    category: "PYQ",
  },
  {
    id: "lp-EO5I60KA",
    title: "Weekly Current Affairs — June 2026 Week 4",
    description: "Latest current affairs roundup for the last week of June 2026 with exam-relevant highlights.",
    thumbnail: "https://img.youtube.com/vi/lp-EO5I60KA/hqdefault.jpg",
    publishedAt: "2026-06-28T10:00:00Z",
    category: "Current Affairs",
  },
];

export default async function FreeContentPage() {
  // Fetch real videos from YouTube API
  let videos: YouTubeVideo[] = [];

  try {
    videos = await fetchChannelVideos();
  } catch (error) {
    console.error("Failed to fetch YouTube videos:", error);
  }

  // Use fallback data if API returns empty
  if (videos.length === 0) {
    videos = fallbackVideos;
  }

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
          <VideoGrid videos={videos} />
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
