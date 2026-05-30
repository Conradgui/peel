'use client'

import type { Record } from '@/domain/types'

const CHANNEL_COLORS = {
  work: {
    default: '#fb923c',
    deep: '#ea580c',
    light: '#fed7aa',
  },
  growth: {
    default: '#fde047',
    deep: '#ca8a04',
    light: '#fef9c3',
  },
  life: {
    default: '#a3e635',
    deep: '#16a34a',
    light: '#dcfce7',
  },
  none: {
    default: '#e5e5df',
    deep: '#a3a3a0',
    light: '#f0f0eb',
  }
}

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
        
        const ch = r.channel || 'none'
        const variant = r.duration > 3600 ? 'deep' : r.duration > 1800 ? 'default' : 'light'
        const bg = CHANNEL_COLORS[ch][variant]

        return (
          <div
            key={r.id}
            className="mosaic-block"
            style={{ 
              flex: flexValue, 
              height: `${heightPx}px`,
              background: bg 
            }}
            title={`${r.label} · ${Math.round(r.duration / 60)}m`}
          />
        )
      })}
    </div>
  )
}
