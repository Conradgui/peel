'use client'

import type { Record } from '@/domain/types'

export function DayMosaic({ records }: { records: Record[] }) {
  if (records.length === 0) {
    return (
      <div className="reflection-mosaic">
        <div className="mosaic-empty">今天还没开始记录...</div>
      </div>
    )
  }

  return (
    <div className="reflection-mosaic">
      {records.map(r => {
        const heightPx = Math.min(74, Math.max(14, r.duration / 60))
        const flexValue = Math.max(20, r.duration / 60)
        const variant =
          r.duration > 3600 ? '' : r.duration > 1800 ? 'deep' : 'light'
        return (
          <div
            key={r.id}
            className={`mosaic-block ${variant}`}
            style={{ flex: flexValue, height: `${heightPx}px` }}
            title={`${r.label} · ${Math.round(r.duration / 60)}m`}
          />
        )
      })}
    </div>
  )
}
