'use client'

import { TodoList } from './TodoList'
import { TimeBlockList } from './TimeBlockList'
import { HeatmapHourly } from './HeatmapHourly'
import { useTodos } from '@/hooks/useTodos'
import { useRecords } from '@/hooks/useRecords'

export function TodayPage() {
  const { todos, addTodo, updateTodo, deleteTodo, reorderTodos } = useTodos()
  const { records, update: updateRecord, remove: removeRecord, reorderRecords } = useRecords()

  return (
    <div className="today-page">
      <div className="today-col">
        <TodoList
          todos={todos}
          records={records}
          addTodo={addTodo}
          updateTodo={updateTodo}
          deleteTodo={deleteTodo}
          updateRecord={updateRecord}
          reorderTodos={reorderTodos}
        />
        <HeatmapHourly />
      </div>
      <TimeBlockList
        records={records}
        todos={todos}
        updateRecord={updateRecord}
        removeRecord={removeRecord}
        reorderRecords={reorderRecords}
      />
    </div>
  )
}
