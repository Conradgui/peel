'use client'

import { useState } from 'react'
import { useTodos } from '@/hooks/useTodos'
import { useRecords } from '@/hooks/useRecords'
import { computeTodoDuration } from '@/domain/planner'
import { formatDuration } from '@/domain/time'

export function TodoList() {
  const { todos, addTodo, completeTodo, deleteTodo } = useTodos()
  const { records } = useRecords()
  const [newText, setNewText] = useState('')
  const [adding, setAdding] = useState(false)

  const handleAdd = () => {
    if (newText.trim()) {
      addTodo(newText.trim())
      setNewText('')
      setAdding(false)
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
              onClick={() => {
                if (todo.status !== 'done') completeTodo(todo.id)
              }}
            >
              <div className={`todo-checkbox ${todo.status === 'done' ? 'done' : ''}`} />
              <div className="todo-content">
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
    </>
  )
}
