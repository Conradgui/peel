// Peel v1 domain types — PRD § 5.2
// These are the core data structures used throughout the app.

/**
 * A recorded time block — the fundamental unit of "what actually happened."
 * Created when a user stops a timer (Normal mode) or completes a Pomodoro work phase.
 */
export interface Record {
  id: string
  label: string
  startTime: number   // timestamp ms
  endTime: number     // timestamp ms
  duration: number    // seconds, = (endTime - startTime) / 1000, minus pauses
  tag?: 'pomodoro' | null
  linkedTodoId?: string | null
  notes?: string
  createdAt: number
  updatedAt: number
  channel?: 'work' | 'growth' | 'life' | null
}

/**
 * A todo item for today's plan — the user's intent for what they want to accomplish.
 */
export interface Todo {
  id: string
  text: string
  status: 'pending' | 'in_progress' | 'done'
  estimatedDuration?: number  // minutes
  date: string                // 'YYYY-MM-DD'
  createdAt: number
  completedAt?: number
  channel?: 'work' | 'growth' | 'life' | null
}

/**
 * User-configurable settings persisted in localStorage.
 */
export interface Settings {
  orangeRainInterval: 15 | 30 | 45 | 60 | 'off'
  orangeRainSound: boolean
  pomodoroWork: number    // minutes
  pomodoroBreak: number   // minutes
  pomodoroCycleCount: number
  dayBoundaryHour: number // hours, 0-23
}

export const DEFAULT_SETTINGS: Settings = {
  orangeRainInterval: 30,
  orangeRainSound: false,
  pomodoroWork: 25,
  pomodoroBreak: 5,
  pomodoroCycleCount: 4,
  dayBoundaryHour: 0,
}

/**
 * Persisted timer session — survives page refresh.
 * Stored in activeTimerStorage.
 */
export interface TimerSession {
  id: string
  label: string
  startedAtMs: number
  pausedAtMs?: number
  accumulatedPauseMs: number
  linkedTodoId: string | null
}

/** Generate a unique ID with a prefix */
export function createId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`
}

