import { describe, it, expect } from 'vitest'
import {
  startTimerSession,
  elapsedSeconds,
  pauseTimerSession,
  resumeTimerSession,
  finishTimerSession,
} from '../timer'
import type { TimerSession } from '../types'

describe('timer domain', () => {
  it('startTimerSession preserves trimmed label and startedAtMs', () => {
    const session = startTimerSession(1000, '  Vocabulary  ')
    expect(session.label).toBe('Vocabulary')
    expect(session.startedAtMs).toBe(1000)
    expect(session.accumulatedPauseMs).toBe(0)
  })

  it('empty label defaults to 未命名专注', () => {
    const session = startTimerSession(1000, '   ')
    expect(session.label).toBe('未命名专注')
  })

  it('elapsedSeconds returns whole seconds from session start', () => {
    const session = startTimerSession(1000, 'test')
    expect(elapsedSeconds(session, 61000)).toBe(60)
  })

  it('finishTimerSession produces a Record with correct duration in seconds', () => {
    const session = startTimerSession(
      Date.parse('2026-04-15T09:00:00+08:00'),
      '写代码',
    )
    const record = finishTimerSession(
      session,
      Date.parse('2026-04-15T09:45:00+08:00'),
    )
    expect(record.label).toBe('写代码')
    expect(record.duration).toBe(2700) // 45 minutes in seconds
    expect(record.tag).toBeNull()
  })

  it('finishTimerSession with pomodoro tag', () => {
    const session = startTimerSession(1000, 'focus')
    const record = finishTimerSession(session, 1000 + 25 * 60 * 1000, 'pomodoro')
    expect(record.tag).toBe('pomodoro')
    expect(record.duration).toBe(1500) // 25 min
  })

  it('preserves linkedTodoId through to record', () => {
    const session = startTimerSession(1000, 'task', 'todo-123')
    const record = finishTimerSession(session, 2000)
    expect(record.linkedTodoId).toBe('todo-123')
  })
})

describe('pause / resume', () => {
  const base: TimerSession = {
    id: 't1',
    label: '读书',
    startedAtMs: Date.parse('2026-04-20T10:00:00Z'),
    accumulatedPauseMs: 0,
    linkedTodoId: null,
  }

  it('pausing records pausedAtMs', () => {
    const paused = pauseTimerSession(base, Date.parse('2026-04-20T10:05:00Z'))
    expect(paused.pausedAtMs).toBe(Date.parse('2026-04-20T10:05:00Z'))
    expect(paused.accumulatedPauseMs).toBe(0)
  })

  it('pausing an already-paused session is a no-op', () => {
    const paused = pauseTimerSession(base, Date.parse('2026-04-20T10:05:00Z'))
    const pausedAgain = pauseTimerSession(paused, Date.parse('2026-04-20T10:06:00Z'))
    expect(pausedAgain).toBe(paused)
  })

  it('resuming accumulates paused time and clears pausedAtMs', () => {
    const paused = pauseTimerSession(base, Date.parse('2026-04-20T10:05:00Z'))
    const resumed = resumeTimerSession(paused, Date.parse('2026-04-20T10:07:00Z'))
    expect(resumed.pausedAtMs).toBeUndefined()
    expect(resumed.accumulatedPauseMs).toBe(2 * 60 * 1000)
  })

  it('resuming a non-paused session is a no-op', () => {
    const resumed = resumeTimerSession(base, Date.parse('2026-04-20T10:07:00Z'))
    expect(resumed).toBe(base)
  })

  it('elapsedSeconds subtracts accumulatedPauseMs after resume', () => {
    const paused = pauseTimerSession(base, Date.parse('2026-04-20T10:05:00Z'))
    const resumed = resumeTimerSession(paused, Date.parse('2026-04-20T10:07:00Z'))
    const elapsed = elapsedSeconds(resumed, Date.parse('2026-04-20T10:10:00Z'))
    // Total wall: 10min. Pause: 2min. Elapsed: 8min = 480s.
    expect(elapsed).toBe(480)
  })

  it('elapsedSeconds subtracts pause-in-progress when still paused', () => {
    const paused = pauseTimerSession(base, Date.parse('2026-04-20T10:05:00Z'))
    const elapsed = elapsedSeconds(paused, Date.parse('2026-04-20T10:10:00Z'))
    // Total wall: 10min. Paused at 5min (ongoing pause: 5min). Elapsed: 5min = 300s.
    expect(elapsed).toBe(300)
  })

  it('finishTimerSession excludes accumulatedPauseMs from record duration', () => {
    const paused = pauseTimerSession(base, Date.parse('2026-04-20T10:05:00Z'))
    const resumed = resumeTimerSession(paused, Date.parse('2026-04-20T10:10:00Z'))
    const record = finishTimerSession(resumed, Date.parse('2026-04-20T10:10:00Z'))
    expect(record.duration).toBe(300) // 5min = 300s
  })

  it('finishTimerSession while still paused auto-resolves the pause', () => {
    const paused = pauseTimerSession(base, Date.parse('2026-04-20T10:05:00Z'))
    const record = finishTimerSession(paused, Date.parse('2026-04-20T10:10:00Z'))
    expect(record.duration).toBe(300)
  })
})
