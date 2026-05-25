// Peel planner domain logic
// Links records to todos and computes actual durations.

import type { Record } from './types'

/**
 * Compute total duration (in seconds) of all records linked to a specific todo.
 */
export function computeTodoDuration(records: Record[], todoId: string): number {
  return records
    .filter(r => r.linkedTodoId === todoId)
    .reduce((sum, r) => sum + r.duration, 0)
}

/**
 * Compute total duration (in seconds) across all records.
 */
export function computeTotalDuration(records: Record[]): number {
  return records.reduce((sum, r) => sum + r.duration, 0)
}

/**
 * Count records with a specific tag.
 */
export function countByTag(records: Record[], tag: 'pomodoro'): number {
  return records.filter(r => r.tag === tag).length
}
