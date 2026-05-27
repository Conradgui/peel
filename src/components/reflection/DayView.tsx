'use client'

import type { Record } from '@/domain/types'
import { DayMosaic } from './DayMosaic'
import { formatDurationLong } from '@/domain/time'
import { computeTotalDuration, countByTag } from '@/domain/planner'
import { pickCopy, categorizeDay } from '@/domain/copy'
import { useMemo, useRef } from 'react'

interface Props {
  date: string
  records: Record[]
  isToday: boolean
}

export function DayView({ records, isToday: isTodayFlag }: Props) {
  const totalSeconds = computeTotalDuration(records)
  const pomodoroCount = countByTag(records, 'pomodoro')
  const recentlyUsedRef = useRef<string[]>([])

  /* eslint-disable react-hooks/refs -- intentional: recentlyUsedRef tracks copy rotation, read in useMemo is safe */
  const quote = useMemo(() => {
    if (records.length === 0 && isTodayFlag) {
      return pickCopy('first_day', {}, recentlyUsedRef.current)
    }
    const category = categorizeDay(totalSeconds)
    const ctx = {
      hours: Math.floor(totalSeconds / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      block_count: records.length,
    }
    return pickCopy(category, ctx, recentlyUsedRef.current)
  }, [records, totalSeconds, isTodayFlag])
  /* eslint-enable react-hooks/refs */

  return (
    <>
      <div className="reflection-display">
        <div className="total">
          {totalSeconds > 0 ? formatDurationLong(totalSeconds) : '0min'}
        </div>
      </div>

      <DayMosaic records={records} />

      <div className="reflection-quote">{quote}</div>

      <div className="reflection-meta">
        <span>🍅 {pomodoroCount} 个番茄完成</span>
        <span>📦 {records.length} 个时间块</span>
      </div>
    </>
  )
}
