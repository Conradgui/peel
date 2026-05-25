import { describe, it, expect } from 'vitest'
import { createPomodoroSession, tick, skipBreak } from '../pomodoro'

describe('pomodoro', () => {
  it('starts in "work" with full work duration', () => {
    const s = createPomodoroSession({ workMin: 25, breakMin: 5 })
    expect(s.phase).toBe('work')
    expect(s.remaining).toBe(25 * 60)
    expect(s.shouldCreateRecord).toBe(false)
  })

  it('transitions to "break" when work timer hits 0', () => {
    let s = createPomodoroSession({ workMin: 25, breakMin: 5 })
    for (let i = 0; i < 25 * 60; i++) s = tick(s)
    expect(s.phase).toBe('break')
    expect(s.remaining).toBe(5 * 60)
    expect(s.shouldCreateRecord).toBe(true)
  })

  it('transitions to "done" when break timer hits 0 (single cycle)', () => {
    let s = createPomodoroSession({ workMin: 1, breakMin: 1 })
    // Tick through 1 min work
    for (let i = 0; i < 60; i++) s = tick(s)
    expect(s.phase).toBe('break')
    // Tick through 1 min break
    for (let i = 0; i < 60; i++) s = tick(s)
    expect(s.phase).toBe('done')
    expect(s.remaining).toBe(0)
  })

  it('shouldCreateRecord is only true on work→break transition', () => {
    let s = createPomodoroSession({ workMin: 1, breakMin: 1 })
    // Tick 59 times — still working
    for (let i = 0; i < 59; i++) s = tick(s)
    expect(s.shouldCreateRecord).toBe(false)
    // 60th tick triggers transition
    s = tick(s)
    expect(s.shouldCreateRecord).toBe(true)
    // Next tick in break — flag resets
    s = tick(s)
    expect(s.shouldCreateRecord).toBe(false)
  })

  it('done state is idempotent', () => {
    let s = createPomodoroSession({ workMin: 1, breakMin: 1 })
    for (let i = 0; i < 120; i++) s = tick(s)
    const done = s
    const afterTick = tick(done)
    expect(afterTick).toBe(done)
  })

  it('skipBreak transitions to done (single cycle)', () => {
    let s = createPomodoroSession({ workMin: 1, breakMin: 5 })
    for (let i = 0; i < 60; i++) s = tick(s)
    expect(s.phase).toBe('break')
    s = skipBreak(s)
    expect(s.phase).toBe('done')
    expect(s.remaining).toBe(0)
  })

  it('skipBreak is a no-op when not in break', () => {
    const s = createPomodoroSession({ workMin: 25, breakMin: 5 })
    const result = skipBreak(s)
    expect(result).toBe(s)
  })

  it('multi-cycle: transitions work→break→work→break→done', () => {
    let s = createPomodoroSession({ workMin: 1, breakMin: 1, totalCycles: 2 })
    // Cycle 1 work
    for (let i = 0; i < 60; i++) s = tick(s)
    expect(s.phase).toBe('break')
    expect(s.cycle).toBe(1)
    // Cycle 1 break
    for (let i = 0; i < 60; i++) s = tick(s)
    expect(s.phase).toBe('work')
    expect(s.cycle).toBe(2)
    // Cycle 2 work
    for (let i = 0; i < 60; i++) s = tick(s)
    expect(s.phase).toBe('break')
    expect(s.cycle).toBe(2)
    // Cycle 2 break
    for (let i = 0; i < 60; i++) s = tick(s)
    expect(s.phase).toBe('done')
  })
})
