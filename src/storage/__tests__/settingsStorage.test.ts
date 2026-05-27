import { describe, it, expect, beforeEach } from 'vitest'
import { getSettings, saveSettings, updateSetting } from '../settingsStorage'
import { DEFAULT_SETTINGS } from '@/domain/types'

beforeEach(() => localStorage.clear())

describe('settingsStorage', () => {
  it('returns defaults when nothing is stored', () => {
    const settings = getSettings()
    expect(settings.pomodoroWork).toBe(DEFAULT_SETTINGS.pomodoroWork)
    expect(settings.pomodoroBreak).toBe(DEFAULT_SETTINGS.pomodoroBreak)
    expect(settings.orangeRainInterval).toBe(DEFAULT_SETTINGS.orangeRainInterval)
  })

  it('saves and retrieves settings', () => {
    const custom = { ...DEFAULT_SETTINGS, pomodoroWork: 50 }
    saveSettings(custom)
    expect(getSettings().pomodoroWork).toBe(50)
  })

  it('merges stored settings with defaults (forward-compatible)', () => {
    // Simulate partial settings from an older version
    localStorage.setItem('peel-settings', JSON.stringify({ pomodoroWork: 40 }))
    const settings = getSettings()
    expect(settings.pomodoroWork).toBe(40)
    // Other fields fall back to defaults
    expect(settings.pomodoroBreak).toBe(DEFAULT_SETTINGS.pomodoroBreak)
  })

  it('updateSetting changes one field and persists', () => {
    const updated = updateSetting('pomodoroBreak', 15)
    expect(updated.pomodoroBreak).toBe(15)
    expect(getSettings().pomodoroBreak).toBe(15)
  })

  it('handles corrupt JSON gracefully', () => {
    localStorage.setItem('peel-settings', 'not-json{{{')
    const settings = getSettings()
    expect(settings).toEqual(DEFAULT_SETTINGS)
  })
})
