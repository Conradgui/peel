'use client'

import { useState } from 'react'
import { useTodos } from '@/hooks/useTodos'
import { formatDate } from '@/domain/time'

interface Props {
  onSelect: (label: string, todoId: string | null) => void
}

export function TaskInput({ onSelect }: Props) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const { todos } = useTodos()
  const pendingTodos = todos.filter(t => t.status !== 'done')

  const handleSubmit = () => {
    if (text.trim()) {
      onSelect(text.trim(), null)
      setText('')
      setOpen(false)
    }
  }

  return (
    <div className="task-input-wrapper">
      <input
        className="task-input"
        value={text}
        onChange={e => setText(e.target.value)}
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
                onSelect(t.text, t.id)
                setText('')
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
