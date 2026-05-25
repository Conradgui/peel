'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useTimer } from '@/hooks/useTimer'
import { useRecords } from '@/hooks/useRecords'
import { useSettings } from '@/hooks/useSettings'
import { TimerDisplay } from './TimerDisplay'
import { TaskInput } from './TaskInput'
import { RestView } from './RestView'
import { createPomodoroSession, tick, skipBreak, type PomodoroState } from '@/domain/pomodoro'
import { formatDurationLong } from '@/domain/time'
import { computeTotalDuration } from '@/domain/planner'

interface Props {
  isPomodoro: boolean
  onRainTrigger: () => void
  onBreakChange?: (isBreak: boolean) => void
}

export function NowPage({ isPomodoro, onRainTrigger, onBreakChange }: Props) {
  const { state, start, pause, resume, stop, updateLabel } = useTimer()
  const { records, add } = useRecords()
  const { settings } = useSettings()

  const [inputText, setInputText] = useState('')
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null)

  const [pomodoroState, setPomodoroState] = useState<PomodoroState | null>(null)
  const pomodoroIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const rainAccumRef = useRef(0) // accumulated seconds for orange rain trigger

  const todayTotal = computeTotalDuration(records)

  // Sync break state with parent
  const isBreakActive = pomodoroState?.phase === 'break'
  useEffect(() => {
    onBreakChange?.(isBreakActive)
  }, [isBreakActive, onBreakChange])

  // Side effect handler for Pomodoro phase completion
  useEffect(() => {
    if (pomodoroState?.shouldCreateRecord) {
      const record = stop('pomodoro')
      if (record) {
        add(record)
        onRainTrigger()
      }
      // Reset the creation flag
      setPomodoroState(prev => prev ? { ...prev, shouldCreateRecord: false } : null)
    }
  }, [pomodoroState?.shouldCreateRecord, stop, add, onRainTrigger])

  // Pomodoro tick
  useEffect(() => {
    if (!pomodoroState || pomodoroState.phase === 'done') {
      if (pomodoroIntervalRef.current) {
        clearInterval(pomodoroIntervalRef.current)
        pomodoroIntervalRef.current = null
      }
      return
    }

    pomodoroIntervalRef.current = setInterval(() => {
      setPomodoroState(prev => {
        if (!prev) return null
        return tick(prev)
      })
    }, 1000)

    return () => {
      if (pomodoroIntervalRef.current) {
        clearInterval(pomodoroIntervalRef.current)
      }
    }
  }, [pomodoroState?.phase])

  // Orange rain interval trigger (normal mode)
  useEffect(() => {
    if (!state.isRunning || state.isPaused || isPomodoro) return
    const intervalMin = settings.orangeRainInterval
    if (intervalMin === 'off') return

    const interval = setInterval(() => {
      rainAccumRef.current += 1
      if (rainAccumRef.current >= intervalMin * 60) {
        onRainTrigger()
        rainAccumRef.current = 0
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [state.isRunning, state.isPaused, isPomodoro, settings.orangeRainInterval, onRainTrigger])

  const handleSelect = useCallback((label: string, todoId: string | null) => {
    if (isPomodoro) {
      // Start pomodoro session
      start(label, todoId)
      setPomodoroState(createPomodoroSession({
        workMin: settings.pomodoroWork,
        breakMin: settings.pomodoroBreak,
        totalCycles: settings.pomodoroCycleCount,
      }))
    } else {
      start(label, todoId)
    }
    rainAccumRef.current = 0
  }, [isPomodoro, start, settings])

  const handleStop = useCallback(() => {
    const record = stop()
    if (record) {
      add(record)
    }
    setPomodoroState(null)
  }, [stop, add])

  const handleSkipBreak = useCallback(() => {
    if (pomodoroState) {
      setPomodoroState(skipBreak(pomodoroState))
    }
  }, [pomodoroState])

  const handleContinueAfterBreak = useCallback(() => {
    if (!pomodoroState) return
    if (pomodoroState.phase === 'break') {
      setPomodoroState(skipBreak(pomodoroState))
    } else if (pomodoroState.phase === 'done') {
      setPomodoroState(null)
    }
  }, [pomodoroState])

  // Pomodoro break view
  if (pomodoroState?.phase === 'break') {
    return (
      <div className="now-page" key="break">
        <RestView
          remaining={pomodoroState.remaining}
          breakMin={settings.pomodoroBreak}
          onSkip={handleSkipBreak}
          onContinue={handleContinueAfterBreak}
        />
      </div>
    )
  }

  return (
    <div className="now-page" key="work">
      {!state.isRunning ? (
        <>
          <TaskInput
            text={inputText}
            setText={setInputText}
            selectedTodoId={selectedTodoId}
            setSelectedTodoId={setSelectedTodoId}
            onSelect={handleSelect}
          />
          <div className="now-empty-hint">
            <button
              className="btn primary start-btn"
              onClick={() => {
                handleSelect(inputText.trim(), selectedTodoId)
                setInputText('')
                setSelectedTodoId(null)
              }}
            >
              开始
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="task-name">
            {isPomodoro && <span className="pomodoro-icon">🍅</span>}
            <input
              className="task-name-input"
              value={state.label}
              onChange={e => updateLabel(e.target.value)}
              placeholder="未命名专注"
            />
          </div>

          {isPomodoro && pomodoroState ? (
            <TimerDisplay
              elapsedSeconds={settings.pomodoroWork * 60 - pomodoroState.remaining}
              isCountdown
              target={settings.pomodoroWork * 60}
            />
          ) : (
            <TimerDisplay elapsedSeconds={state.elapsedSeconds} />
          )}

          {isPomodoro && (
            <div className="timer-target">
              {settings.pomodoroWork}:00 倒计时
            </div>
          )}

          <div className="timer-controls">
            {!state.isPaused ? (
              <button className="btn" onClick={pause}>⏸&nbsp;&nbsp;暂停</button>
            ) : (
              <button className="btn" onClick={resume}>▶&nbsp;&nbsp;继续</button>
            )}
            <button className="btn primary" onClick={handleStop}>
              ⏹&nbsp;&nbsp;结束
            </button>
          </div>
        </>
      )}

      <div className="now-footer">
        今天已专注 <strong>{formatDurationLong(todayTotal)}</strong>{' '}
        <span className="accent">✦</span>
      </div>

      <svg className="corner-peel" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M 8 28 Q 8 8 28 8 Q 48 8 52 28 Q 36 22 28 28 Q 22 36 28 52 Q 8 48 8 28 Z"
          fill="#FB923C" stroke="#EA580C" strokeWidth="1" opacity="0.7"
        />
        <path
          d="M 28 28 Q 24 32 22 38 Q 18 44 14 44"
          stroke="#FFFFFF" strokeWidth="1.2" fill="none" opacity="0.5"
        />
      </svg>
    </div>
  )
}
