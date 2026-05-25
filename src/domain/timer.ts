// Peel timer domain logic
// Ported from Phase 1 (Vue/UNI) but rewritten for Peel's Record type system.
// Key differences from Phase 1:
//   - Uses ms timestamps (startTime/endTime) not ISO strings
//   - Duration in seconds, not minutes
//   - Adds linkedTodoId and tag fields

import type { Record, TimerSession } from './types'
import { createId } from './types'

/**
 * Start a new timer session. Persisted to activeTimerStorage
 * so the timer survives page refreshes.
 */
export function startTimerSession(
  nowMs: number,
  label: string,
  linkedTodoId: string | null = null,
): TimerSession {
  return {
    id: createId('timer'),
    label: label.trim() || '未命名专注',
    startedAtMs: nowMs,
    accumulatedPauseMs: 0,
    linkedTodoId,
  }
}

/**
 * Compute whole seconds elapsed, accounting for accumulated and in-progress pauses.
 */
export function elapsedSeconds(session: TimerSession, nowMs: number): number {
  const accumulated = session.accumulatedPauseMs
  const currentPause =
    session.pausedAtMs !== undefined
      ? Math.max(0, nowMs - session.pausedAtMs)
      : 0
  const totalPause = accumulated + currentPause
  return Math.max(0, Math.floor((nowMs - session.startedAtMs - totalPause) / 1000))
}

/**
 * Pause a running session. No-op if already paused.
 */
export function pauseTimerSession(session: TimerSession, nowMs: number): TimerSession {
  if (session.pausedAtMs !== undefined) return session
  return { ...session, pausedAtMs: nowMs }
}

/**
 * Resume a paused session. No-op if not paused.
 */
export function resumeTimerSession(session: TimerSession, nowMs: number): TimerSession {
  if (session.pausedAtMs === undefined) return session
  const thisPause = Math.max(0, nowMs - session.pausedAtMs)
  return {
    ...session,
    pausedAtMs: undefined,
    accumulatedPauseMs: session.accumulatedPauseMs + thisPause,
  }
}

/**
 * Finish a timer session and produce a Record.
 * If paused at finish time, auto-resumes to capture the pause duration.
 */
export function finishTimerSession(
  session: TimerSession,
  endMs: number,
  tag: 'pomodoro' | null = null,
): Record {
  // Auto-resume if still paused
  const resolved =
    session.pausedAtMs !== undefined
      ? resumeTimerSession(session, endMs)
      : session

  const effectiveDurationMs = Math.max(
    0,
    endMs - resolved.startedAtMs - resolved.accumulatedPauseMs,
  )
  const durationSeconds = Math.round(effectiveDurationMs / 1000)

  return {
    id: createId('rec'),
    label: resolved.label,
    startTime: resolved.startedAtMs,
    endTime: endMs,
    duration: durationSeconds,
    tag,
    linkedTodoId: resolved.linkedTodoId,
    createdAt: endMs,
    updatedAt: endMs,
  }
}
