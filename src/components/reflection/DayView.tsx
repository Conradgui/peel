'use client'

import type { Record } from '@/domain/types'
import { DayMosaic } from './DayMosaic'
import { formatDurationLong } from '@/domain/time'
import { computeTotalDuration, countByTag } from '@/domain/planner'
import { pickCopy, categorizeDay } from '@/domain/copy'
import { useMemo, useRef, useState, useEffect } from 'react'
import { getReflection, saveReflection } from '@/storage/reflectionStorage'

interface Props {
  date: string
  records: Record[]
  isToday: boolean
}

export function DayView({ date, records, isToday: isTodayFlag }: Props) {
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

  const [reflection, setReflection] = useState('')

  useEffect(() => {
    setReflection(getReflection(date))
  }, [date])

  const handleBlur = () => {
    saveReflection(date, reflection)
  }

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

      <div 
        className="reflection-diary-card"
        style={{
          background: 'var(--color-pure-white)',
          border: '1px solid var(--color-peel-border-subtle)',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: 'var(--shadow-soft)',
          marginTop: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          width: '100%',
        }}
      >
        <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
          🍊 剥离今日：一句话反思与校准
        </div>
        <textarea
          style={{
            width: '100%',
            height: '60px',
            border: '1px solid var(--color-peel-border)',
            borderRadius: '10px',
            background: 'var(--color-cream-white)',
            color: 'var(--color-text-primary)',
            padding: '10px 14px',
            fontSize: '14px',
            lineHeight: '1.5',
            resize: 'none',
            outline: 'none',
          }}
          value={reflection}
          onChange={e => setReflection(e.target.value)}
          onBlur={handleBlur}
          placeholder="剥离假象，你今天最严重的时间误判是？（例如：本以为写报告只要 1h，实际用了 3h）"
        />
        <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', lineHeight: '1.4' }}>
          您的反思会被安全保存在本地。在 Today 页面添加相同任务时，Peel 会提醒您。
        </div>
      </div>
    </>
  )
}
