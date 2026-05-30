// Schema for daily reflection storage — date keyed (YYYY-MM-DD) text strings.
// Keeps daily reflections separate from record arrays for clean normalization.

const KEY = 'peel-reflections'

type ReflectionsData = { [date: string]: string }

function read(): ReflectionsData {
  if (typeof localStorage === 'undefined') return {}
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function write(data: ReflectionsData): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    // quota exceeded — silently fail to prevent app crash
  }
}

export function getReflection(date: string): string {
  return read()[date] ?? ''
}

export function saveReflection(date: string, text: string): void {
  const data = read()
  if (text.trim() === '') {
    delete data[date]
  } else {
    data[date] = text.trim()
  }
  write(data)
}

export function deleteReflection(date: string): void {
  const data = read()
  delete data[date]
  write(data)
}

export function getAllReflections(): ReflectionsData {
  return read()
}
