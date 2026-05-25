'use client'

import { useMemo } from 'react'
import type { Record } from '@/domain/types'
import { computeHourlyHeatmap, findPeakHours, formatPeakHours } from '@/domain/heatmap'

interface Props {
  recentRecords: Record[]
}

export function HeatmapHourly({ recentRecords }: Props) {
  const heatmap = useMemo(() => computeHourlyHeatmap(recentRecords), [recentRecords])
  const peaks = useMemo(() => findPeakHours(heatmap, 3), [heatmap])
  const max = useMemo(() => Math.max(...heatmap, 1), [heatmap]) // avoid division by zero

  if (recentRecords.length === 0) {
    return (
      <div className="heatmap-section">
        <div className="heatmap-title">早晨建议</div>
        <div className="heatmap-subtitle">记录更多数据后，这里会显示你的高效时段</div>
      </div>
    )
  }

  return (
    <div className="heatmap-section">
      <div className="heatmap-title">早晨建议</div>
      <div className="heatmap-subtitle">
        过去 7 天，高效时段集中在 <strong>{formatPeakHours(peaks)}</strong>
      </div>
      <div className="heatmap-bars">
        {heatmap.map((sec, hour) => (
          <div
            key={hour}
            className={`heatmap-bar ${peaks.includes(hour) ? 'peak' : ''}`}
            style={{ height: `${Math.max(4, (sec / max) * 48)}px` }}
          />
        ))}
      </div>
    </div>
  )
}
