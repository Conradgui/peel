'use client'

import { useState } from 'react'
import { useRecords } from '@/hooks/useRecords'
import { useTodos } from '@/hooks/useTodos'
import { formatDuration, formatTime, formatDurationLong } from '@/domain/time'
import { computeTotalDuration } from '@/domain/planner'
import type { Record } from '@/domain/types'

export function TimeBlockList() {
  const { records, update, remove } = useRecords()
  const { todos } = useTodos()

  const totalSeconds = computeTotalDuration(records)

  // Edit Modal State
  const [editingRecord, setEditingRecord] = useState<Record | null>(null)
  const [modalLabel, setModalLabel] = useState('')
  const [modalLinkedTodoId, setModalLinkedTodoId] = useState<string | null>(null)

  const openEditModal = (rec: Record) => {
    setEditingRecord(rec)
    setModalLabel(rec.label)
    setModalLinkedTodoId(rec.linkedTodoId ?? null)
  }

  const closeEditModal = () => {
    setEditingRecord(null)
    setModalLabel('')
    setModalLinkedTodoId(null)
  }

  const handleSaveRecord = () => {
    if (editingRecord) {
      update({
        ...editingRecord,
        label: modalLabel.trim() || '未命名专注',
        linkedTodoId: modalLinkedTodoId || null,
      })
      closeEditModal()
    }
  }

  const handleDeleteRecord = () => {
    if (editingRecord) {
      remove(editingRecord.id)
      closeEditModal()
    }
  }

  return (
    <div className="today-col">
      <div className="col-header">今天的时间块 · {records.length}</div>

      <div className="time-blocks">
        {records.length === 0 ? (
          <div className="empty-state">还没有记录。去 Now 页开始计时吧。</div>
        ) : (
          records.map(r => {
            const linkedTodo = todos.find(t => t.id === r.linkedTodoId)
            return (
              <div
                key={r.id}
                className={`time-block ${r.tag === 'pomodoro' ? 'pomodoro' : ''}`}
                draggable={true}
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', r.id)
                  e.currentTarget.classList.add('dragging')
                }}
                onDragEnd={(e) => {
                  e.currentTarget.classList.remove('dragging')
                }}
                onClick={() => openEditModal(r)}
              >
                <div className="time-block-header">
                  <div className="time-block-name">{r.label || '未命名专注'}</div>
                  <div className="time-block-duration">
                    {formatDuration(r.duration)}
                  </div>
                </div>
                <div className="time-block-meta">
                  <span className="time-block-time">
                    {formatTime(r.startTime)} — {formatTime(r.endTime)}
                  </span>
                  {linkedTodo && (
                    <span className="time-block-todo-tag">
                      {linkedTodo.text}
                    </span>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {records.length > 0 && (
        <div className="today-total">
          今天累计<strong>{formatDurationLong(totalSeconds)}</strong>
        </div>
      )}

      {/* Time Block Edit Modal */}
      {editingRecord && (
        <div className="peel-modal-backdrop" onClick={closeEditModal}>
          <div className="peel-modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>编辑记录</h3>
              <button className="modal-close" onClick={closeEditModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">专注内容</label>
                <input
                  type="text"
                  value={modalLabel}
                  onChange={e => setModalLabel(e.target.value)}
                  placeholder="未命名专注"
                  className="modal-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">关联计划任务</label>
                <select
                  value={modalLinkedTodoId || ''}
                  onChange={e => setModalLinkedTodoId(e.target.value || null)}
                  className="modal-select"
                >
                  <option value="">无关联</option>
                  {todos.map(todo => (
                    <option key={todo.id} value={todo.id}>
                      {todo.text} {todo.status === 'done' ? '(已完成)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-stats">
                <div className="stat-row">
                  <span>开始时间:</span>
                  <strong>{new Date(editingRecord.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
                </div>
                <div className="stat-row">
                  <span>结束时间:</span>
                  <strong>{new Date(editingRecord.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
                </div>
                <div className="stat-row">
                  <span>实际时长:</span>
                  <strong>{formatDuration(editingRecord.duration)}</strong>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn destructive"
                onClick={handleDeleteRecord}
              >
                删除记录
              </button>
              <button className="btn primary" onClick={handleSaveRecord}>
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
