'use client'

import { TodoList } from './TodoList'
import { TimeBlockList } from './TimeBlockList'
import { HeatmapHourly } from './HeatmapHourly'
import type { Todo, Record } from '@/domain/types'

interface Props {
  todos: Todo[]
  records: Record[]
  addTodo: (text: string, estimatedDuration?: number) => Todo
  updateTodo: (todo: Todo) => void
  deleteTodo: (id: string) => void
  updateRecord: (record: Record) => void
  reorderTodos: (todos: Todo[]) => void
  removeRecord: (id: string) => void
  reorderRecords: (records: Record[]) => void
  recentRecords: Record[]
}

export function TodayPage({
  todos,
  records,
  addTodo,
  updateTodo,
  deleteTodo,
  updateRecord,
  reorderTodos,
  removeRecord,
  reorderRecords,
  recentRecords,
}: Props) {
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
        <HeatmapHourly recentRecords={recentRecords} />
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
