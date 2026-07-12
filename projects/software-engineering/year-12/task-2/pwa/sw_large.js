const VERSION = "v19";
const CACHE_NAME = `learner-hours-${VERSION}`;

const APP_STATIC_RESOURCES = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/LearnerHours.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      // Open the specified cache.
      const cache = await caches.open(CACHE_NAME);  
      // Add all static files to the cache.
      cache.addAll(APP_STATIC_RESOURCES);   
    })(), // Immediately invoke the async function.
  );
});

// delete old caches on activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Get a list of all the caches
      const names = await caches.keys();
      // Go through the list
      await Promise.all(
        names.map((name) => {
          // Check if it is not the current cache
          if (name !== CACHE_NAME) {
	    // delete it
            return caches.delete(name);
          }
        }),
      );
      // Set the current service worker as the controller
      await clients.claim();
    })(),
  );
});

//attempts to use cache first, then network
self.addEventListener("fetch", (event) => {
  //only get static files (GET requests means retrieving data, not modifying it)
  if (event.request.method !== "GET") return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      
      //verify cache
      const cachedResponse = await cache.match(event.request);
      
      if (cachedResponse) {
        //if found in cache, return it immediately
        return cachedResponse;
      }

      //if not in cache, go to network
      try {
        const networkResponse = await fetch(event.request);
        
        //store in cache if valid response for future use
        if (networkResponse.ok) {
          cache.put(event.request, networkResponse.clone());
        }
        
        return networkResponse;
      } catch (error) {
        //if all fail, give fallback (e.g. may be offline)
        return new Response("Offline content not available", { status: 503 });
      }
    })()
  );
});

