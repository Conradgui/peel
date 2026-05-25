'use client'

import { useState } from 'react'
import { formatDuration, formatTime, formatDurationLong } from '@/domain/time'
import { computeTotalDuration } from '@/domain/planner'
import type { Record, Todo } from '@/domain/types'

interface Props {
  records: Record[]
  todos: Todo[]
  updateRecord: (record: Record) => void
  removeRecord: (id: string) => void
  reorderRecords: (records: Record[]) => void
}

export function TimeBlockList({
  records,
  todos,
  updateRecord,
  removeRecord,
  reorderRecords,
}: Props) {
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
      updateRecord({
        ...editingRecord,
        label: modalLabel.trim() || '未命名专注',
        linkedTodoId: modalLinkedTodoId || null,
      })
      closeEditModal()
    }
  }

  const handleDeleteRecord = () => {
    if (editingRecord) {
      removeRecord(editingRecord.id)
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
                  e.dataTransfer.setData('text/record-id', r.id)
                  e.dataTransfer.setData('text/drag-type', 'record')
                  e.currentTarget.classList.add('dragging')
                }}
                onDragEnd={(e) => {
                  e.currentTarget.classList.remove('dragging')
                }}
                onDragOver={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.add('drag-over')
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove('drag-over')
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.remove('drag-over')
                  const dragType = e.dataTransfer.getData('text/drag-type')
                  if (dragType === 'record') {
                    const draggedRecordId = e.dataTransfer.getData('text/record-id')
                    if (draggedRecordId && draggedRecordId !== r.id) {
                      const draggedIndex = records.findIndex(rec => rec.id === draggedRecordId)
                      const targetIndex = records.findIndex(rec => rec.id === r.id)
                      if (draggedIndex >= 0 && targetIndex >= 0) {
                        const newRecords = [...records]
                        const [draggedItem] = newRecords.splice(draggedIndex, 1)
                        newRecords.splice(targetIndex, 0, draggedItem)
                        reorderRecords(newRecords)
                      }
                    }
                  }
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
                  onKeyDown={e => { if (e.key === 'Enter') handleSaveRecord() }}
                  placeholder="未命名专注"
                  className="modal-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">关联计划任务</label>
                <select
                  value={modalLinkedTodoId || ''}
                  onChange={e => setModalLinkedTodoId(e.target.value || null)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSaveRecord() }}
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
