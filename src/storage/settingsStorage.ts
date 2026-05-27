// Settings storage — single object, merged with defaults on read.

import type { Settings } from '@/domain/types'
import { DEFAULT_SETTINGS } from '@/domain/types'

const KEY = 'peel-settings'

export function getSettings(): Settings {
  if (typeof localStorage === 'undefined') return DEFAULT_SETTINGS
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULT_SETTINGS
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(settings: Settings): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(KEY, JSON.stringify(settings))
  } catch {
    // quota exceeded — silently fail to prevent app crash
  }
}

export function updateSetting<K extends keyof Settings>(
  key: K,
  value: Settings[K],
): Settings {
  const current = getSettings()
  const updated = { ...current, [key]: value }
  saveSettings(updated)
  return updated
}
