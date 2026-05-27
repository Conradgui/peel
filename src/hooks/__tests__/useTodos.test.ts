import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTodos } from '../useTodos'

beforeEach(() => localStorage.clear())

describe('useTodos', () => {
  it('loads empty todos by default', () => {
    const { result } = renderHook(() => useTodos('2026-05-17'))
    expect(result.current.todos).toEqual([])
  })

  it('adds a todo and refreshes', () => {
    const { result } = renderHook(() => useTodos('2026-05-17'))
    act(() => result.current.addTodo('写 PRD'))
    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0].text).toBe('写 PRD')
  })

  it('adds todo with estimated duration', () => {
    const { result } = renderHook(() => useTodos('2026-05-17'))
    act(() => result.current.addTodo('深度工作', 30))
    expect(result.current.todos[0].estimatedDuration).toBe(30)
  })

  it('updates a todo', () => {
    const { result } = renderHook(() => useTodos('2026-05-17'))
    act(() => result.current.addTodo('原始'))
    const todo = result.current.todos[0]
    act(() => result.current.updateTodo({ ...todo, text: '已修改' }))
    expect(result.current.todos[0].text).toBe('已修改')
  })

  it('deletes a todo', () => {
    const { result } = renderHook(() => useTodos('2026-05-17'))
    act(() => result.current.addTodo('要删的'))
    const id = result.current.todos[0].id
    act(() => result.current.deleteTodo(id))
    expect(result.current.todos).toHaveLength(0)
  })

  it('completes a todo', () => {
    const { result } = renderHook(() => useTodos('2026-05-17'))
    act(() => result.current.addTodo('完成我'))
    const id = result.current.todos[0].id
    act(() => result.current.completeTodo(id))
    expect(result.current.todos[0].status).toBe('done')
  })

  it('reorders todos', () => {
    const { result } = renderHook(() => useTodos('2026-05-17'))
    act(() => result.current.addTodo('A'))
    act(() => result.current.addTodo('B'))
    const [a, b] = result.current.todos
    act(() => result.current.reorderTodos([b, a]))
    expect(result.current.todos[0].text).toBe('B')
    expect(result.current.todos[1].text).toBe('A')
  })
})
