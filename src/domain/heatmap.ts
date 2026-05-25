// Heatmap aggregation — splits records across hourly buckets.
// Used by the "早晨建议" section on the Today page.

import type { Record } from './types'

/**
 * Aggregate record durations into 24 hourly buckets (in seconds).
 * Records spanning multiple hours are split proportionally.
 */
export function computeHourlyHeatmap(records: Record[]): number[] {
  const buckets = new Array(24).fill(0) as number[]

  for (const r of records) {
    let cursor = r.startTime
    const end = r.endTime

    while (cursor < end) {
      const d = new Date(cursor)
      const hour = d.getHours()
      const nextHourMs = new Date(cursor).setHours(hour + 1, 0, 0, 0)
      const sliceEnd = Math.min(nextHourMs, end)
      buckets[hour] += (sliceEnd - cursor) / 1000
      cursor = sliceEnd
    }
  }

  return buckets
}

/**
 * Find the top N peak hours from a heatmap, sorted chronologically.
 */
export function findPeakHours(heatmap: number[], topN: number = 3): number[] {
  return heatmap
    .map((sec, hour) => ({ sec, hour }))
    .sort((a, b) => b.sec - a.sec)
    .slice(0, topN)
    .map(x => x.hour)
    .sort((a, b) => a - b)
}

/**
 * Format peak hours into a Chinese summary string.
 * e.g. [9, 10, 11] → "9-12 点"
 */
export function formatPeakHours(peaks: number[]): string {
  if (peaks.length === 0) return ''
  const start = peaks[0]
  const end = peaks[peaks.length - 1] + 1
  return `${start}-${end} 点`
}
