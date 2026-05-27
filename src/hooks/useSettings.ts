'use client'

import { useState, useCallback } from 'react'
import { getSettings, saveSettings, updateSetting } from '@/storage/settingsStorage'
import type { Settings } from '@/domain/types'

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => getSettings())

  const update = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    const updated = updateSetting(key, value)
    setSettings(updated)
  }, [])

  const save = useCallback((s: Settings) => {
    saveSettings(s)
    setSettings(s)
  }, [])

  return { settings, update, save }
}
