'use client'

import { useState, useCallback, useEffect } from 'react'
import { getSettings, saveSettings, updateSetting } from '@/storage/settingsStorage'
import type { Settings } from '@/domain/types'
import { DEFAULT_SETTINGS } from '@/domain/types'

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)

  useEffect(() => {
    setSettings(getSettings())
  }, [])

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
