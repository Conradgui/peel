'use client'

import { useSettings } from '@/hooks/useSettings'
import { formatDate } from '@/domain/time'
import type { Settings } from '@/domain/types'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'

export function SettingsPage() {
  const { settings, update } = useSettings()
  const [storageSize, setStorageSize] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Calculate total localStorage size
  /* eslint-disable react-hooks/set-state-in-effect -- hydration: reads localStorage once on mount */
  useEffect(() => {
    if (typeof window === 'undefined') return
    let totalBytes = 0
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('peel-')) {
        const val = localStorage.getItem(key) || ''
        totalBytes += (key.length + val.length) * 2 // UTF-16 characters = 2 bytes
      }
    }
    setStorageSize(totalBytes)
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleExport = () => {
    if (typeof window === 'undefined') return
    const data = {
      version: 'v0.1.0',
      exportedAt: new Date().toISOString(),
      records: JSON.parse(localStorage.getItem('peel-records') || '{}'),
      todos: JSON.parse(localStorage.getItem('peel-todos') || '{}'),
      settings: JSON.parse(localStorage.getItem('peel-settings') || '{}'),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `peel-data-${formatDate(Date.now())}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof window === 'undefined') return
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const raw = event.target?.result as string
        const parsed = JSON.parse(raw)
        
        if (!parsed.records || !parsed.todos || !parsed.settings) {
          alert('无效的备份文件：缺少必要的数据结构！')
          return
        }

        localStorage.setItem('peel-records', JSON.stringify(parsed.records))
        localStorage.setItem('peel-todos', JSON.stringify(parsed.todos))
        localStorage.setItem('peel-settings', JSON.stringify(parsed.settings))
        
        alert('导入成功！正在为您重新加载页面...')
        window.location.reload()
      } catch {
        alert('导入失败，解析 JSON 备份文件时出错。')
      }
    }
    reader.readAsText(file)
  }

  const handleClearCache = () => {
    if (typeof window === 'undefined') return
    const confirmed = window.confirm('确定要清除所有本地缓存的数据吗？此操作将清空所有专注记录、待办计划和设置，且无法恢复！')
    if (confirmed) {
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('peel-')) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k))
      alert('本地缓存已完全清除，正在重新加载页面...')
      window.location.reload()
    }
  }

  const isStorageWarning = storageSize > 4 * 1024 * 1024 // 4MB threshold

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1 className="settings-title">设置</h1>
        <Link href="/" className="settings-back">
          ◀ 返回首页
        </Link>
      </div>

      {/* Pomodoro Settings */}
      <div className="settings-section">
        <h2 className="settings-section-title">🍅 番茄钟配置</h2>
        
        <div className="settings-row">
          <label className="settings-label" htmlFor="pomo-work">工作时长 (分钟)</label>
          <input
            id="pomo-work"
            type="number"
            min="1"
            className="settings-input"
            value={settings.pomodoroWork}
            onChange={e => update('pomodoroWork', Math.max(1, parseInt(e.target.value) || 1))}
          />
        </div>

        <div className="settings-row">
          <label className="settings-label" htmlFor="pomo-break">休息时长 (分钟)</label>
          <input
            id="pomo-break"
            type="number"
            min="1"
            className="settings-input"
            value={settings.pomodoroBreak}
            onChange={e => update('pomodoroBreak', Math.max(1, parseInt(e.target.value) || 1))}
          />
        </div>

        <div className="settings-row">
          <label className="settings-label" htmlFor="pomo-cycles">循环周期数</label>
          <input
            id="pomo-cycles"
            type="number"
            min="1"
            className="settings-input"
            value={settings.pomodoroCycleCount}
            onChange={e => update('pomodoroCycleCount', Math.max(1, parseInt(e.target.value) || 1))}
          />
        </div>
      </div>

      {/* Time and Day Settings */}
      <div className="settings-section">
        <h2 className="settings-section-title">📅 日程与时间偏置</h2>
        
        <div className="settings-row">
          <label className="settings-label" htmlFor="day-boundary">自定义日界线 (凌晨)</label>
          <select
            id="day-boundary"
            className="settings-select"
            value={settings.dayBoundaryHour}
            onChange={e => update('dayBoundaryHour', parseInt(e.target.value, 10))}
          >
            <option value="0">凌晨 0 点 (默认)</option>
            <option value="1">凌晨 1 点</option>
            <option value="2">凌晨 2 点</option>
            <option value="3">凌晨 3 点</option>
            <option value="4">凌晨 4 点</option>
            <option value="5">凌晨 5 点</option>
          </select>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', lineHeight: '1.4', marginTop: '-4px' }}>
          设置您的一天何时结束。如果您经常学习或写代码到深夜，设置例如“凌晨 3 点”可以将半夜的记录归入前一天，避免您的努力跨天碎裂。
        </div>
      </div>

      {/* Orange Rain Settings */}
      <div className="settings-section">
        <h2 className="settings-section-title">🍊 橘子雨配置</h2>

        <div className="settings-row">
          <label className="settings-label" htmlFor="rain-interval">橘子雨频率</label>
          <select
            id="rain-interval"
            className="settings-select"
            value={settings.orangeRainInterval}
            onChange={e => {
              const val = e.target.value
              update('orangeRainInterval', val === 'off' ? 'off' : (parseInt(val, 10) as Settings['orangeRainInterval']))
            }}
          >
            <option value="15">每 15 分钟</option>
            <option value="30">每 30 分钟 (默认)</option>
            <option value="45">每 45 分钟</option>
            <option value="60">每 60 分钟</option>
            <option value="off">关闭</option>
          </select>
        </div>

        <div className="settings-row">
          <label className="settings-label" htmlFor="rain-sound">开启橘子雨声音</label>
          <div className="settings-checkbox-wrapper">
            <input
              id="rain-sound"
              type="checkbox"
              className="settings-checkbox"
              checked={settings.orangeRainSound}
              onChange={e => update('orangeRainSound', e.target.checked)}
            />
          </div>
        </div>
      </div>

      {/* Backup and storage */}
      <div className="settings-section">
        <h2 className="settings-section-title">📦 数据备份与管理</h2>
        
        <div className="settings-row">
          <span className="settings-label">当前本地存储占用</span>
          <span className="settings-storage-size">
            {(storageSize / 1024).toFixed(2)} KB
          </span>
        </div>

        {isStorageWarning && (
          <div className="settings-warning">
            ⚠️ 你的本地存储占用已超过 4MB，为了防止浏览器清理引起的数据丢失，建议立即导出备份！
          </div>
        )}

        <div className="settings-row actions" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleImport}
            />
            <button className="btn primary" onClick={() => fileInputRef.current?.click()}>
              导入 JSON 备份
            </button>
            <button className="btn primary" onClick={handleExport}>
              导出 JSON 备份
            </button>
          </div>
          <button className="btn destructive" onClick={handleClearCache}>
            清除本地缓存
          </button>
        </div>
      </div>
    </div>
  )
}
