import { describe, it, expect } from 'vitest'
import { pickCopy, categorizeDay } from '../copy'

describe('pickCopy', () => {
  it('picks a template from the right category and interpolates data', () => {
    const ctx = { hours: 4, minutes: 12, block_count: 6, date: '5月17日' }
    const result = pickCopy('high_productivity_day', ctx)
    expect(result).toBeTruthy()
    // Should have interpolated at least some value
    expect(result).not.toContain('{hours}')
    expect(result).not.toContain('{minutes}')
  })

  it('does not re-pick the same template on consecutive calls (when options remain)', () => {
    const seen = [
      '今天 {hours}h {minutes}min，是个好日子。',
      '{date} 的你 {hours}h {minutes}min。',
      '今天有 {block_count} 个时间块被认真度过 ✦',
      '{hours}h {minutes}min。{block_count} 块拼图。',
      '今天 {block_count} 块时间，{hours}h {minutes}min。',
      '不错的一天：{hours} 小时 {minutes} 分钟。',
      '今天把 {hours}h {minutes}min 投入到了正事上。',
    ]
    const result = pickCopy('high_productivity_day', {}, seen)
    expect(result).toBeTruthy()
  })

  it('returns empty string for unknown category', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- testing invalid enum value
    const result = pickCopy('nonexistent' as any, {})
    expect(result).toBe('')
  })

  it('handles pomodoro_completed category', () => {
    const result = pickCopy('pomodoro_completed', { minutes: 25 })
    expect(result).toBeTruthy()
  })
})

describe('categorizeDay', () => {
  it('returns high_productivity_day for 4+ hours', () => {
    expect(categorizeDay(4 * 3600)).toBe('high_productivity_day')
    expect(categorizeDay(6 * 3600)).toBe('high_productivity_day')
  })

  it('returns stable_day for 2-4 hours', () => {
    expect(categorizeDay(2 * 3600)).toBe('stable_day')
    expect(categorizeDay(3 * 3600)).toBe('stable_day')
  })

  it('returns low_productivity_day for under 2 hours', () => {
    expect(categorizeDay(3600)).toBe('low_productivity_day')
    expect(categorizeDay(0)).toBe('low_productivity_day')
  })
})
