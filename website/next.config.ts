import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Old marketing pages (stale prices and "register interest" forms) now
  // point at the live store, so old links in videos/posts keep working.
  async redirects() {
    return [
      { source: "/paid-courses", destination: "/courses", permanent: true },
      { source: "/paid-course", destination: "/courses/crash-course", permanent: true },
    ];
  },
};

export default nextConfig;
