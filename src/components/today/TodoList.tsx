'use client'

import { useState } from 'react'
import { computeTodoDuration } from '@/domain/planner'
import { formatDuration } from '@/domain/time'
import type { Todo, Record } from '@/domain/types'

interface Props {
  todos: Todo[]
  records: Record[]
  addTodo: (text: string, estimatedDuration?: number) => void
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

  // Edit Modal State
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [modalText, setModalText] = useState('')
  const [modalEst, setModalEst] = useState<number | ''>('')

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
      updateTodo({
        ...todo,
        status: 'done',
        completedAt: Date.now(),
      })
    }
  }

  const openEditModal = (todo: Todo) => {
    setEditingTodo(todo)
    setModalText(todo.text)
    setModalEst(todo.estimatedDuration ?? '')
  }

  const closeEditModal = () => {
    setEditingTodo(null)
    setModalText('')
    setModalEst('')
  }

  const handleSaveTodo = () => {
    if (editingTodo && modalText.trim()) {
      updateTodo({
        ...editingTodo,
        text: modalText.trim(),
        estimatedDuration: modalEst === '' ? undefined : modalEst,
      })
      closeEditModal()
    }
  }

  return (
    <>
      <div className="col-header">今天的计划 · {todos.length}</div>

      <div className="todo-list">
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
                className={`todo-checkbox ${todo.status === 'done' ? 'done' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleTodo(todo)
                }}
              />
              <div
                className="todo-content"
                onClick={() => openEditModal(todo)}
              >
                <div className="todo-text">{todo.text}</div>
                <div className="todo-meta">
                  {todo.status === 'done'
                    ? '完成 ✦'
                    : todo.estimatedDuration
                      ? `目标 ${formatDuration(todo.estimatedDuration * 60)}`
                      : actual > 0
                        ? `已投入 ${formatDuration(actual)}`
                        : ''}
                </div>
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
          <div className="todo-add-form">
            <input
              autoFocus
              value={newText}
              onChange={e => setNewText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleAdd()
                if (e.key === 'Escape') { setAdding(false); setNewText('') }
              }}
              onBlur={() => { if (!newText.trim()) setAdding(false) }}
              placeholder="写点什么..."
              className="todo-add-input"
            />
          </div>
        ) : (
          <div className="todo-add" onClick={() => setAdding(true)}>
            +&nbsp;&nbsp;加任务
          </div>
        )}
      </div>

      {/* Todo Details & Editing Modal */}
      {editingTodo && (
        <div className="peel-modal-backdrop" onClick={closeEditModal}>
          <div className="peel-modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>编辑任务</h3>
              <button className="modal-close" onClick={closeEditModal}>×</button>
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
                    setModalEst(v === '' ? '' : parseInt(v, 10))
                  }}
                  onKeyDown={e => { if (e.key === 'Enter') handleSaveTodo() }}
                  placeholder="无预估时间"
                  className="modal-input"
                />
              </div>
              <div className="modal-stats">
                <div className="stat-row">
                  <span>累计已投入时间:</span>
                  <strong>{formatDuration(computeTodoDuration(records, editingTodo.id))}</strong>
                </div>
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
