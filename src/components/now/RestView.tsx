'use client'

import { TimerDisplay } from './TimerDisplay'

interface Props {
  remaining: number
  breakMin: number
  onSkip: () => void
  onContinue: () => void
}

export function RestView({ remaining, breakMin, onSkip, onContinue }: Props) {
  return (
    <div className="rest-view">
      <h2 className="rest-title">休息中 ☕</h2>
      <TimerDisplay
        elapsedSeconds={breakMin * 60 - remaining}
        isCountdown
        target={breakMin * 60}
      />
      <div className="timer-controls">
        <button className="btn" onClick={onSkip}>
          跳过休息
        </button>
        <button className="btn primary" onClick={onContinue}>
          继续工作
        </button>
      </div>
    </div>
  )
}
