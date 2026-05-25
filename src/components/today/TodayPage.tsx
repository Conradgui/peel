'use client'

import { TodoList } from './TodoList'
import { TimeBlockList } from './TimeBlockList'
import { HeatmapHourly } from './HeatmapHourly'

export function TodayPage() {
  return (
    <div className="today-page">
      <div className="today-col">
        <TodoList />
        <HeatmapHourly />
      </div>
      <TimeBlockList />
    </div>
  )
}
