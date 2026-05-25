// Copy template pool — pick a random template from a category, interpolate data.
// No LLM API calls; all copy is pre-written.

import templates from '../../public/copy-templates.json'

type CopyContext = globalThis.Record<string, string | number>
type Category = keyof Omit<typeof templates, 'version'>

/**
 * Pick a template from the given category, avoiding recently used ones,
 * and interpolate the context data.
 */
export function pickCopy(
  category: Category,
  ctx: CopyContext = {},
  recentlyUsed: string[] = [],
): string {
  const pool = templates[category] as string[] | undefined
  if (!pool || pool.length === 0) return ''

  const available = pool.filter(t => !recentlyUsed.includes(t))
  const candidates = available.length > 0 ? available : pool
  const template = candidates[Math.floor(Math.random() * candidates.length)]
  return interpolate(template, ctx)
}

/**
 * Replace {key} placeholders with context values.
 */
function interpolate(template: string, ctx: CopyContext): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(ctx[key] ?? ''))
}

/**
 * Categorize a day by total recorded seconds.
 */
export function categorizeDay(
  totalSeconds: number,
): 'high_productivity_day' | 'stable_day' | 'low_productivity_day' {
  if (totalSeconds >= 4 * 3600) return 'high_productivity_day'
  if (totalSeconds >= 2 * 3600) return 'stable_day'
  return 'low_productivity_day'
}
