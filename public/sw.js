const CACHE_NAME = 'peel-v2'
const STATIC_ASSETS = [
  '/peel/',
  '/peel/manifest.json',
  '/peel/icon-192.png',
  '/peel/icon-512.png',
]

// Install: pre-cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  )
  self.clients.claim()
})

// Fetch: network-first for all navigation and assets, falling back to cache if offline
self.addEventListener('fetch', (event) => {
  const { request } = event

  // Only handle same-origin GET requests
  if (request.method !== 'GET') return
  if (!request.url.startsWith(self.location.origin)) return

  // Network-first strategy for everything (always try network, update cache, fallback to cache if offline)
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
        }
        return response
      })
      .catch(() => {
        // Fallback to cache if offline
        return caches.match(request).then((cached) => {
          if (cached) return cached
          // If navigation, return root '/peel/' from cache if it exists
          if (request.mode === 'navigate') {
            return caches.match('/peel/')
          }
        })
      })
  )
})
