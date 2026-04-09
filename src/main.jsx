import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

import { registerSW } from 'virtual:pwa-register'

// When a new service worker is available, update and reload immediately.
// This prevents the installed PWA from showing a broken cached version
// after a new deployment has been pushed.
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    // New version detected — activate it and reload to serve fresh assets.
    updateSW(true)
  },
  onOfflineReady() {
    // App is ready for offline use (silent, no UI needed for now).
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
