'use client'

import { useState, useCallback, useEffect } from 'react'
import { addRecord, getRecordsByDate, getRecordsInRange, deleteRecord, updateRecord } from '@/storage/recordStorage'
import { formatDate, daysAgo } from '@/domain/time'
import type { Record } from '@/domain/types'

export function useRecords(date?: string) {
  const targetDate = date ?? formatDate(Date.now())
  const [records, setRecords] = useState<Record[]>([])

  const refresh = useCallback(() => {
    setRecords(getRecordsByDate(targetDate))
  }, [targetDate])

  useEffect(() => {
    refresh()
  }, [refresh])

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

  const getRange = useCallback((start: string, end: string) => {
    return getRecordsInRange(start, end)
  }, [])

  const getLast7Days = useCallback(() => {
    const today = formatDate(Date.now())
    const weekAgo = daysAgo(6)
    return getRecordsInRange(weekAgo, today)
  }, [])

  return { records, add, update, remove, refresh, getRange, getLast7Days }
}
