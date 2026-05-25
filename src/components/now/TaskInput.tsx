'use client'

import { useState } from 'react'
import { useTodos } from '@/hooks/useTodos'

interface Props {
  text: string
  setText: (t: string) => void
  selectedTodoId: string | null
  setSelectedTodoId: (id: string | null) => void
  onSelect: (label: string, todoId: string | null) => void
}

export function TaskInput({
  text,
  setText,
  selectedTodoId,
  setSelectedTodoId,
  onSelect,
}: Props) {
  const [open, setOpen] = useState(false)
  const { todos } = useTodos()
  const pendingTodos = todos.filter(t => t.status !== 'done')

  const handleSubmit = () => {
    if (text.trim()) {
      onSelect(text.trim(), selectedTodoId)
      setText('')
      setSelectedTodoId(null)
      setOpen(false)
    }
  }

  return (
    <div className="task-input-wrapper">
      <input
        className="task-input"
        value={text}
        onChange={e => {
          setText(e.target.value)
          setSelectedTodoId(null)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
        placeholder="你正在做什么？"
      />
      {open && pendingTodos.length > 0 && (
        <ul className="todo-dropdown">
          {pendingTodos.map(t => (
            <li
              key={t.id}
              onMouseDown={(e) => {
                e.preventDefault()
                setText(t.text)
                setSelectedTodoId(t.id)
                setOpen(false)
              }}
            >
              <span className="todo-dropdown-marker">○</span> {t.text}
            </li>
          ))}
          <li className="divider" />
          {text.trim() && (
            <li
              className="new"
              onMouseDown={(e) => {
                e.preventDefault()
                handleSubmit()
              }}
            >
              或者打一个新任务...
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
