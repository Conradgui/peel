// Active timer persistence — survives page refresh.
// Adapted from Phase 1 (uni storage → localStorage).

import type { TimerSession } from '@/domain/types'

const KEY = 'peel-active-timer'

function isClient(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined'
}

export function isValidTimerSession(value: unknown): value is TimerSession {
  if (!value || typeof value !== 'object') return false
  const s = value as Partial<TimerSession>
  return (
    typeof s.id === 'string' &&
    typeof s.label === 'string' &&
    typeof s.startedAtMs === 'number' &&
    Number.isFinite(s.startedAtMs)
  )
}

export function loadActiveTimer(): TimerSession | null {
  if (!isClient()) return null
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    if (isValidTimerSession(parsed)) return parsed
    clearActiveTimer()
    return null
  } catch {
    return null
  }
}

export function saveActiveTimer(session: TimerSession): boolean {
  if (!isClient()) return false
  try {
    localStorage.setItem(KEY, JSON.stringify(session))
    return true
  } catch {
    return false
  }
}

export function clearActiveTimer(): boolean {
  if (!isClient()) return false
  try {
    localStorage.removeItem(KEY)
    return true
  } catch {
    return false
  }
}
