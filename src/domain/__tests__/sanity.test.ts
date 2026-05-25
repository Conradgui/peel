import { describe, it, expect } from 'vitest'

describe('sanity', () => {
  it('environment loads', () => {
    expect(1 + 1).toBe(2)
  })

  it('jsdom provides window', () => {
    expect(typeof window).toBe('object')
  })

  it('jsdom provides localStorage', () => {
    expect(typeof localStorage).toBe('object')
    localStorage.setItem('test', 'ok')
    expect(localStorage.getItem('test')).toBe('ok')
    localStorage.removeItem('test')
  })
})
