'use client'

import { useState, useCallback } from 'react'
import { NavSegmented } from '@/components/shell/NavSegmented'
import { ModeToggle } from '@/components/shell/ModeToggle'
import { NowPage } from '@/components/now/NowPage'
import { TodayPage } from '@/components/today/TodayPage'
import { ReflectionPage } from '@/components/reflection/ReflectionPage'
import { OrangeRain } from '@/components/orange-rain/OrangeRain'
import Link from 'next/link'

export default function App() {
  const [view, setView] = useState<'now' | 'today' | 'reflection'>('now')
  const [isPomodoro, setIsPomodoro] = useState(false)
  const [rainTrigger, setRainTrigger] = useState(0)
  const [isBreak, setIsBreak] = useState(false)

  const handleRainTrigger = useCallback(() => {
    setRainTrigger(t => t + 1)
  }, [])

  const isRestMode = view === 'now' && isBreak
  const isPomoMode = isPomodoro && !isRestMode

  return (
    <>
      <div className={`app ${isRestMode ? 'rest-mode' : isPomoMode ? 'pomodoro-mode' : ''}`} id="app">
        <header>
          <div className="brand">
            peel<span className="dot">.</span>
          </div>

          <NavSegmented value={view} onChange={setView} />

          <div className="mode-toggle-wrapper">
            <div style={{ visibility: view === 'now' ? 'visible' : 'hidden', display: 'flex', alignItems: 'center' }}>
              <ModeToggle value={isPomodoro} onChange={setIsPomodoro} />
            </div>
            <Link href="/settings" title="设置" className="settings-link-header">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </Link>
          </div>
        </header>

        <main>
          {view === 'now' && (
            <div className="view active">
              <NowPage
                isPomodoro={isPomodoro}
                onRainTrigger={handleRainTrigger}
                onBreakChange={setIsBreak}
              />
            </div>
          )}
          {view === 'today' && (
            <div className="view active">
              <TodayPage />
            </div>
          )}
          {view === 'reflection' && (
            <div className="view active">
              <ReflectionPage />
            </div>
          )}
        </main>
      </div>

      <OrangeRain trigger={rainTrigger} />
    </>
  )
}
