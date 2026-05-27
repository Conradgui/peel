// Schema C record storage — records keyed by date (YYYY-MM-DD).
// PRD § 5.4: write-on-change (immediate persistence).

import type { Record } from '@/domain/types'
import { formatDate } from '@/domain/time'

const KEY = 'peel-records'

type RecordsByDate = { [date: string]: Record[] }

function read(): RecordsByDate {
  if (typeof localStorage === 'undefined') return {}
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function write(data: RecordsByDate): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    // quota exceeded — silently fail to prevent app crash
  }
}

export function addRecord(rec: Record): void {
  const data = read()
  const date = formatDate(rec.startTime)
  if (!data[date]) data[date] = []
  data[date].push(rec)
  write(data)
}

export function getRecordsByDate(date: string): Record[] {
  return read()[date] ?? []
}

export function getRecordsInRange(start: string, end: string): Record[] {
  const data = read()
  return Object.entries(data)
    .filter(([d]) => d >= start && d <= end)
    .flatMap(([, recs]) => recs)
}

export function getAllRecords(): RecordsByDate {
  return read()
}

export function updateRecord(rec: Record): void {
  const data = read()
  const date = formatDate(rec.startTime)
  const idx = data[date]?.findIndex(r => r.id === rec.id) ?? -1
  if (idx >= 0) {
    data[date][idx] = { ...rec, updatedAt: Date.now() }
    write(data)
  }
}

export function deleteRecord(id: string, date: string): void {
  const data = read()
  if (data[date]) {
    data[date] = data[date].filter(r => r.id !== id)
    if (data[date].length === 0) delete data[date]
    write(data)
  }
}

export function saveRecordsForDate(date: string, recs: Record[]): void {
  const data = read()
  data[date] = recs
  write(data)
}
