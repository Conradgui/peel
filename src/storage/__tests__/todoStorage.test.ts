import { describe, it, expect, beforeEach } from 'vitest'
import { addTodo, getTodosByDate, updateTodo, deleteTodo, completeTodo, saveTodosForDate } from '../todoStorage'

beforeEach(() => localStorage.clear())

describe('todoStorage', () => {
  it('adds a todo and retrieves it by date', () => {
    const todo = addTodo('写 PRD', '2026-05-17')
    expect(todo.text).toBe('写 PRD')
    expect(todo.status).toBe('pending')
    expect(getTodosByDate('2026-05-17')).toHaveLength(1)
  })

  it('trims whitespace from text', () => {
    const todo = addTodo('  有空格  ', '2026-05-17')
    expect(todo.text).toBe('有空格')
  })

  it('stores estimatedDuration when provided', () => {
    const todo = addTodo('深度工作', '2026-05-17', 30)
    expect(todo.estimatedDuration).toBe(30)
    expect(getTodosByDate('2026-05-17')[0].estimatedDuration).toBe(30)
  })

  it('updates a todo', () => {
    const todo = addTodo('原始', '2026-05-17')
    updateTodo({ ...todo, text: '已修改' })
    expect(getTodosByDate('2026-05-17')[0].text).toBe('已修改')
  })

  it('deletes a todo', () => {
    const t1 = addTodo('A', '2026-05-17')
    addTodo('B', '2026-05-17')
    deleteTodo(t1.id, '2026-05-17')
    expect(getTodosByDate('2026-05-17')).toHaveLength(1)
    expect(getTodosByDate('2026-05-17')[0].text).toBe('B')
  })

  it('cleans up empty date key after deleting last todo', () => {
    const t = addTodo('only', '2026-05-17')
    deleteTodo(t.id, '2026-05-17')
    expect(getTodosByDate('2026-05-17')).toHaveLength(0)
    // Verify no phantom empty array in storage
    expect(JSON.parse(localStorage.getItem('peel-todos') || '{}')['2026-05-17']).toBeUndefined()
  })

  it('completes a todo with timestamp', () => {
    const todo = addTodo('完成我', '2026-05-17')
    completeTodo(todo.id, '2026-05-17')
    const result = getTodosByDate('2026-05-17')[0]
    expect(result.status).toBe('done')
    expect(result.completedAt).toBeTypeOf('number')
  })

  it('saveTodosForDate replaces the entire list', () => {
    addTodo('A', '2026-05-17')
    addTodo('B', '2026-05-17')
    saveTodosForDate('2026-05-17', [])
    expect(getTodosByDate('2026-05-17')).toHaveLength(0)
  })
})
