import { describe, it, expect, beforeEach } from 'vitest'
import { addRecord, getRecordsByDate, getRecordsInRange, deleteRecord } from '../recordStorage'
import type { Record } from '@/domain/types'

function makeRecord(overrides: Partial<Record>): Record {
  return {
    id: 'r1',
    label: 'test',
    startTime: new Date(2026, 4, 17, 9, 30).getTime(),
    endTime: new Date(2026, 4, 17, 10, 30).getTime(),
    duration: 3600,
    createdAt: 0,
    updatedAt: 0,
    ...overrides,
  }
}

beforeEach(() => localStorage.clear())

describe('recordStorage', () => {
  it('stores a record keyed by its startTime date', () => {
    const rec = makeRecord({})
    addRecord(rec)
    expect(getRecordsByDate('2026-05-17')).toHaveLength(1)
    expect(getRecordsByDate('2026-05-17')[0].id).toBe('r1')
  })

  it('groups cross-midnight record by startTime, not endTime', () => {
    const rec = makeRecord({
      id: 'r2',
      label: 'late work',
      startTime: new Date(2026, 4, 17, 23, 55).getTime(),
      endTime: new Date(2026, 4, 18, 0, 30).getTime(),
      duration: 2100,
    })
    addRecord(rec)
    expect(getRecordsByDate('2026-05-17')).toHaveLength(1)
    expect(getRecordsByDate('2026-05-18')).toHaveLength(0)
  })

  it('range query returns records in inclusive date range', () => {
    for (let d = 15; d <= 21; d++) {
      addRecord(makeRecord({
        id: `r-${d}`,
        startTime: new Date(2026, 4, d, 10, 0).getTime(),
        endTime: new Date(2026, 4, d, 11, 0).getTime(),
      }))
    }
    const range = getRecordsInRange('2026-05-16', '2026-05-20')
    expect(range).toHaveLength(5) // 16, 17, 18, 19, 20
  })

  it('deletes a record by id and date', () => {
    addRecord(makeRecord({ id: 'r1' }))
    addRecord(makeRecord({ id: 'r2' }))
    deleteRecord('r1', '2026-05-17')
    expect(getRecordsByDate('2026-05-17')).toHaveLength(1)
    expect(getRecordsByDate('2026-05-17')[0].id).toBe('r2')
  })
})
