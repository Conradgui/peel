const CACHE_NAME = 'peel-v1'
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
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

// Fetch: network-first for navigation, cache-first for assets
self.addEventListener('fetch', (event) => {
  const { request } = event

  // Only handle same-origin GET requests
  if (request.method !== 'GET') return
  if (!request.url.startsWith(self.location.origin)) return

  if (request.mode === 'navigate') {
    // Network-first for page navigations
    event.respondWith(
      fetch(request).catch(() => caches.match('/'))
    )
  } else {
    // Cache-first for static assets
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached
        return fetch(request).then((response) => {
          // Cache successful responses
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          }
          return response
        })
      })
    )
  }
})
