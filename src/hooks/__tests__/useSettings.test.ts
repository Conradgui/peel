import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSettings } from '../useSettings'
import { DEFAULT_SETTINGS } from '@/domain/types'

beforeEach(() => localStorage.clear())

describe('useSettings', () => {
  it('initializes with defaults', () => {
    const { result } = renderHook(() => useSettings())
    expect(result.current.settings.pomodoroWork).toBe(DEFAULT_SETTINGS.pomodoroWork)
  })

  it('hydrates from localStorage on mount', () => {
    const custom = { ...DEFAULT_SETTINGS, pomodoroWork: 50 }
    localStorage.setItem('peel-settings', JSON.stringify(custom))
    const { result } = renderHook(() => useSettings())
    expect(result.current.settings.pomodoroWork).toBe(50)
  })

  it('update changes one field and persists', () => {
    const { result } = renderHook(() => useSettings())
    act(() => result.current.update('pomodoroBreak', 15))
    expect(result.current.settings.pomodoroBreak).toBe(15)
    // Verify persistence
    const stored = JSON.parse(localStorage.getItem('peel-settings') || '{}')
    expect(stored.pomodoroBreak).toBe(15)
  })

  it('save replaces entire settings', () => {
    const { result } = renderHook(() => useSettings())
    const newSettings = { ...DEFAULT_SETTINGS, pomodoroWork: 99 }
    act(() => result.current.save(newSettings))
    expect(result.current.settings.pomodoroWork).toBe(99)
  })
})
