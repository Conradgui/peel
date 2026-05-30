'use client'

import { useState, useMemo } from 'react'
import { getAllReflections } from '@/storage/reflectionStorage'
import { computeTodoDuration } from '@/domain/planner'
import { formatDuration } from '@/domain/time'
import type { Todo, Record } from '@/domain/types'

interface Props {
  todos: Todo[]
  records: Record[]
  addTodo: (text: string, estimatedDuration?: number) => Todo
  updateTodo: (todo: Todo) => void
  deleteTodo: (id: string) => void
  updateRecord: (record: Record) => void
  reorderTodos: (todos: Todo[]) => void
}

export function TodoList({
  todos,
  records,
  addTodo,
  updateTodo,
  deleteTodo,
  updateRecord,
  reorderTodos,
}: Props) {
  const [newText, setNewText] = useState('')
  const [adding, setAdding] = useState(false)

  // Find a matching reflection for the current input text
  const matchedReflection = useMemo(() => {
    const query = newText.trim().toLowerCase()
    if (query.length < 2) return null

    const allReflections = getAllReflections()
    const matchingDates = Object.keys(allReflections)
      .filter(date => allReflections[date].toLowerCase().includes(query))
      .sort((a, b) => b.localeCompare(a))

    if (matchingDates.length > 0) {
      return {
        date: matchingDates[0],
        text: allReflections[matchingDates[0]]
      }
    }
    return null
  }, [newText])

  // Edit Modal State
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [modalText, setModalText] = useState('')
  const [modalEst, setModalEst] = useState<number | ''>('')
  const [modalChannel, setModalChannel] = useState<'work' | 'growth' | 'life' | null>(null)

  const handleAdd = () => {
    if (newText.trim()) {
      addTodo(newText.trim())
      setNewText('')
      setAdding(false)
    }
  }

  const toggleTodo = (todo: Todo) => {
    if (todo.status === 'done') {
      updateTodo({
        ...todo,
        status: 'pending',
        completedAt: undefined,
      })
    } else {
      const now = Date.now() // eslint-disable-line react-hooks/purity -- called in event handler, not during render
      updateTodo({
        ...todo,
        status: 'done',
        completedAt: now,
      })
    }
  }

  const openEditModal = (todo: Todo) => {
    setEditingTodo(todo)
    setModalText(todo.text)
    setModalEst(todo.estimatedDuration ?? '')
    setModalChannel(todo.channel ?? null)
  }

  const closeEditModal = () => {
    setEditingTodo(null)
    setModalText('')
    setModalEst('')
    setModalChannel(null)
  }

  const handleSaveTodo = () => {
    if (editingTodo && modalText.trim()) {
      updateTodo({
        ...editingTodo,
        text: modalText.trim(),
        estimatedDuration: modalEst === '' ? undefined : modalEst,
        channel: modalChannel,
      })
      closeEditModal()
    }
  }

  return (
    <>
      <div className="col-header">今天的计划 · {todos.length}</div>

      <div
        className="todo-list"
        onDragOver={(e) => {
          e.preventDefault()
          e.currentTarget.classList.add('list-drag-over')
        }}
        onDragLeave={(e) => {
          e.currentTarget.classList.remove('list-drag-over')
        }}
        onDrop={(e) => {
          e.preventDefault()
          e.currentTarget.classList.remove('list-drag-over')
          const dragType = e.dataTransfer.getData('text/drag-type')
          if (dragType === 'record') {
            const recordId = e.dataTransfer.getData('text/record-id')
            if (recordId) {
              const record = records.find(r => r.id === recordId)
              if (record) {
                const todoText = record.label.trim() || '未命名专注'
                const newTodo = addTodo(todoText)
                if (newTodo && newTodo.id) {
                  updateRecord({ ...record, linkedTodoId: newTodo.id })
                }
              }
            }
          }
        }}
      >
        {todos.length === 0 && !adding && (
          <div className="todo-empty-state">
            今天还没安排，加点什么吗？
          </div>
        )}
        {todos.map(todo => {
          const actual = computeTodoDuration(records, todo.id)
          return (
            <div
              key={todo.id}
              className={`todo-item ${todo.status === 'done' ? 'done' : ''}`}
              draggable={true}
              onDragStart={(e) => {
                e.dataTransfer.setData('text/todo-id', todo.id)
                e.dataTransfer.setData('text/drag-type', 'todo')
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
                e.stopPropagation()
                e.currentTarget.classList.remove('drag-over')
                const dragType = e.dataTransfer.getData('text/drag-type')
                if (dragType === 'record') {
                  const recordId = e.dataTransfer.getData('text/record-id')
                  if (recordId) {
                    const record = records.find(r => r.id === recordId)
                    if (record) {
                      updateRecord({ ...record, linkedTodoId: todo.id })
                    }
                  }
                } else if (dragType === 'todo') {
                  const draggedTodoId = e.dataTransfer.getData('text/todo-id')
                  if (draggedTodoId && draggedTodoId !== todo.id) {
                    const draggedIndex = todos.findIndex(t => t.id === draggedTodoId)
                    const targetIndex = todos.findIndex(t => t.id === todo.id)
                    if (draggedIndex >= 0 && targetIndex >= 0) {
                      const newTodos = [...todos]
                      const [draggedItem] = newTodos.splice(draggedIndex, 1)
                      newTodos.splice(targetIndex, 0, draggedItem)
                      reorderTodos(newTodos)
                    }
                  }
                }
              }}
            >
              <div
                role="checkbox"
                aria-checked={todo.status === 'done'}
                tabIndex={0}
                className={`todo-checkbox ${todo.status === 'done' ? 'done' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleTodo(todo)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    e.stopPropagation()
                    toggleTodo(todo)
                  }
                }}
              />
              <div
                className="todo-content"
                onClick={() => openEditModal(todo)}
              >
                <div className="todo-text" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {todo.channel && (
                    <span 
                      style={{ 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        background: todo.channel === 'work' ? '#fb923c' : todo.channel === 'growth' ? '#fde047' : '#a3e635',
                        flexShrink: 0
                      }} 
                    />
                  )}
                  {todo.text}
                </div>
                <div className="todo-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>
                    {todo.status === 'done'
                      ? '完成 ✦'
                      : todo.estimatedDuration
                        ? `目标 ${formatDuration(todo.estimatedDuration * 60)}`
                        : actual > 0
                          ? `已投入 ${formatDuration(actual)}`
                          : ''}
                  </span>
                  {todo.estimatedDuration && actual > 0 && (
                    <span style={{ fontSize: '11px', color: (actual / (todo.estimatedDuration * 60)) > 1.2 ? 'var(--color-peel-orange-deep)' : 'var(--color-text-tertiary)' }}>
                      已投入 {formatDuration(actual)}
                      {(actual / (todo.estimatedDuration * 60)) > 1.2 && ` (超额 ${Math.round(((actual / (todo.estimatedDuration * 60)) - 1) * 100)}%)`}
                    </span>
                  )}
                </div>
                {todo.estimatedDuration && actual > 0 && (
                  <div className="todo-progress-container" style={{ height: '4px', width: '100%', background: 'var(--color-peel-border-subtle)', borderRadius: '2px', marginTop: '6px', overflow: 'hidden' }}>
                    <div
                      className="todo-progress-bar"
                      style={{
                        height: '100%',
                        width: `${Math.min(100, (actual / (todo.estimatedDuration * 60)) * 100)}%`,
                        background: (actual / (todo.estimatedDuration * 60)) > 1.2 ? 'var(--color-peel-orange-deep)' : 'var(--color-peel-orange)',
                        borderRadius: '2px',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                )}
                {(() => {
                  const linkedRecords = records.filter(r => r.linkedTodoId === todo.id)
                  if (linkedRecords.length === 0) return null
                  return (
                    <div className="todo-linked-records" onClick={e => e.stopPropagation()}>
                      {linkedRecords.map(r => (
                        <div key={r.id} className="todo-linked-record-pill">
                          <span className="pill-dot" />
                          <span className="pill-label">{r.label || '未命名专注'}</span>
                          <span className="pill-duration">{formatDuration(r.duration)}</span>
                        </div>
                      ))}
                    </div>
                  )
                })()}
              </div>
            </div>
          )
        })}

        {adding ? (
          <div className="todo-add-form" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input
              autoFocus
              value={newText}
              onChange={e => setNewText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleAdd()
                if (e.key === 'Escape') { setAdding(false); setNewText('') }
              }}
              onBlur={(e) => {
                if (e.relatedTarget && (e.relatedTarget as HTMLElement).classList.contains('calibration-bubble')) {
                  return
                }
                if (!newText.trim()) setAdding(false)
              }}
              placeholder="写点什么..."
              className="todo-add-input"
            />
            {matchedReflection && (
              <div 
                className="calibration-bubble"
                tabIndex={0}
                style={{
                  fontSize: '11px',
                  color: 'var(--color-text-secondary)',
                  background: 'var(--color-cream-off)',
                  border: '1px dashed var(--color-peel-orange)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  lineHeight: '1.4',
                  animation: 'fadeIn 0.2s ease',
                  outline: 'none',
                }}
              >
                💡 历史反思 ({matchedReflection.date})：“{matchedReflection.text}”
              </div>
            )}
          </div>
        ) : (
          <div className="todo-add" onClick={() => setAdding(true)}>
            +&nbsp;&nbsp;加任务
          </div>
        )}
      </div>

      {/* Todo Details & Editing Modal */}
      {editingTodo && (
        <div className="peel-modal-backdrop" tabIndex={-1} ref={el => el?.focus()} onClick={closeEditModal} onKeyDown={e => { if (e.key === 'Escape') closeEditModal() }}>
          <div className="peel-modal-card" role="dialog" aria-modal="true" aria-label="编辑任务" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>编辑任务</h3>
              <button className="modal-close" aria-label="关闭" onClick={closeEditModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">任务名称</label>
                <input
                  type="text"
                  value={modalText}
                  onChange={e => setModalText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSaveTodo() }}
                  placeholder="任务名称..."
                  className="modal-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">预估时间 (分钟)</label>
                <input
                  type="number"
                  value={modalEst}
                  onChange={e => {
                    const v = e.target.value
                    if (v === '') {
                      setModalEst('')
                    } else {
                      const parsed = parseInt(v, 10)
                      setModalEst(isNaN(parsed) ? '' : parsed)
                    }
                  }}
                  onKeyDown={e => { if (e.key === 'Enter') handleSaveTodo() }}
                  placeholder="无预估时间"
                  className="modal-input"
                />
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
                  <span>累计已投入时间:</span>
                  <strong>{formatDuration(computeTodoDuration(records, editingTodo.id))}</strong>
                </div>
                {editingTodo.estimatedDuration && (
                  <div className="stat-row" style={{ marginTop: '8px', fontSize: '12px', color: (computeTodoDuration(records, editingTodo.id) / (editingTodo.estimatedDuration * 60)) > 1.2 ? 'var(--color-peel-orange-deep)' : 'var(--color-text-secondary)' }}>
                    <span>预期偏差评估:</span>
                    <strong>
                      {(() => {
                        const act = computeTodoDuration(records, editingTodo.id)
                        const est = editingTodo.estimatedDuration * 60
                        if (act === 0) return '尚未开始专注'
                        if (act <= est) return `用时在预估范围内 (${Math.round((act / est) * 100)}%)`
                        return `超出预估 ${Math.round(((act - est) / est) * 100)}%，建议在复盘时剥离原因`
                      })()}
                    </strong>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn destructive"
                onClick={() => {
                  deleteTodo(editingTodo.id)
                  closeEditModal()
                }}
              >
                删除任务
              </button>
              <button className="btn primary" onClick={handleSaveTodo}>
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
