'use client'

import { useState, useCallback, useEffect } from 'react'
import { addRecord, getRecordsByDate, getRecordsInRange, deleteRecord, updateRecord, saveRecordsForDate } from '@/storage/recordStorage'
import { formatDate, daysAgo } from '@/domain/time'
import type { Record } from '@/domain/types'

export function useRecords(date?: string) {
  // eslint-disable-next-line react-hooks/purity -- Date.now() is stable within a single render; used for default date
  const targetDate = date ?? formatDate(Date.now())
  const [records, setRecords] = useState<Record[]>([])

  const refresh = useCallback(() => {
    setRecords(getRecordsByDate(targetDate))
  }, [targetDate])

  /* eslint-disable react-hooks/set-state-in-effect -- hydration: reads localStorage on mount/date change */
  useEffect(() => {
    refresh()
  }, [refresh])
  /* eslint-enable react-hooks/set-state-in-effect */

  const add = useCallback((rec: Record) => {
    addRecord(rec)
    refresh()
  }, [refresh])

  const update = useCallback((rec: Record) => {
    updateRecord(rec)
    refresh()
  }, [refresh])

  const remove = useCallback((id: string) => {
    deleteRecord(id, targetDate)
    refresh()
  }, [targetDate, refresh])

  const reorderRecords = useCallback((items: Record[]) => {
    saveRecordsForDate(targetDate, items)
    refresh()
  }, [targetDate, refresh])

  const getRange = useCallback((start: string, end: string) => {
    return getRecordsInRange(start, end)
  }, [])

  const getLast7Days = useCallback(() => {
    const today = formatDate(Date.now())
    const weekAgo = daysAgo(6)
    return getRecordsInRange(weekAgo, today)
  }, [])

  return { records, add, update, remove, reorderRecords, refresh, getRange, getLast7Days }
}
