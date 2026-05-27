import { describe, it, expect, beforeEach } from 'vitest'
import { saveActiveTimer, loadActiveTimer, clearActiveTimer, isValidTimerSession } from '../activeTimerStorage'
import type { TimerSession } from '@/domain/types'

const mockSession: TimerSession = {
  id: 't1',
  label: '专注',
  startedAtMs: 1000,
  accumulatedPauseMs: 0,
  linkedTodoId: null,
}

beforeEach(() => localStorage.clear())

describe('activeTimerStorage', () => {
  it('returns null when nothing is stored', () => {
    expect(loadActiveTimer()).toBeNull()
  })

  it('saves and loads a valid session', () => {
    saveActiveTimer(mockSession)
    const loaded = loadActiveTimer()
    expect(loaded).toEqual(mockSession)
  })

  it('clears the stored session', () => {
    saveActiveTimer(mockSession)
    clearActiveTimer()
    expect(loadActiveTimer()).toBeNull()
  })

  it('returns null on corrupt JSON', () => {
    localStorage.setItem('peel-active-timer', 'bad-json')
    expect(loadActiveTimer()).toBeNull()
  })

  it('rejects invalid session objects', () => {
    localStorage.setItem('peel-active-timer', JSON.stringify({ id: 123 }))
    expect(loadActiveTimer()).toBeNull()
  })

  describe('isValidTimerSession', () => {
    it('accepts a valid session', () => {
      expect(isValidTimerSession(mockSession)).toBe(true)
    })

    it('rejects null/undefined', () => {
      expect(isValidTimerSession(null)).toBe(false)
      expect(isValidTimerSession(undefined)).toBe(false)
    })

    it('rejects missing required fields', () => {
      expect(isValidTimerSession({ id: 't1' })).toBe(false)
      expect(isValidTimerSession({ id: 't1', label: 'x', startedAtMs: 'not-number' })).toBe(false)
    })

    it('rejects non-finite startedAtMs', () => {
      expect(isValidTimerSession({ ...mockSession, startedAtMs: Infinity })).toBe(false)
      expect(isValidTimerSession({ ...mockSession, startedAtMs: NaN })).toBe(false)
    })
  })
})
