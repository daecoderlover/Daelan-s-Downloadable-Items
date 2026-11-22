const CACHE_NAME = "v1.3.8.2.2 (sw.js fix)";
const OFFLINE_CACHE = "daelan-offline-locals-v1";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./loader-hook.js",
  "./download.html",
  "./manifest.json",
  "./gem192.png",
  "./Daelan_0_web/assets/cordova.png",
  "./Daelan_0_web/assets/webview.png"
];

// Install: cache core page assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.allSettled(CORE_ASSETS.map(url => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

// Activate: delete old outdated caches (while keeping OFFLINE_CACHE safe) and broadcast the new version
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME && name !== OFFLINE_CACHE)
          .map(name => caches.delete(name))
      );
    })
    .then(() => self.clients.claim())
    .then(() => self.clients.matchAll({ type: "window" }))
    .then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: "VERSION_UPDATE",
          version: CACHE_NAME
        });
      });
    })
  );
});

// Message: handle version requests, "+ Add to Locals", and "Remove" from script.js
self.addEventListener("message", (event) => {
  if (!event.data) return;

  if (event.data.type === "GET_VERSION") {
    event.source.postMessage({
      type: "VERSION_UPDATE",
      version: CACHE_NAME
    });
  }

  if (event.data.type === "SAVE_LOCAL_ITEM") {
    caches.open(OFFLINE_CACHE).then(async (cache) => {
      for (const url of event.data.urls) {
        const directUrl = url.replace(
  "https://github.com",
  "https://githubusercontent.com"
);
        const response = await fetch(directUrl, { mode: "no-cors" });
        await cache.put(url, response);
      }
    }).then(() => {
      event.source.postMessage({
        type: "LOCAL_ITEM_SAVED",
        id: event.data.id
      });
    }).catch((err) => {
      console.error("Failed to cache item locally:", err);
    });
  }

  if (event.data.type === "REMOVE_LOCAL_ITEM") {
    caches.open(OFFLINE_CACHE).then((cache) => {
      return Promise.all(event.data.urls.map(url => cache.delete(url)));
    });
  }
});

// Fetch: serve saved Local files offline, otherwise network first with core fallback
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open(OFFLINE_CACHE).then((offlineCache) => {
      return offlineCache.match(event.request, { ignoreSearch: true }).then((cachedLocalFile) => {
        if (cachedLocalFile) {
          return cachedLocalFile;
        }
        return fetch(event.request).catch(() => caches.match(event.request, { ignoreSearch: true }));
      });
    })
  );
});
