// Peel time utilities
// All date-key logic uses local timezone (PRD § 5.5: group by startTime day).

/**
 * Format a timestamp to 'YYYY-MM-DD' in local timezone.
 * Used as the localStorage key for records and todos.
 */
export function formatDate(timestamp: number): string {
  const d = new Date(timestamp)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * Format seconds into a human-readable duration string.
 * Examples: 45 → "45s", 120 → "2m", 3720 → "1h 2m"
 */
export function formatDuration(seconds: number): string {
  if (seconds < 0) return '0s'
  if (seconds < 60) return `${Math.floor(seconds)}s`
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0 && m > 0) return `${h}h ${m}m`
  if (h > 0) return `${h}h`
  return `${m}m`
}

/**
 * Format seconds into a display-friendly duration for reflection page.
 * Examples: 15120 → "4h 12min"
 */
export function formatDurationLong(seconds: number): string {
  if (seconds < 60) return `${Math.floor(seconds)}s`
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0 && m > 0) return `${h}h ${m}min`
  if (h > 0) return `${h}h`
  return `${m}min`
}

/**
 * Format seconds into a timer display: "HH:MM:SS"
 * Used by the Now page timer display.
 */
export function formatTimerDisplay(seconds: number): string {
  const abs = Math.max(0, Math.floor(seconds))
  const h = Math.floor(abs / 3600).toString().padStart(2, '0')
  const m = Math.floor((abs % 3600) / 60).toString().padStart(2, '0')
  const s = (abs % 60).toString().padStart(2, '0')
  return `${h}:${m}:${s}`
}

/**
 * Format seconds into a countdown display: "MM:SS"
 * Used by Pomodoro mode.
 */
export function formatCountdown(seconds: number): string {
  const abs = Math.max(0, Math.floor(seconds))
  const m = Math.floor(abs / 60).toString().padStart(2, '0')
  const s = (abs % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

/**
 * Format a timestamp to "HH:MM" for time block display.
 */
export function formatTime(timestamp: number): string {
  const d = new Date(timestamp)
  const h = d.getHours().toString().padStart(2, '0')
  const m = d.getMinutes().toString().padStart(2, '0')
  return `${h}:${m}`
}

/**
 * Format a date string to a Chinese display format.
 * '2026-05-17' → '2026 年 5 月 17 日'
 */
export function formatDateChinese(dateStr: string): string {
  const [y, m, d] = dateStr.split('-')
  return `${y} 年 ${parseInt(m)} 月 ${parseInt(d)} 日`
}

/**
 * Get date string for N days ago from today.
 */
export function daysAgo(n: number, fromTimestamp?: number): string {
  const base = fromTimestamp ?? Date.now()
  return formatDate(base - n * 86400000)
}

/**
 * Check if a date string is today.
 */
export function isToday(dateStr: string): boolean {
  return dateStr === formatDate(Date.now())
}
