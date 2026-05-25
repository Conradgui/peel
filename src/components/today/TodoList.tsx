'use client'

import { useState } from 'react'
import { useTodos } from '@/hooks/useTodos'
import { useRecords } from '@/hooks/useRecords'
import { computeTodoDuration } from '@/domain/planner'
import { formatDuration } from '@/domain/time'

import type { Todo } from '@/domain/types'

export function TodoList() {
  const { todos, addTodo, updateTodo, deleteTodo } = useTodos()
  const { records, update: updateRecord } = useRecords()
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
                const recordId = e.dataTransfer.getData('text/plain')
                if (recordId) {
                  const record = records.find(r => r.id === recordId)
                  if (record) {
                    updateRecord({ ...record, linkedTodoId: todo.id })
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
