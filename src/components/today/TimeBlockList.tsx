import { useState } from 'react'
import { formatDate, formatDuration, formatTime, formatDurationLong } from '@/domain/time'
import { computeTotalDuration } from '@/domain/planner'
import { useSettings } from '@/hooks/useSettings'
import type { Record, Todo } from '@/domain/types'

interface Props {
  records: Record[]
  todos: Todo[]
  updateRecord: (record: Record) => void
  removeRecord: (id: string) => void
  reorderRecords: (records: Record[]) => void
}

interface DisplayRecord {
  id: string
  label: string
  startTime: number
  endTime: number
  duration: number
  tag?: 'pomodoro' | null
  linkedTodoId?: string | null
  channel?: 'work' | 'growth' | 'life' | null
  originalIds: string[]
}

function mergeAdjacentRecords(recs: Record[]): DisplayRecord[] {
  if (recs.length === 0) return []
  const result: DisplayRecord[] = []
  for (const r of recs) {
    const last = result[result.length - 1]
    if (
      last &&
      last.label === r.label &&
      last.linkedTodoId === r.linkedTodoId &&
      last.channel === r.channel
    ) {
      last.duration += r.duration
      last.endTime = r.endTime
      last.originalIds.push(r.id)
    } else {
      result.push({
        id: r.id,
        label: r.label,
        startTime: r.startTime,
        endTime: r.endTime,
        duration: r.duration,
        tag: r.tag,
        linkedTodoId: r.linkedTodoId,
        channel: r.channel,
        originalIds: [r.id],
      })
    }
  }
  return result
}

export function TimeBlockList({
  records,
  todos,
  updateRecord,
  removeRecord,
  reorderRecords,
}: Props) {
  const { settings } = useSettings()
  const dayBoundaryHour = settings.dayBoundaryHour ?? 0
  const totalSeconds = computeTotalDuration(records)

  const todayDateStr = formatDate(Date.now())
  const [y, m, d] = todayDateStr.split('-').map(Number)
  const logicalDayStartMs = new Date(y, m - 1, d, dayBoundaryHour, 0, 0, 0).getTime()
  const logicalDayEndMs = logicalDayStartMs + 24 * 3600 * 1000

  const mergedRecords = mergeAdjacentRecords(records)

  // Edit Modal State
  const [editingRecord, setEditingRecord] = useState<Record | null>(null)
  const [modalLabel, setModalLabel] = useState('')
  const [modalLinkedTodoId, setModalLinkedTodoId] = useState<string | null>(null)
  const [modalChannel, setModalChannel] = useState<'work' | 'growth' | 'life' | null>(null)

  const openEditModal = (rec: Record) => {
    setEditingRecord(rec)
    setModalLabel(rec.label)
    setModalLinkedTodoId(rec.linkedTodoId ?? null)
    setModalChannel(rec.channel ?? null)
  }

  const closeEditModal = () => {
    setEditingRecord(null)
    setModalLabel('')
    setModalLinkedTodoId(null)
    setModalChannel(null)
  }

  const handleSaveRecord = () => {
    if (editingRecord) {
      updateRecord({
        ...editingRecord,
        label: modalLabel.trim() || '未命名专注',
        linkedTodoId: modalLinkedTodoId || null,
        channel: modalChannel,
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

      {/* Horizontal Day Timeline Bar */}
      {records.length > 0 && (
        <div 
          className="horizontal-timeline"
          style={{
            width: '100%',
            height: '24px',
            background: 'var(--color-cream-off)',
            border: '1px solid var(--color-peel-border-subtle)',
            borderRadius: '12px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
            marginBottom: '10px',
            flexShrink: 0
          }}
        >
          {records.map(r => {
            const startMs = Math.max(logicalDayStartMs, r.startTime)
            const endMs = Math.min(logicalDayEndMs, r.endTime)
            if (startMs >= endMs) return null

            const leftPercent = ((startMs - logicalDayStartMs) / (24 * 3600 * 1000)) * 100
            const widthPercent = ((endMs - startMs) / (24 * 3600 * 1000)) * 100

            const channelBgs = {
              work: '#fb923c',
              growth: '#fde047',
              life: '#a3e635',
            }
            const bg = r.channel ? channelBgs[r.channel] : 'var(--color-text-tertiary)'

            return (
              <div
                key={r.id}
                style={{
                  position: 'absolute',
                  left: `${leftPercent}%`,
                  width: `${widthPercent}%`,
                  height: '100%',
                  background: bg,
                  opacity: 0.85,
                  transition: 'all 0.2s',
                }}
                title={`${r.label} (${formatTime(r.startTime)} - ${formatTime(r.endTime)})`}
              />
            )
          })}

          {/* Hour markers */}
          <div style={{ position: 'absolute', left: '25%', top: 0, bottom: 0, width: '1px', borderLeft: '1px dashed rgba(0,0,0,0.08)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', borderLeft: '1px dashed rgba(0,0,0,0.08)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', left: '75%', top: 0, bottom: 0, width: '1px', borderLeft: '1px dashed rgba(0,0,0,0.08)', pointerEvents: 'none' }} />
        </div>
      )}

      {/* Vertical list of merged records */}
      <div className="time-blocks" style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {mergedRecords.length === 0 ? (
          <div className="empty-state">还没有记录。去 Now 页开始计时吧。</div>
        ) : (
          mergedRecords.map(r => {
            const linkedTodo = todos.find(t => t.id === r.linkedTodoId)
            
            const borderColors = {
              work: '#ea580c',
              growth: '#ca8a04',
              life: '#16a34a',
            }
            const channelBgs = {
              work: '#fef3e7',
              growth: '#fefce8',
              life: '#f0fdf4',
            }
            const channelStyle = r.channel ? {
              background: channelBgs[r.channel],
              borderColor: borderColors[r.channel],
              borderLeft: `4px solid ${borderColors[r.channel]}`
            } : {}

            return (
              <div
                key={r.id}
                className={`time-block ${r.tag === 'pomodoro' ? 'pomodoro' : ''}`}
                style={channelStyle}
                draggable={true}
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/record-id', r.originalIds[0])
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
                    if (draggedRecordId && !r.originalIds.includes(draggedRecordId)) {
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
                onClick={() => {
                  const originalRec = records.find(rec => rec.id === r.id)
                  if (originalRec) openEditModal(originalRec)
                }}
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
        <div className="peel-modal-backdrop" tabIndex={-1} ref={el => el?.focus()} onClick={closeEditModal} onKeyDown={e => { if (e.key === 'Escape') closeEditModal() }}>
          <div className="peel-modal-card" role="dialog" aria-modal="true" aria-label="编辑记录" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>编辑记录</h3>
              <button className="modal-close" aria-label="关闭" onClick={closeEditModal}>×</button>
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
              <div className="form-group">
                <label className="form-label">生活/工作通道</label>
                <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setModalChannel(null)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      border: '1px solid',
                      borderColor: modalChannel === null ? 'var(--color-peel-orange)' : 'var(--color-peel-border-subtle)',
                      background: modalChannel === null ? 'var(--color-mode-pomodoro)' : 'var(--color-pure-white)',
                      color: modalChannel === null ? 'var(--color-peel-orange-deep)' : 'var(--color-text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    未分类
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalChannel('work')}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      border: '1px solid',
                      borderColor: modalChannel === 'work' ? '#ea580c' : 'var(--color-peel-border-subtle)',
                      background: modalChannel === 'work' ? '#fef3e7' : 'var(--color-pure-white)',
                      color: '#ea580c',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fb923c' }} />
                    工作
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalChannel('growth')}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      border: '1px solid',
                      borderColor: modalChannel === 'growth' ? '#ca8a04' : 'var(--color-peel-border-subtle)',
                      background: modalChannel === 'growth' ? '#fefce8' : 'var(--color-pure-white)',
                      color: '#ca8a04',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fde047' }} />
                    成长
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalChannel('life')}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      border: '1px solid',
                      borderColor: modalChannel === 'life' ? '#16a34a' : 'var(--color-peel-border-subtle)',
                      background: modalChannel === 'life' ? '#f0fdf4' : 'var(--color-pure-white)',
                      color: '#16a34a',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a3e635' }} />
                    生活
                  </button>
                </div>
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
