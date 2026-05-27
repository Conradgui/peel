'use client'

import { DayMosaic } from './DayMosaic'
import { formatDurationLong, daysAgo } from '@/domain/time'
import { computeTotalDuration } from '@/domain/planner'
import { getRecordsByDate } from '@/storage/recordStorage'
import { useMemo } from 'react'

interface Props {
  endDate: string // the last day of the week (usually today)
}

export function WeekView({ endDate }: Props) {
  const days = useMemo(() => {
    const result: { date: string; records: import('@/domain/types').Record[] }[] = []
    // Parse endDate to timestamp
    const [y, m, d] = endDate.split('-').map(Number)
    const endTs = new Date(y, m - 1, d, 12, 0).getTime()

    for (let i = 6; i >= 0; i--) {
      const dateStr = daysAgo(i, endTs)
      result.push({
        date: dateStr,
        records: getRecordsByDate(dateStr),
      })
    }
    return result
  }, [endDate])

  const weekTotal = days.reduce(
    (sum, d) => sum + computeTotalDuration(d.records),
    0,
  )
  const avgSeconds = days.length > 0 ? Math.round(weekTotal / 7) : 0

  return (
    <>
      <div className="reflection-display">
        <div className="total">{formatDurationLong(weekTotal)}</div>
        <div className="avg">本周日均 {formatDurationLong(avgSeconds)}</div>
      </div>

      <div className="week-mosaics">
        {days.map(d => (
          <div key={d.date} className="week-day">
            <div className="week-day-label">
              {d.date.slice(8)}
            </div>
            <div className="week-day-mosaic">
              {d.records.length > 0 ? (
                <DayMosaic records={d.records} />
              ) : (
                <div className="week-day-empty" />
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
