import { describe, it, expect } from 'vitest'
import {
  formatDate,
  formatDuration,
  formatDurationLong,
  formatTimerDisplay,
  formatCountdown,
  formatTime,
  formatDateChinese,
  daysAgo,
  isToday,
} from '../time'

describe('formatDate', () => {
  it('formats a timestamp to YYYY-MM-DD in local tz', () => {
    const ts = new Date(2026, 4, 17, 10, 30, 0).getTime()
    expect(formatDate(ts)).toBe('2026-05-17')
  })

  it('groups cross-midnight record under startTime day (PRD § 5.5)', () => {
    const ts = new Date(2026, 4, 17, 23, 55, 0).getTime()
    expect(formatDate(ts)).toBe('2026-05-17')
  })

  it('pads single-digit months and days', () => {
    const ts = new Date(2026, 0, 5, 12, 0, 0).getTime()
    expect(formatDate(ts)).toBe('2026-01-05')
  })

  it('respects dayBoundaryHour settings for formatting dates', () => {
    localStorage.setItem('peel-settings', JSON.stringify({ dayBoundaryHour: 3 }))
    
    // May 18, 02:30 AM. With dayBoundaryHour = 3, it should be categorized as May 17.
    const tsBeforeBoundary = new Date(2026, 4, 18, 2, 30, 0).getTime()
    expect(formatDate(tsBeforeBoundary)).toBe('2026-05-17')
    
    // May 18, 03:01 AM. With dayBoundaryHour = 3, it should be categorized as May 18.
    const tsAfterBoundary = new Date(2026, 4, 18, 3, 1, 0).getTime()
    expect(formatDate(tsAfterBoundary)).toBe('2026-05-18')

    localStorage.removeItem('peel-settings')
  })
})

describe('formatDuration', () => {
  it('formats seconds-only', () => {
    expect(formatDuration(45)).toBe('45s')
  })

  it('formats minutes-only', () => {
    expect(formatDuration(120)).toBe('2m')
  })

  it('formats hours and minutes', () => {
    expect(formatDuration(3720)).toBe('1h 2m')
  })

  it('formats hours-only when no remainder minutes', () => {
    expect(formatDuration(7200)).toBe('2h')
  })

  it('handles zero', () => {
    expect(formatDuration(0)).toBe('0s')
  })

  it('handles negative gracefully', () => {
    expect(formatDuration(-5)).toBe('0s')
  })
})

describe('formatDurationLong', () => {
  it('formats with "min" suffix', () => {
    expect(formatDurationLong(15120)).toBe('4h 12min')
  })

  it('formats minutes-only', () => {
    expect(formatDurationLong(300)).toBe('5min')
  })
})

describe('formatTimerDisplay', () => {
  it('formats as HH:MM:SS', () => {
    expect(formatTimerDisplay(3720)).toBe('01:02:00')
  })

  it('handles zero', () => {
    expect(formatTimerDisplay(0)).toBe('00:00:00')
  })

  it('handles large values', () => {
    expect(formatTimerDisplay(36000)).toBe('10:00:00')
  })
})

describe('formatCountdown', () => {
  it('formats as MM:SS', () => {
    expect(formatCountdown(1500)).toBe('25:00')
    expect(formatCountdown(300)).toBe('05:00')
    expect(formatCountdown(59)).toBe('00:59')
  })
})

describe('formatTime', () => {
  it('formats timestamp to HH:MM', () => {
    const ts = new Date(2026, 4, 17, 9, 30).getTime()
    expect(formatTime(ts)).toBe('09:30')
  })
})

describe('formatDateChinese', () => {
  it('formats to Chinese date', () => {
    expect(formatDateChinese('2026-05-17')).toBe('2026 年 5 月 17 日')
  })
})

describe('daysAgo', () => {
  it('returns date string for N days ago', () => {
    const base = new Date(2026, 4, 17, 12, 0).getTime()
    expect(daysAgo(1, base)).toBe('2026-05-16')
    expect(daysAgo(7, base)).toBe('2026-05-10')
  })
})

describe('isToday', () => {
  it('returns true for today', () => {
    const today = formatDate(Date.now())
    expect(isToday(today)).toBe(true)
  })

  it('returns false for yesterday', () => {
    expect(isToday('2020-01-01')).toBe(false)
  })
})
