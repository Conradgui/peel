// Pomodoro state machine — pure functions, no side effects.
// The orchestrator (useTimer hook) reads shouldCreateRecord to know
// when to persist a record and trigger orange rain.

export type PomodoroPhase = 'work' | 'break' | 'done'

export interface PomodoroState {
  phase: PomodoroPhase
  remaining: number  // seconds
  workMin: number
  breakMin: number
  cycle: number      // current cycle (1-based)
  totalCycles: number
  shouldCreateRecord: boolean  // signal flag for orchestrator
}

export function createPomodoroSession(opts: {
  workMin: number
  breakMin: number
  totalCycles?: number
}): PomodoroState {
  return {
    phase: 'work',
    remaining: opts.workMin * 60,
    workMin: opts.workMin,
    breakMin: opts.breakMin,
    cycle: 1,
    totalCycles: opts.totalCycles ?? 1,
    shouldCreateRecord: false,
  }
}

export function tick(s: PomodoroState): PomodoroState {
  if (s.phase === 'done') return s
  const remaining = s.remaining - 1
  if (remaining > 0) return { ...s, remaining, shouldCreateRecord: false }

  // Phase transition
  if (s.phase === 'work') {
    return {
      ...s,
      phase: 'break',
      remaining: s.breakMin * 60,
      shouldCreateRecord: true,
    }
  }

  // Break ended — check if more cycles
  if (s.cycle < s.totalCycles) {
    return {
      ...s,
      phase: 'work',
      remaining: s.workMin * 60,
      cycle: s.cycle + 1,
      shouldCreateRecord: false,
    }
  }

  return { ...s, phase: 'done', remaining: 0, shouldCreateRecord: false }
}

export function skipBreak(s: PomodoroState): PomodoroState {
  if (s.phase !== 'break') return s

  if (s.cycle < s.totalCycles) {
    return {
      ...s,
      phase: 'work',
      remaining: s.workMin * 60,
      cycle: s.cycle + 1,
    }
  }

  return { ...s, phase: 'done', remaining: 0 }
}
