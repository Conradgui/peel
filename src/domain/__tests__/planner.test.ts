import { describe, it, expect } from 'vitest'
import { computeTodoDuration, computeTotalDuration, countByTag } from '../planner'
import type { Record } from '../types'

function makeRecord(overrides: Partial<Record>): Record {
  return {
    id: 'r1',
    label: 'test',
    startTime: 0,
    endTime: 0,
    duration: 0,
    createdAt: 0,
    updatedAt: 0,
    ...overrides,
  }
}

describe('computeTodoDuration', () => {
  it('sums duration of records linked to a specific todo', () => {
    const records = [
      makeRecord({ id: 'r1', linkedTodoId: 't1', duration: 1200 }),
      makeRecord({ id: 'r2', linkedTodoId: 't1', duration: 800 }),
      makeRecord({ id: 'r3', linkedTodoId: 'other', duration: 500 }),
    ]
    expect(computeTodoDuration(records, 't1')).toBe(2000)
  })

  it('returns 0 when no records match', () => {
    const records = [makeRecord({ linkedTodoId: 'other', duration: 500 })]
    expect(computeTodoDuration(records, 't1')).toBe(0)
  })

  it('returns 0 for empty array', () => {
    expect(computeTodoDuration([], 't1')).toBe(0)
  })
})

describe('computeTotalDuration', () => {
  it('sums all record durations', () => {
    const records = [
      makeRecord({ duration: 1200 }),
      makeRecord({ duration: 800 }),
      makeRecord({ duration: 500 }),
    ]
    expect(computeTotalDuration(records)).toBe(2500)
  })
})

describe('countByTag', () => {
  it('counts records with pomodoro tag', () => {
    const records = [
      makeRecord({ tag: 'pomodoro' }),
      makeRecord({ tag: 'pomodoro' }),
      makeRecord({ tag: null }),
    ]
    expect(countByTag(records, 'pomodoro')).toBe(2)
  })
})
