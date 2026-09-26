import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Old marketing pages (stale prices and "register interest" forms) now
  // point at the live store, so old links in videos/posts keep working.
  async redirects() {
    return [
      // One address for Google: the old vercel.app URL and the bare domain
      // permanently redirect to www.ukpscdecoded.in (same path). /api/* is
      // left alone so the CMS login (public/admin/config.yml base_url) keeps working.
      ...["ukpscdecoded.vercel.app", "ukpscdecoded.in"].map((host) => ({
        source: "/:path((?!api/).*)",
        has: [{ type: "host" as const, value: host }],
        destination: "https://www.ukpscdecoded.in/:path",
        permanent: true,
      })),
      { source: "/paid-courses", destination: "/courses", permanent: true },
      { source: "/paid-course", destination: "/courses/crash-course", permanent: true },
    ];
  },
};

export default nextConfig;
