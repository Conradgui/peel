'use client'

import { useState, useCallback, useEffect } from 'react'
import {
  addTodo as storageAddTodo,
  getTodosByDate,
  updateTodo as storageUpdateTodo,
  deleteTodo as storageDeleteTodo,
  completeTodo as storageCompleteTodo,
  saveTodosForDate,
} from '@/storage/todoStorage'
import { formatDate } from '@/domain/time'
import type { Todo } from '@/domain/types'

export function useTodos(date?: string) {
  // eslint-disable-next-line react-hooks/purity -- Date.now() is stable within a single render; used for default date
  const targetDate = date ?? formatDate(Date.now())
  const [todos, setTodos] = useState<Todo[]>([])

  const refresh = useCallback(() => {
    setTodos(getTodosByDate(targetDate))
  }, [targetDate])

  /* eslint-disable react-hooks/set-state-in-effect -- hydration: reads localStorage on mount/date change */
  useEffect(() => {
    refresh()
  }, [refresh])
  /* eslint-enable react-hooks/set-state-in-effect */

  const addTodo = useCallback((text: string, estimatedDuration?: number) => {
    const todo = storageAddTodo(text, targetDate, estimatedDuration)
    refresh()
    return todo
  }, [targetDate, refresh])

  const updateTodo = useCallback((todo: Todo) => {
    storageUpdateTodo(todo)
    refresh()
  }, [refresh])

  const deleteTodo = useCallback((id: string) => {
    storageDeleteTodo(id, targetDate)
    refresh()
  }, [targetDate, refresh])

  const completeTodo = useCallback((id: string) => {
    storageCompleteTodo(id, targetDate)
    refresh()
  }, [targetDate, refresh])

  const reorderTodos = useCallback((items: Todo[]) => {
    saveTodosForDate(targetDate, items)
    refresh()
  }, [targetDate, refresh])

  return { todos, addTodo, updateTodo, deleteTodo, completeTodo, reorderTodos, refresh }
}
