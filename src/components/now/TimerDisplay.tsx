'use client'

import { formatTimerDisplay, formatCountdown } from '@/domain/time'

interface Props {
  elapsedSeconds: number
  isCountdown?: boolean
  target?: number // seconds for countdown
}

export function TimerDisplay({ elapsedSeconds, isCountdown, target }: Props) {
  const displayText = isCountdown && target
    ? formatCountdown(Math.max(0, target - elapsedSeconds))
    : formatTimerDisplay(elapsedSeconds)

  return (
    <div className="timer-display">
      {displayText}
    </div>
  )
}
