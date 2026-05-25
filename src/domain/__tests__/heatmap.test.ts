import { describe, it, expect } from 'vitest'
import { computeHourlyHeatmap, findPeakHours, formatPeakHours } from '../heatmap'
import type { Record } from '../types'

function makeRecord(startHour: number, startMin: number, endHour: number, endMin: number): Record {
  const date = new Date(2026, 4, 17) // May 17, 2026
  const start = new Date(date)
  start.setHours(startHour, startMin, 0, 0)
  const end = new Date(date)
  end.setHours(endHour, endMin, 0, 0)

  return {
    id: `r-${startHour}-${startMin}`,
    label: 'test',
    startTime: start.getTime(),
    endTime: end.getTime(),
    duration: (end.getTime() - start.getTime()) / 1000,
    createdAt: 0,
    updatedAt: 0,
  }
}

describe('computeHourlyHeatmap', () => {
  it('aggregates record durations into 24 hourly buckets', () => {
    const recs = [
      makeRecord(9, 0, 10, 0),   // 3600s in hour 9
      makeRecord(9, 30, 10, 30), // 1800s in hour 9 + 1800s in hour 10
      makeRecord(14, 0, 15, 0),  // 3600s in hour 14
    ]
    const heatmap = computeHourlyHeatmap(recs)
    expect(heatmap).toHaveLength(24)
    expect(heatmap[9]).toBe(5400) // 3600 + 1800
    expect(heatmap[10]).toBe(1800)
    expect(heatmap[14]).toBe(3600)
    expect(heatmap[0]).toBe(0)
  })

  it('handles records spanning multiple hours by splitting duration', () => {
    const recs = [makeRecord(9, 0, 11, 0)] // 2 hours
    const heatmap = computeHourlyHeatmap(recs)
    expect(heatmap[9]).toBe(3600)
    expect(heatmap[10]).toBe(3600)
    expect(heatmap[11]).toBe(0)
  })

  it('handles empty records', () => {
    const heatmap = computeHourlyHeatmap([])
    expect(heatmap).toHaveLength(24)
    expect(heatmap.every(v => v === 0)).toBe(true)
  })
})

describe('findPeakHours', () => {
  it('returns top N hours sorted chronologically', () => {
    const heatmap = new Array(24).fill(0)
    heatmap[9] = 5400
    heatmap[10] = 3600
    heatmap[14] = 3600
    heatmap[15] = 1800
    const peaks = findPeakHours(heatmap, 3)
    expect(peaks).toEqual([9, 10, 14])
  })
})

describe('formatPeakHours', () => {
  it('formats peak range', () => {
    expect(formatPeakHours([9, 10, 11])).toBe('9-12 点')
  })

  it('handles empty', () => {
    expect(formatPeakHours([])).toBe('')
  })
})
