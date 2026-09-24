// UKPSC Decoded service worker — exists only to make the site installable
// ("Add to Home Screen"). Deliberately does NOT cache page navigations:
// every page here can show a price, a purchase state, or account data
// (dashboard, store, checkout), so caching HTML would risk showing stale
// prices or another user's data on a shared device. Only truly static,
// content-free assets (icons) are cached.
const CACHE_NAME = "ukpsc-shell-v1";
const PRECACHE_URLS = ["/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Never intercept navigations or API calls — always go to the network,
  // so prices/auth state/account data are always fresh.
  if (event.request.mode === "navigate" || url.pathname.startsWith("/api/")) {
    return;
  }

  // Cache-first only for the precached static icon assets.
  if (PRECACHE_URLS.includes(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request))
    );
  }
});
