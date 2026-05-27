// Schema C todo storage — todos keyed by date (YYYY-MM-DD).

import type { Todo } from '@/domain/types'
import { createId } from '@/domain/types'

const KEY = 'peel-todos'

type TodosByDate = { [date: string]: Todo[] }

function read(): TodosByDate {
  if (typeof localStorage === 'undefined') return {}
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function write(data: TodosByDate): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    // quota exceeded — silently fail to prevent app crash
  }
}

export function addTodo(text: string, date: string, estimatedDuration?: number): Todo {
  const data = read()
  const todo: Todo = {
    id: createId('todo'),
    text: text.trim(),
    status: 'pending',
    estimatedDuration,
    date,
    createdAt: Date.now(),
  }
  if (!data[date]) data[date] = []
  data[date].push(todo)
  write(data)
  return todo
}

export function getTodosByDate(date: string): Todo[] {
  return read()[date] ?? []
}

export function updateTodo(todo: Todo): void {
  const data = read()
  const idx = data[todo.date]?.findIndex(t => t.id === todo.id) ?? -1
  if (idx >= 0) {
    data[todo.date][idx] = todo
    write(data)
  }
}

export function deleteTodo(id: string, date: string): void {
  const data = read()
  if (data[date]) {
    data[date] = data[date].filter(t => t.id !== id)
    if (data[date].length === 0) delete data[date]
    write(data)
  }
}

export function completeTodo(id: string, date: string): void {
  const data = read()
  const idx = data[date]?.findIndex(t => t.id === id) ?? -1
  if (idx >= 0) {
    data[date][idx] = {
      ...data[date][idx],
      status: 'done',
      completedAt: Date.now(),
    }
    write(data)
  }
}

export function getAllTodos(): TodosByDate {
  return read()
}

export function saveTodosForDate(date: string, items: Todo[]): void {
  const data = read()
  data[date] = items
  write(data)
}
