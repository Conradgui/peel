import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTimer } from '../useTimer'

beforeEach(() => {
  localStorage.clear()
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-05-17T10:00:00'))
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useTimer', () => {
  it('starts in idle state', () => {
    const { result } = renderHook(() => useTimer())
    expect(result.current.state.isRunning).toBe(false)
    expect(result.current.state.elapsedSeconds).toBe(0)
  })

  it('starts a timer session', () => {
    const { result } = renderHook(() => useTimer())
    act(() => result.current.start('专注'))
    expect(result.current.state.isRunning).toBe(true)
    expect(result.current.state.label).toBe('专注')
    expect(result.current.state.isPaused).toBe(false)
  })

  it('ticks elapsed seconds', () => {
    const { result } = renderHook(() => useTimer())
    act(() => result.current.start('test'))

    act(() => { vi.advanceTimersByTime(3000) })
    expect(result.current.state.elapsedSeconds).toBeGreaterThanOrEqual(2)
  })

  it('pauses and resumes', () => {
    const { result } = renderHook(() => useTimer())
    act(() => result.current.start('test'))

    act(() => { vi.advanceTimersByTime(2000) })
    act(() => result.current.pause())
    expect(result.current.state.isPaused).toBe(true)

    const elapsedAtPause = result.current.state.elapsedSeconds
    act(() => { vi.advanceTimersByTime(3000) })
    // Should not tick while paused
    expect(result.current.state.elapsedSeconds).toBe(elapsedAtPause)

    act(() => result.current.resume())
    expect(result.current.state.isPaused).toBe(false)
  })

  it('stop returns a Record and resets to idle', () => {
    const { result } = renderHook(() => useTimer())
    act(() => result.current.start('工作'))

    act(() => { vi.advanceTimersByTime(5000) })
    let record: ReturnType<typeof result.current.stop>
    act(() => { record = result.current.stop() })

    expect(record!).not.toBeNull()
    expect(record!.label).toBe('工作')
    expect(record!.duration).toBeGreaterThan(0)
    expect(result.current.state.isRunning).toBe(false)
  })

  it('stop with pomodoro tag', () => {
    const { result } = renderHook(() => useTimer())
    act(() => result.current.start('番茄'))

    let record: ReturnType<typeof result.current.stop>
    act(() => { record = result.current.stop('pomodoro') })
    expect(record!.tag).toBe('pomodoro')
  })

  it('persists active timer to localStorage', () => {
    const { result } = renderHook(() => useTimer())
    act(() => result.current.start('持久化'))
    expect(localStorage.getItem('peel-active-timer')).not.toBeNull()
  })

  it('clears localStorage on stop', () => {
    const { result } = renderHook(() => useTimer())
    act(() => result.current.start('test'))
    act(() => result.current.stop())
    expect(localStorage.getItem('peel-active-timer')).toBeNull()
  })

  it('updateLabel changes the label', () => {
    const { result } = renderHook(() => useTimer())
    act(() => result.current.start('原始'))
    act(() => result.current.updateLabel('新名字'))
    expect(result.current.state.label).toBe('新名字')
  })
})
