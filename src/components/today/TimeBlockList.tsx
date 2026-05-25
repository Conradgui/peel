'use client'

import { useRecords } from '@/hooks/useRecords'
import { formatDuration, formatTime, formatDurationLong } from '@/domain/time'
import { computeTotalDuration } from '@/domain/planner'

export function TimeBlockList() {
  const { records } = useRecords()

  const totalSeconds = computeTotalDuration(records)

  return (
    <div className="today-col">
      <div className="col-header">今天的时间块 · {records.length}</div>

      <div className="time-blocks">
        {records.length === 0 ? (
          <div className="empty-state">还没有记录。去 Now 页开始计时吧。</div>
        ) : (
          records.map(r => (
            <div
              key={r.id}
              className={`time-block ${r.tag === 'pomodoro' ? 'pomodoro' : ''}`}
            >
              <div className="time-block-header">
                <div className="time-block-name">{r.label}</div>
                <div className="time-block-duration">
                  {formatDuration(r.duration)}
                </div>
              </div>
              <div className="time-block-time">
                {formatTime(r.startTime)} — {formatTime(r.endTime)}
              </div>
            </div>
          ))
        )}
      </div>

      {records.length > 0 && (
        <div className="today-total">
          今天累计<strong>{formatDurationLong(totalSeconds)}</strong>
        </div>
      )}
    </div>
  )
}
