'use client'

import { useRecords } from '@/hooks/useRecords'
import { computeHourlyHeatmap, findPeakHours, formatPeakHours } from '@/domain/heatmap'

export function HeatmapHourly() {
  const { getLast7Days } = useRecords()
  const recent = getLast7Days()
  const heatmap = computeHourlyHeatmap(recent)
  const peaks = findPeakHours(heatmap, 3)
  const max = Math.max(...heatmap, 1) // avoid division by zero

  if (recent.length === 0) {
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
