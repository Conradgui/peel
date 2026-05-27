'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { loadActiveTimer, saveActiveTimer, clearActiveTimer } from '@/storage/activeTimerStorage'
import {
  startTimerSession,
  elapsedSeconds,
  pauseTimerSession,
  resumeTimerSession,
  finishTimerSession,
} from '@/domain/timer'
import type { Record, TimerSession } from '@/domain/types'

export interface TimerState {
  isRunning: boolean
  isPaused: boolean
  elapsedSeconds: number
  label: string
  linkedTodoId: string | null
}

const IDLE_STATE: TimerState = {
  isRunning: false,
  isPaused: false,
  elapsedSeconds: 0,
  label: '',
  linkedTodoId: null,
}

export function useTimer() {
  const sessionRef = useRef<TimerSession | null>(null)
  const [state, setState] = useState<TimerState>(() => {
    // Will be re-hydrated in useEffect (SSR safe)
    return IDLE_STATE
  })

  // Hydrate from localStorage on mount
  /* eslint-disable react-hooks/set-state-in-effect -- hydration: restores active timer session from localStorage */
  useEffect(() => {
    const saved = loadActiveTimer()
    if (saved) {
      sessionRef.current = saved
      const elapsed = elapsedSeconds(saved, Date.now())
      setState({
        isRunning: true,
        isPaused: saved.pausedAtMs !== undefined,
        elapsedSeconds: elapsed,
        label: saved.label,
        linkedTodoId: saved.linkedTodoId,
      })
    }
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  // Tick interval — updates elapsed every 250ms when running and not paused
  useEffect(() => {
    if (!state.isRunning || state.isPaused) return
    const interval = setInterval(() => {
      if (sessionRef.current) {
        const elapsed = elapsedSeconds(sessionRef.current, Date.now())
        setState(s => ({ ...s, elapsedSeconds: elapsed }))
      }
    }, 250)
    return () => clearInterval(interval)
  }, [state.isRunning, state.isPaused])

  const start = useCallback((label: string, linkedTodoId: string | null = null) => {
    const session = startTimerSession(Date.now(), label, linkedTodoId)
    sessionRef.current = session
    saveActiveTimer(session)
    setState({
      isRunning: true,
      isPaused: false,
      elapsedSeconds: 0,
      label: session.label,
      linkedTodoId,
    })
  }, [])

  const pause = useCallback(() => {
    if (!sessionRef.current || sessionRef.current.pausedAtMs !== undefined) return
    const paused = pauseTimerSession(sessionRef.current, Date.now())
    sessionRef.current = paused
    saveActiveTimer(paused)
    setState(s => ({ ...s, isPaused: true }))
  }, [])

  const resume = useCallback(() => {
    if (!sessionRef.current || sessionRef.current.pausedAtMs === undefined) return
    const resumed = resumeTimerSession(sessionRef.current, Date.now())
    sessionRef.current = resumed
    saveActiveTimer(resumed)
    setState(s => ({ ...s, isPaused: false }))
  }, [])

  const stop = useCallback((tag: 'pomodoro' | null = null): Record | null => {
    if (!sessionRef.current) return null
    const record = finishTimerSession(sessionRef.current, Date.now(), tag)
    sessionRef.current = null
    clearActiveTimer()
    setState(IDLE_STATE)
    return record
  }, [])

  const updateLabel = useCallback((newLabel: string) => {
    if (sessionRef.current) {
      const updated = { ...sessionRef.current, label: newLabel }
      sessionRef.current = updated
      saveActiveTimer(updated)
      setState(s => ({ ...s, label: newLabel }))
    }
  }, [])

  return { state, start, pause, resume, stop, updateLabel }
}
