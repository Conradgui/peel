'use client'

import { useState, useCallback, useEffect } from 'react'
import { NavSegmented } from '@/components/shell/NavSegmented'
import { ModeToggle } from '@/components/shell/ModeToggle'
import { NowPage } from '@/components/now/NowPage'
import { TodayPage } from '@/components/today/TodayPage'
import { ReflectionPage } from '@/components/reflection/ReflectionPage'
import { OrangeRain } from '@/components/orange-rain/OrangeRain'
import { useTimer } from '@/hooks/useTimer'
import { useTodos } from '@/hooks/useTodos'
import { useRecords } from '@/hooks/useRecords'
import Link from 'next/link'

export default function App() {
  const [view, setView] = useState<'now' | 'today' | 'reflection'>('now')
  const [isPomodoro, setIsPomodoro] = useState(false)
  const [rainTrigger, setRainTrigger] = useState(0)
  const [isBreak, setIsBreak] = useState(false)

  // Lifted state hooks
  const timer = useTimer()
  const todosHook = useTodos()
  const recordsHook = useRecords()

  const [showDistractionInput, setShowDistractionInput] = useState(false)
  const [distractionText, setDistractionText] = useState('')

  const handleRainTrigger = useCallback(() => {
    setRainTrigger(t => t + 1)
  }, [])

  const isRestMode = view === 'now' && isBreak
  const isPomoMode = isPomodoro && !isRestMode

  // Listen for Shift+D keypress to toggle distraction input globally when timer is running
  useEffect(() => {
    if (!timer.state.isRunning) {
      setShowDistractionInput(false)
      return
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const isD = e.key === 'd' || e.key === 'D' || e.keyCode === 68 || e.code === 'KeyD'
      if (e.shiftKey && isD) {
        const activeEl = document.activeElement
        if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
          return
        }
        e.preventDefault()
        setShowDistractionInput(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [timer.state.isRunning])

  const recentRecords = recordsHook.getLast7Days()

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
                timer={timer}
                todos={todosHook}
                records={recordsHook}
              />
            </div>
          )}
          {view === 'today' && (
            <div className="view active">
              <TodayPage
                todos={todosHook.todos}
                records={recordsHook.records}
                addTodo={todosHook.addTodo}
                updateTodo={todosHook.updateTodo}
                deleteTodo={todosHook.deleteTodo}
                updateRecord={recordsHook.update}
                reorderTodos={todosHook.reorderTodos}
                removeRecord={recordsHook.remove}
                reorderRecords={recordsHook.reorderRecords}
                recentRecords={recentRecords}
              />
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

      {/* Global Distraction Overlay */}
      {showDistractionInput && (
        <div 
          className="peel-modal-backdrop" 
          onClick={() => { setShowDistractionInput(false); setDistractionText(''); }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(26, 26, 22, 0.4)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            animation: 'fadeIn 200ms ease-out',
          }}
        >
          <div 
            className="peel-modal-card" 
            role="dialog"
            aria-modal="true"
            aria-label="记录分心杂念"
            onClick={e => e.stopPropagation()}
            style={{
              width: '320px',
              background: 'var(--color-pure-white)',
              border: '1px solid var(--color-peel-border-subtle)',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: 'var(--shadow-lifted)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🍊 剥离分心 / 记录杂念</span>
            </div>
            <input
              autoFocus
              className="modal-input"
              style={{ width: '100%', textAlign: 'left', fontSize: '14px', padding: '10px 14px' }}
              value={distractionText}
              onChange={e => setDistractionText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  const val = distractionText.trim()
                  if (val) {
                    todosHook.addTodo(val)
                    setDistractionText('')
                    setShowDistractionInput(false)
                  }
                } else if (e.key === 'Escape') {
                  setDistractionText('')
                  setShowDistractionInput(false)
                }
              }}
              placeholder="在这里输入分心的想法，回车存为待办..."
            />
            <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>
              按 Esc 取消，按 Enter 保存。这不会打断当前的专注。
            </div>
          </div>
        </div>
      )}
    </>
  )
}
