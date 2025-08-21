/**
 * Forge3D Cotizador - Service Worker
 * PWA offline functionality and caching
 * Version: 2.1.0
 */

const CACHE_NAME = 'forge3d-v2.1.0';
const STATIC_CACHE = 'forge3d-static-v2.1.0';
const DYNAMIC_CACHE = 'forge3d-dynamic-v2.1.0';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/css/styles.css',
  '/assets/js/config.js',
  '/assets/js/app.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

// Files that should always be fetched from network
const NETWORK_FIRST = [
  '/api/',
  'https://bio.goldtech.mx/'
];

// Maximum number of items in dynamic cache
const MAX_DYNAMIC_CACHE_SIZE = 50;

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('SW: Installing service worker v2.1.0');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('SW: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('SW: Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('SW: Error caching static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('SW: Activating service worker v2.1.0');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== CACHE_NAME) {
              console.log('SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all pages
      self.clients.claim()
    ])
  );
});

// Fetch event - serve cached files or fetch from network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  event.respondWith(
    handleFetch(request)
  );
});

/**
 * Main fetch handler with different strategies
 */
async function handleFetch(request) {
  const url = new URL(request.url);
  
  try {
    // Strategy 1: Network first for API calls and dynamic content
    if (NETWORK_FIRST.some(pattern => url.pathname.startsWith(pattern))) {
      return await networkFirst(request);
    }
    
    // Strategy 2: Cache first for static assets
    if (isStaticAsset(url)) {
      return await cacheFirst(request);
    }
    
    // Strategy 3: Stale while revalidate for HTML pages
    if (request.headers.get('accept')?.includes('text/html')) {
      return await staleWhileRevalidate(request);
    }
    
    // Strategy 4: Network first with fallback for everything else
    return await networkFirst(request);
    
  } catch (error) {
    console.error('SW: Fetch error:', error);
    return await handleFetchError(request);
  }
}

/**
 * Cache first strategy - try cache, then network
 */
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    console.log('SW: Serving from cache:', request.url);
    return cachedResponse;
  }
  
  console.log('SW: Cache miss, fetching from network:', request.url);
  const networkResponse = await fetch(request);
  
  if (networkResponse.ok) {
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

/**
 * Network first strategy - try network, then cache
 */
async function networkFirst(request) {
  try {
    console.log('SW: Fetching from network:', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      
      // Clean up dynamic cache if it gets too large
      cleanupDynamicCache();
    }
    
    return networkResponse;
    
  } catch (error) {
    console.log('SW: Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

/**
 * Stale while revalidate strategy
 */
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  // Fetch from network in background
  const networkResponsePromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });
  
  // Return cached version immediately if available
  if (cachedResponse) {
    console.log('SW: Serving stale content:', request.url);
    return cachedResponse;
  }
  
  // If no cache, wait for network
  console.log('SW: No cache, waiting for network:', request.url);
  return networkResponsePromise;
}

/**
 * Handle fetch errors with appropriate fallbacks
 */
async function handleFetchError(request) {
  const url = new URL(request.url);
  
  // For HTML requests, serve offline page
  if (request.headers.get('accept')?.includes('text/html')) {
    const offlineResponse = await caches.match('/offline.html');
    if (offlineResponse) {
      return offlineResponse;
    }
    
    // Fallback offline page
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Sin Conexión - Forge3D</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 50px;
              background: linear-gradient(135deg, #0e0e0e 0%, #1a1a2e 100%);
              color: #e0e0e0;
              min-height: 100vh;
              margin: 0;
            }
            .container {
              max-width: 500px;
              margin: 0 auto;
              background: rgba(26, 26, 46, 0.9);
              padding: 2rem;
              border-radius: 20px;
              border: 1px solid rgba(205, 148, 48, 0.2);
            }
            h1 { color: #CD9430; margin-bottom: 1rem; }
            p { line-height: 1.6; margin-bottom: 1rem; }
            .retry-btn {
              background: #CD9430;
              color: #000;
              padding: 0.8rem 1.5rem;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-weight: bold;
              text-decoration: none;
              display: inline-block;
              margin-top: 1rem;
            }
            .retry-btn:hover { background: #e1aa4a; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>📶 Sin Conexión</h1>
            <p>No hay conexión a internet disponible.</p>
            <p>El Cotizador Forge3D puede funcionar sin conexión con las funciones básicas.</p>
            <p>Algunas características pueden estar limitadas hasta que se restablezca la conexión.</p>
            <a href="/" class="retry-btn" onclick="location.reload()">🔄 Reintentar</a>
          </div>
          <script>
            // Auto-retry when back online
            window.addEventListener('online', () => {
              location.reload();
            });
          </script>
        </body>
      </html>
    `, {
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    });
  }
  
  // For other requests, return a network error
  return new Response('Network error', {
    status: 408,
    statusText: 'Network error'
  });
}

/**
 * Check if URL is a static asset
 */
function isStaticAsset(url) {
  const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf'];
  return staticExtensions.some(ext => url.pathname.endsWith(ext));
}

/**
 * Clean up dynamic cache to prevent unlimited growth
 */
async function cleanupDynamicCache() {
  const cache = await caches.open(DYNAMIC_CACHE);
  const keys = await cache.keys();
  
  if (keys.length > MAX_DYNAMIC_CACHE_SIZE) {
    console.log('SW: Cleaning up dynamic cache');
    const excessKeys = keys.slice(0, keys.length - MAX_DYNAMIC_CACHE_SIZE);
    
    await Promise.all(
      excessKeys.map(key => cache.delete(key))
    );
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('SW: Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

/**
 * Handle background sync
 */
async function doBackgroundSync() {
  try {
    // Check if online
    const response = await fetch('/ping', { method: 'HEAD' });
    
    if (response.ok) {
      console.log('SW: Background sync - connection restored');
      
      // Notify all clients about connectivity
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({
          type: 'CONNECTION_RESTORED',
          timestamp: Date.now()
        });
      });
    }
  } catch (error) {
    console.log('SW: Background sync - still offline');
  }
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  console.log('SW: Push notification received');
  
  const options = {
    body: 'Nueva actualización disponible para Forge3D',
    icon: '/assets/images/icon-192x192.png',
    badge: '/assets/images/badge-72x72.png',
    tag: 'forge3d-update',
    data: {
      url: '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('Forge3D Cotizador', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('SW: Notification clicked');
  
  event.notification.close();
  
  const url = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.openWindow(url)
  );
});

// Message handling for communication with main app
self.addEventListener('message', (event) => {
  console.log('SW: Message received:', event.data);
  
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0].postMessage({
        version: '2.1.0',
        cacheName: CACHE_NAME
      });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
      
    default:
      console.log('SW: Unknown message type:', type);
  }
});

/**
 * Clear all caches
 */
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
  console.log('SW: All caches cleared');
}

// Error handling
self.addEventListener('error', (event) => {
  console.error('SW: Service worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('SW: Unhandled promise rejection:', event.reason);
});

console.log('SW: Service worker script loaded v2.1.0');