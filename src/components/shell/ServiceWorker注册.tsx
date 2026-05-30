'use client'

import { useEffect } from 'react'

export function ServiceWorker注册() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/peel/sw.js').catch(() => {
        // SW registration failed — app works fine without it
      })
    }
  }, [])

  return null
}
