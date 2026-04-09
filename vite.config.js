import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // 'prompt' lets us manually call updateSW() so we control exactly when
      // the new service worker takes over — preventing stale-cache breakage.
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png'],
      workbox: {
        // Force the new SW to activate immediately without waiting for all
        // tabs/windows using the old version to be closed.
        skipWaiting: true,
        // Immediately claim all open clients so requests go through the new SW.
        clientsClaim: true,
        // Cache JS/CSS assets with stale-while-revalidate (fast + fresh).
        runtimeCaching: [
          {
            // Navigation requests (HTML) always go Network-first so the user
            // gets the up-to-date app shell after a deployment.
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'navigation-cache',
              networkTimeoutSeconds: 5,
            },
          },
          {
            // Static assets: JS, CSS, images — cache-first is fine since
            // Vite fingerprints filenames on every build.
            urlPattern: ({ request }) =>
              ['script', 'style', 'image', 'font'].includes(request.destination),
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-assets',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
      manifest: {
        name: 'FieldDictate',
        short_name: 'FieldDictate',
        description: 'Voice-to-text job notes built for the field.',
        theme_color: '#f8fafc',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
