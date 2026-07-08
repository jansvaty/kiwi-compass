const CACHE = "kiwi-compass-v16";
const ASSETS = [
  ".",
  "index.html",
  "app.html",
  "css/style.css",
  "js/data.js",
  "js/scoring.js",
  "js/app.js",
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

// Network-first so updates land immediately; cache is the offline fallback.
self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
