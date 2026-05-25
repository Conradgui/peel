'use client'

import { useState, useMemo } from 'react'
import { DayView } from './DayView'
import { WeekView } from './WeekView'
import { formatDate, formatDateChinese, isToday, daysAgo } from '@/domain/time'
import { getRecordsByDate } from '@/storage/recordStorage'

export function ReflectionPage() {
  const [granularity, setGranularity] = useState<'day' | 'week'>('day')
  const [cursor, setCursor] = useState(() => formatDate(Date.now()))

  const records = useMemo(() => getRecordsByDate(cursor), [cursor])

  const navigate = (delta: number) => {
    const [y, m, d] = cursor.split('-').map(Number)
    const ts = new Date(y, m - 1, d, 12, 0).getTime()
    const step = granularity === 'day' ? 1 : 7
    setCursor(daysAgo(-delta * step, ts))
  }

  const displayDate = isToday(cursor)
    ? `${formatDateChinese(cursor)} · 今天`
    : formatDateChinese(cursor)

  return (
    <div className="reflection-page">
      <div className="reflection-nav">
        <button onClick={() => navigate(-1)} title="上一天">◀</button>
        <span>{displayDate}</span>
        <button
          onClick={() => navigate(1)}
          title="下一天"
          disabled={isToday(cursor)}
        >
          ▶
        </button>
      </div>

      {granularity === 'day' ? (
        <DayView
          date={cursor}
          records={records}
          isToday={isToday(cursor)}
        />
      ) : (
        <WeekView endDate={cursor} />
      )}

      <div className="reflection-granularity">
        <button
          className={granularity === 'day' ? 'active' : ''}
          onClick={() => setGranularity('day')}
        >
          按天
        </button>
        <button
          className={granularity === 'week' ? 'active' : ''}
          onClick={() => setGranularity('week')}
        >
          按周
        </button>
      </div>
    </div>
  )
}
