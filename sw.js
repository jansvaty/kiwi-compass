const CACHE = "kiwi-compass-v17";
const ASSETS = [
  ".",
  "index.html",
  "app.html",
  "css/style.css?v=17",
  "js/data.js?v=17",
  "js/scoring.js?v=17",
  "js/app.js?v=17",
  "manifest.webmanifest",
  "icons/logo.svg",
  "icons/icon-180.png",
  "icons/icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first (revalidating past the HTTP cache) so updates land
// immediately; the cache is the offline fallback.
self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request, { cache: "no-cache" })
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
