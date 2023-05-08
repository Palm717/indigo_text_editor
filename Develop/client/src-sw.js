import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";
import { offlineFallback } from "workbox-recipes";

// Precache and route all static assets in the build directory
precacheAndRoute(self.__WB_MANIFEST || []);

// Cache images using a CacheFirst strategy
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "images",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Cache pages using a CacheFirst strategy
const pageCache = new CacheFirst({
  cacheName: "pages",
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
    }),
  ],
});
registerRoute(
  ({ request }) => request.mode === "navigate",
  ({ event }) => {
    const fetchPromise = fetch(event.request);
    return fetchPromise.catch(() => pageCache.match("offline.html"));
  }
);

// Fallback to a custom offline page if a page can't be loaded
offlineFallback({
  pageFallback: "offline.html",
  imageFallback: "offline.png",
  documentCriteria: {
    // Only use the fallback for navigation requests
    // (e.g. HTML pages), but not for API requests
    // (e.g. JSON, XML, or other data requests)
    fetchOptions: {
      mode: "navigate",
    },
  },
  imageCriteria: {
    // Use the fallback image for any image request
    fetchOptions: {
      mode: "no-cors",
    },
  },
});
