import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRecords } from '../useRecords'
import type { Record } from '@/domain/types'

function makeRecord(overrides: Partial<Record> = {}): Record {
  return {
    id: 'r1',
    label: 'test',
    startTime: new Date(2026, 4, 17, 10, 0).getTime(),
    endTime: new Date(2026, 4, 17, 11, 0).getTime(),
    duration: 3600,
    createdAt: 0,
    updatedAt: 0,
    tag: null,
    linkedTodoId: null,
    ...overrides,
  }
}

beforeEach(() => localStorage.clear())

describe('useRecords', () => {
  it('loads empty records by default', () => {
    const { result } = renderHook(() => useRecords('2026-05-17'))
    expect(result.current.records).toEqual([])
  })

  it('adds a record and refreshes', () => {
    const { result } = renderHook(() => useRecords('2026-05-17'))
    act(() => result.current.add(makeRecord()))
    expect(result.current.records).toHaveLength(1)
    expect(result.current.records[0].id).toBe('r1')
  })

  it('updates a record', () => {
    const { result } = renderHook(() => useRecords('2026-05-17'))
    act(() => result.current.add(makeRecord()))
    act(() => result.current.update(makeRecord({ id: 'r1', label: 'updated' })))
    expect(result.current.records[0].label).toBe('updated')
  })

  it('removes a record', () => {
    const { result } = renderHook(() => useRecords('2026-05-17'))
    act(() => result.current.add(makeRecord()))
    act(() => result.current.remove('r1'))
    expect(result.current.records).toHaveLength(0)
  })

  it('getRange returns records across dates', () => {
    const { result } = renderHook(() => useRecords('2026-05-17'))
    act(() => result.current.add(makeRecord({ id: 'r1', startTime: new Date(2026, 4, 17, 10, 0).getTime() })))
    act(() => result.current.add(makeRecord({ id: 'r2', startTime: new Date(2026, 4, 18, 10, 0).getTime(), endTime: new Date(2026, 4, 18, 11, 0).getTime() })))

    const range = result.current.getRange('2026-05-17', '2026-05-18')
    expect(range).toHaveLength(2)
  })
})
