# Peel v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Peel v1 — a "record-first, plan-second" time management web app for efficiency-anxious students — from the approved PRD v0.1.0 + visual mockup.

**Architecture:** Next.js 16 App Router (SPA-style, no backend) + Tailwind CSS v4 + shadcn/ui + Vitest. localStorage Schema C for persistence (records/todos/settings keyed by date). React hooks for timer state machines. Self-contained on H5; no native build, no sync, no LLM API.

**Tech Stack:** Next.js 16 · TypeScript · Tailwind v4 · shadcn/ui · Vitest · pnpm. Inter + JetBrains Mono via next/font.

**Source documents:**
- PRD: `docs/PRD.md` (v0.1.0, commit `268e450`)
- Visual mockup: `docs/mockups/app.html` (3 pages + Pomodoro + orange rain)
- Phase 1 v1 archive: `~/Desktop/archive/AI学习/timer/` (Vue + UNIapp; reuse domain & tests only)

---

## File Structure

```
~/Desktop/peel/
├── docs/                         # already populated
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx           # root layout + fonts + body classes
│   │   ├── page.tsx             # main shell (segmented nav + view routing)
│   │   ├── globals.css          # design tokens + base styles
│   │   ├── settings/page.tsx    # settings page (orange rain / Pomodoro / export)
│   │   └── icon.svg             # favicon (peeled orange)
│   ├── components/
│   │   ├── shell/
│   │   │   ├── NavSegmented.tsx
│   │   │   └── ModeToggle.tsx
│   │   ├── now/
│   │   │   ├── NowPage.tsx
│   │   │   ├── TimerDisplay.tsx
│   │   │   ├── TaskInput.tsx
│   │   │   └── RestView.tsx
│   │   ├── today/
│   │   │   ├── TodayPage.tsx
│   │   │   ├── TodoList.tsx
│   │   │   ├── TodoDetailModal.tsx
│   │   │   ├── TimeBlockList.tsx
│   │   │   └── HeatmapHourly.tsx
│   │   ├── reflection/
│   │   │   ├── ReflectionPage.tsx
│   │   │   ├── DayView.tsx
│   │   │   ├── WeekView.tsx
│   │   │   └── DayMosaic.tsx
│   │   └── orange-rain/
│   │       └── OrangeRain.tsx
│   ├── domain/                  # framework-agnostic logic (Phase 1 reuse)
│   │   ├── types.ts             # Record, Todo, Settings (PRD § 5.2)
│   │   ├── time.ts              # formatDate, formatDuration, etc.
│   │   ├── timer.ts             # timer state machine (from Phase 1)
│   │   ├── planner.ts           # todo ↔ record linking (Phase 1)
│   │   ├── pomodoro.ts          # NEW: pomodoro state machine
│   │   ├── heatmap.ts           # NEW: 7-day hourly aggregation
│   │   ├── copy.ts              # NEW: template pool + interpolate
│   │   └── __tests__/
│   ├── storage/
│   │   ├── recordStorage.ts     # Schema C records by date
│   │   ├── todoStorage.ts       # Schema C todos by date
│   │   ├── settingsStorage.ts
│   │   ├── activeTimerStorage.ts
│   │   └── __tests__/
│   ├── hooks/
│   │   ├── useTimer.ts          # React rewrite of Phase 1 Vue composable
│   │   ├── useRecords.ts
│   │   ├── useTodos.ts
│   │   └── useSettings.ts
│   └── lib/
│       ├── design-tokens.ts     # PRD § 7 / Appendix A as TS constants
│       └── orange-rain.ts       # jittered grid algorithm
├── public/
│   └── copy-templates.json      # PRD Appendix C (30-50 templates)
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
├── next.config.ts
└── README.md (already in place)
```

---

## Phase A — Foundation (6 tasks · ~1 week)

### Task A1: Tech stack install (round 2 of 1/2/3/4)

**Files:**
- Create: `package.json` (via `create-next-app`)
- Create: `tsconfig.json`, `next.config.ts`, `.gitignore` (extends existing)
- Modify: `README.md` (add "Setup" section)

- [ ] **Step 1: Verify Conrad's 1/2/3/4 approval for tech stack install**

This is the second round of the 1/2/3/4 protocol promised in PRD § 10. Confirm with Conrad before running install commands. If approved, proceed.

- [ ] **Step 2: Initialize Next.js 16 project in current directory**

Run from `~/Desktop/peel/`:

```bash
pnpm dlx create-next-app@latest . \
  --typescript --tailwind --app --src-dir \
  --eslint --no-import-alias --use-pnpm
```

Expected: scaffolds Next.js 16 with TypeScript + Tailwind in the existing peel/ directory. Will prompt to overwrite README.md and .gitignore — answer **No** (we want to keep ours) or merge manually.

- [ ] **Step 3: Install runtime + dev dependencies**

```bash
pnpm add framer-motion
pnpm add -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom jsdom @types/node
```

- [ ] **Step 4: Initialize shadcn/ui**

```bash
pnpm dlx shadcn@latest init
```

When prompted, accept defaults except:
- Style: New York
- Base color: Neutral (we override in design-tokens)
- CSS variables: Yes

- [ ] **Step 5: Verify project boots**

```bash
pnpm dev
```

Expected: server on http://localhost:3000, default Next.js page loads.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(scaffold): Next.js 16 + Tailwind v4 + shadcn + Vitest"
```

---

### Task A2: Design tokens + Tailwind config

**Files:**
- Create: `src/lib/design-tokens.ts`
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Create design-tokens.ts with PRD § 7 values**

```ts
// src/lib/design-tokens.ts
export const colors = {
  peel: {
    'orange-light': '#FED7AA',
    orange:         '#FB923C',
    'orange-deep':  '#EA580C',
  },
  cream: {
    white: '#FAFAF7',
    off:   '#F5F5F0',
  },
  text: {
    primary:   '#1F1F1B',
    secondary: '#52524D',
    tertiary:  '#A3A3A0',
  },
  border: {
    DEFAULT: '#E5E5DF',
    subtle:  '#F0F0EB',
  },
  mode: {
    pomodoro: '#FEF3E7',
    rest:     '#E8F5F0',
  },
} as const

export const fontSize = {
  display:  ['80px', { lineHeight: '1.0',  fontWeight: '600' }],
  h1:       ['32px', { lineHeight: '1.2',  fontWeight: '600' }],
  h2:       ['24px', { lineHeight: '1.3',  fontWeight: '600' }],
  'body-lg':['18px', { lineHeight: '1.5',  fontWeight: '500' }],
  body:     ['16px', { lineHeight: '1.5',  fontWeight: '400' }],
  'body-sm':['14px', { lineHeight: '1.5',  fontWeight: '400' }],
  caption:  ['13px', { lineHeight: '1.4',  fontWeight: '400' }],
  footnote: ['12px', { lineHeight: '1.4',  fontWeight: '400' }],
} as const

export const motion = {
  ease: { natural: 'cubic-bezier(0.32, 0.72, 0, 1)' },
  spring: {
    default: { damping: 25, stiffness: 200 },
    bouncy:  { damping: 15, stiffness: 150 },
    slow:    { damping: 30, stiffness: 100 },
  },
  duration: {
    quick: 150,
    standard: 300,
    page: 500,
    rainDrop: 4500,
    rainTotal: 7500,
    pomodoroFade: 200,
    restFade: 2000,
  },
} as const
```

- [ ] **Step 2: Wire tokens into tailwind.config.ts**

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'
import { colors, fontSize } from './src/lib/design-tokens'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors,
      fontSize,
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
} satisfies Config
```

- [ ] **Step 3: Add base styles + CSS variables to globals.css**

```css
/* src/app/globals.css */
@import "tailwindcss";

:root {
  --ease-natural: cubic-bezier(0.32, 0.72, 0, 1);
  --shadow-subtle: 0 1px 2px rgba(0,0,0,0.04);
  --shadow-soft: 0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-lifted: 0 4px 16px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.05);
}

html, body {
  height: 100vh;
  overflow: hidden; /* viewport-as-page hard constraint */
}

body {
  background: theme('colors.cream.white');
  color: theme('colors.text.primary');
  font-family: theme('fontFamily.sans');
  -webkit-font-smoothing: antialiased;
  letter-spacing: -0.005em;
}
```

- [ ] **Step 4: Set up next/font in layout.tsx**

```tsx
// src/app/layout.tsx
import { Inter, JetBrains_Mono } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 5: Verify with a sanity page**

Edit `src/app/page.tsx` to use Peel orange:

```tsx
export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-h1 text-peel-orange-deep">Peel</h1>
      <p className="text-body text-text-secondary">Tokens wired.</p>
    </main>
  )
}
```

Run `pnpm dev` → confirm orange `#EA580C` heading + cream background.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(tokens): wire PRD § 7 design tokens into Tailwind + globals"
```

---

### Task A3: Vitest setup

**Files:**
- Create: `vitest.config.ts`
- Create: `src/setupTests.ts`
- Modify: `package.json` (add scripts)

- [ ] **Step 1: Create vitest.config.ts**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    globals: true,
  },
})
```

- [ ] **Step 2: Setup file for jest-dom matchers**

```ts
// src/setupTests.ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 3: Add scripts to package.json**

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "vitest",
  "test:run": "vitest run",
  "test:ui": "vitest --ui"
}
```

- [ ] **Step 4: Write a smoke test**

```ts
// src/lib/__tests__/sanity.test.ts
import { describe, it, expect } from 'vitest'

describe('sanity', () => {
  it('environment loads', () => {
    expect(1 + 1).toBe(2)
  })
})
```

- [ ] **Step 5: Run tests**

```bash
pnpm test:run
```

Expected: 1 test passes.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(test): Vitest + Testing Library + jsdom"
```

---

### Task A4: Migrate domain types + time utils from Phase 1

**Files:**
- Create: `src/domain/types.ts` (from PRD § 5.2)
- Create: `src/domain/time.ts` (from Phase 1 archive)
- Create: `src/domain/__tests__/time.test.ts`

- [ ] **Step 1: Write types.ts matching PRD § 5.2**

```ts
// src/domain/types.ts
export interface Record {
  id: string
  label: string
  startTime: number   // timestamp ms
  endTime: number
  duration: number    // seconds, = (endTime - startTime) / 1000
  tag?: 'pomodoro' | null
  linkedTodoId?: string | null
  notes?: string
  createdAt: number
  updatedAt: number
}

export interface Todo {
  id: string
  text: string
  status: 'pending' | 'in_progress' | 'done'
  estimatedDuration?: number  // minutes
  date: string                // 'YYYY-MM-DD'
  createdAt: number
  completedAt?: number
}

export interface Settings {
  orangeRainInterval: 15 | 30 | 45 | 60 | 'off'
  orangeRainSound: boolean
  pomodoroWork: number
  pomodoroBreak: number
  pomodoroCycleCount: number
}

export const DEFAULT_SETTINGS: Settings = {
  orangeRainInterval: 30,
  orangeRainSound: false,
  pomodoroWork: 25,
  pomodoroBreak: 5,
  pomodoroCycleCount: 4,
}
```

- [ ] **Step 2: Write failing test for formatDate (local timezone)**

```ts
// src/domain/__tests__/time.test.ts
import { describe, it, expect } from 'vitest'
import { formatDate, formatDuration } from '../time'

describe('formatDate', () => {
  it('formats a timestamp to YYYY-MM-DD in local tz', () => {
    // 2026-05-17 10:30:00 local time
    const ts = new Date(2026, 4, 17, 10, 30, 0).getTime()
    expect(formatDate(ts)).toBe('2026-05-17')
  })

  it('groups cross-midnight record under startTime day (PRD § 5.5)', () => {
    // 2026-05-17 23:55:00 local
    const ts = new Date(2026, 4, 17, 23, 55, 0).getTime()
    expect(formatDate(ts)).toBe('2026-05-17')
  })
})

describe('formatDuration', () => {
  it('formats seconds to "Xh Ym"', () => {
    expect(formatDuration(3720)).toBe('1h 2m')
    expect(formatDuration(45)).toBe('45s')
  })
})
```

- [ ] **Step 3: Run test → expect fail**

```bash
pnpm test:run
```

Expected: 2-3 fails ("formatDate is not defined").

- [ ] **Step 4: Implement time.ts**

```ts
// src/domain/time.ts
export function formatDate(timestamp: number): string {
  const d = new Date(timestamp)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export function formatTimerDisplay(seconds: number): string {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0')
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${h}:${m}:${s}`
}
```

- [ ] **Step 5: Run test → expect pass**

```bash
pnpm test:run
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(domain): types + time utils (Phase 1 reuse + PRD § 5 update)"
```

---

### Task A5: Migrate Phase 1 domain logic (timer + planner)

**Files:**
- Create: `src/domain/timer.ts` (port from `~/Desktop/archive/AI学习/timer/src/domain/timer.ts`)
- Create: `src/domain/planner.ts` (port from Phase 1)
- Create: `src/domain/__tests__/timer.test.ts` (port from Phase 1)
- Create: `src/domain/__tests__/planner.test.ts` (port from Phase 1)

- [ ] **Step 1: Copy source files from Phase 1 archive**

```bash
cp ~/Desktop/archive/AI学习/timer/src/domain/timer.ts src/domain/timer.ts
cp ~/Desktop/archive/AI学习/timer/src/domain/planner.ts src/domain/planner.ts
cp ~/Desktop/archive/AI学习/timer/src/domain/__tests__/timer.test.ts src/domain/__tests__/timer.test.ts
cp ~/Desktop/archive/AI学习/timer/src/domain/__tests__/planner.test.ts src/domain/__tests__/planner.test.ts
```

- [ ] **Step 2: Update imports to match new types.ts**

Open each copied file. Any `import { TimingBlock } from './types'` (Phase 1 naming) may need to be renamed to `Record`. Use grep:

```bash
grep -rn "TimingBlock\|TimeBlock" src/domain/
```

For each match, decide: keep Phase 1 name as alias, or rename to match PRD. PRD uses `Record`. Add type alias for migration:

```ts
// src/domain/types.ts (append)
export type TimingBlock = Record  // Phase 1 compatibility alias
```

- [ ] **Step 3: Run migrated tests**

```bash
pnpm test:run
```

Expected: tests pass. If they fail, debug — Phase 1 tests are the source of truth for behavior.

- [ ] **Step 4: Add Record.linkedTodoId test (new field per PRD § 5.3)**

```ts
// src/domain/__tests__/planner.test.ts (append)
it('links a new record to a todo via linkedTodoId', () => {
  const todo: Todo = { /* ... */ }
  const rec = createRecord({ label: 'work', linkedTodoId: todo.id })
  expect(rec.linkedTodoId).toBe(todo.id)
})

it('computes todo actual duration from records', () => {
  const todoId = 't1'
  const recs: Record[] = [
    { /* ... */ linkedTodoId: todoId, duration: 1200 },
    { /* ... */ linkedTodoId: todoId, duration: 800 },
    { /* ... */ linkedTodoId: 'other',  duration: 500 },
  ]
  expect(computeTodoDuration(recs, todoId)).toBe(2000)
})
```

- [ ] **Step 5: Implement / extend planner.ts to make new tests pass**

```ts
// src/domain/planner.ts (append)
export function computeTodoDuration(records: Record[], todoId: string): number {
  return records
    .filter(r => r.linkedTodoId === todoId)
    .reduce((sum, r) => sum + r.duration, 0)
}
```

- [ ] **Step 6: Run all tests + commit**

```bash
pnpm test:run
git add -A
git commit -m "feat(domain): port Phase 1 timer + planner; add linkedTodoId support"
```

---

### Task A6: Migrate Phase 1 storage (adapt for Next.js)

**Files:**
- Create: `src/storage/activeTimerStorage.ts` (port from Phase 1, adapt for browser-only)
- Create: `src/storage/__tests__/activeTimerStorage.test.ts`

- [ ] **Step 1: Copy storage from Phase 1**

```bash
cp ~/Desktop/archive/AI学习/timer/src/storage/activeTimerStorage.ts src/storage/activeTimerStorage.ts
cp ~/Desktop/archive/AI学习/timer/src/storage/__tests__/activeTimerStorage.test.ts src/storage/__tests__/activeTimerStorage.test.ts
```

- [ ] **Step 2: Wrap localStorage access in `typeof window !== 'undefined'` guards for SSR safety**

Open `activeTimerStorage.ts`. Any direct `localStorage.X` access must check:

```ts
function isClient() {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined'
}

export function getActiveTimer(): ActiveTimer | null {
  if (!isClient()) return null
  const raw = localStorage.getItem('peel-active-timer')
  return raw ? JSON.parse(raw) : null
}
```

- [ ] **Step 3: Run tests in jsdom (window exists)**

```bash
pnpm test:run
```

Expected: tests pass (jsdom provides window/localStorage).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(storage): port Phase 1 activeTimerStorage; add SSR safety guards"
```

---

## Phase B — Core Domain (5 tasks · ~1 week)

### Task B1: Schema C storage layer (records + todos + settings)

**Files:**
- Create: `src/storage/recordStorage.ts`
- Create: `src/storage/todoStorage.ts`
- Create: `src/storage/settingsStorage.ts`
- Create: `src/storage/__tests__/recordStorage.test.ts`

- [ ] **Step 1: Write failing test for recordStorage**

```ts
// src/storage/__tests__/recordStorage.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { addRecord, getRecordsByDate, getRecordsInRange } from '../recordStorage'

beforeEach(() => localStorage.clear())

describe('recordStorage', () => {
  it('stores a record keyed by its startTime date', () => {
    const rec = {
      id: 'r1', label: 'coding',
      startTime: new Date(2026, 4, 17, 9, 30).getTime(),
      endTime:   new Date(2026, 4, 17, 10, 30).getTime(),
      duration: 3600, createdAt: 0, updatedAt: 0,
    }
    addRecord(rec)
    expect(getRecordsByDate('2026-05-17')).toHaveLength(1)
  })

  it('groups cross-midnight record by startTime, not endTime', () => {
    const rec = {
      id: 'r2', label: 'late work',
      startTime: new Date(2026, 4, 17, 23, 55).getTime(),
      endTime:   new Date(2026, 4, 18, 0, 30).getTime(),
      duration: 2100, createdAt: 0, updatedAt: 0,
    }
    addRecord(rec)
    expect(getRecordsByDate('2026-05-17')).toHaveLength(1)
    expect(getRecordsByDate('2026-05-18')).toHaveLength(0)
  })

  it('range query returns records in inclusive date range', () => {
    // populate 7 days, query 5-day range
    // ...
  })
})
```

- [ ] **Step 2: Run test → expect fail**

```bash
pnpm test:run -- recordStorage
```

- [ ] **Step 3: Implement recordStorage.ts**

```ts
// src/storage/recordStorage.ts
import type { Record } from '@/domain/types'
import { formatDate } from '@/domain/time'

const KEY = 'peel-records'

type RecordsByDate = { [date: string]: Record[] }

function read(): RecordsByDate {
  if (typeof localStorage === 'undefined') return {}
  const raw = localStorage.getItem(KEY)
  return raw ? JSON.parse(raw) : {}
}

function write(data: RecordsByDate): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(data))
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
    write(data)
  }
}
```

- [ ] **Step 4: Apply same pattern for todoStorage.ts**

(Same shape, different key `peel-todos`, key by `todo.date` not derived from timestamp.)

- [ ] **Step 5: Apply same pattern for settingsStorage.ts**

(Single object, no date keys, key `peel-settings`. Merge with DEFAULT_SETTINGS on read.)

- [ ] **Step 6: Run all storage tests + commit**

```bash
pnpm test:run -- storage
git add -A
git commit -m "feat(storage): Schema C — records/todos/settings keyed by date"
```

---

### Task B2: Pomodoro state machine

**Files:**
- Create: `src/domain/pomodoro.ts`
- Create: `src/domain/__tests__/pomodoro.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
import { describe, it, expect } from 'vitest'
import { createPomodoroSession, tick, type PomodoroState } from '../pomodoro'

describe('pomodoro', () => {
  it('starts in "work" with full work duration', () => {
    const s = createPomodoroSession({ workMin: 25, breakMin: 5 })
    expect(s.phase).toBe('work')
    expect(s.remaining).toBe(25 * 60)
  })

  it('transitions to "break" when work timer hits 0', () => {
    let s = createPomodoroSession({ workMin: 25, breakMin: 5 })
    for (let i = 0; i < 25 * 60; i++) s = tick(s)
    expect(s.phase).toBe('break')
    expect(s.remaining).toBe(5 * 60)
  })

  it('transitions to "done" when break timer hits 0', () => {
    // ...
  })

  it('emits "createRecord" event on work-phase end (tag=pomodoro)', () => {
    // verify the side-effect signal
  })
})
```

- [ ] **Step 2: Run → fail**

- [ ] **Step 3: Implement pomodoro.ts**

```ts
export type PomodoroPhase = 'work' | 'break' | 'done'

export interface PomodoroState {
  phase: PomodoroPhase
  remaining: number  // seconds
  workMin: number
  breakMin: number
  shouldCreateRecord: boolean  // signal flag for orchestrator
}

export function createPomodoroSession(opts: { workMin: number; breakMin: number }): PomodoroState {
  return {
    phase: 'work',
    remaining: opts.workMin * 60,
    workMin: opts.workMin,
    breakMin: opts.breakMin,
    shouldCreateRecord: false,
  }
}

export function tick(s: PomodoroState): PomodoroState {
  if (s.phase === 'done') return s
  const remaining = s.remaining - 1
  if (remaining > 0) return { ...s, remaining, shouldCreateRecord: false }
  // phase transition
  if (s.phase === 'work') {
    return { ...s, phase: 'break', remaining: s.breakMin * 60, shouldCreateRecord: true }
  }
  return { ...s, phase: 'done', remaining: 0, shouldCreateRecord: false }
}

export function skipBreak(s: PomodoroState): PomodoroState {
  if (s.phase !== 'break') return s
  return { ...s, phase: 'done', remaining: 0 }
}
```

- [ ] **Step 4: Run tests → pass**

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(domain): pomodoro state machine — work/break/done phases"
```

---

### Task B3: Heatmap aggregation (C view "early morning suggestion")

**Files:**
- Create: `src/domain/heatmap.ts`
- Create: `src/domain/__tests__/heatmap.test.ts`

- [ ] **Step 1: Write failing test**

```ts
import { describe, it, expect } from 'vitest'
import { computeHourlyHeatmap } from '../heatmap'
import type { Record } from '../types'

describe('heatmap', () => {
  it('aggregates record durations into 24 hourly buckets', () => {
    const recs: Record[] = [
      { /* 9:00-10:00, 3600s */ },
      { /* 9:30-10:30, 3600s */ },  // spans 9 and 10
      { /* 14:00-15:00, 3600s */ },
    ]
    const heatmap = computeHourlyHeatmap(recs)
    expect(heatmap).toHaveLength(24)
    expect(heatmap[9]).toBeGreaterThan(heatmap[14])  // 9 hour has more time
    expect(heatmap[0]).toBe(0)  // midnight is empty
  })

  it('handles records spanning multiple hours by splitting duration', () => {
    // record 9:00-11:00 (2h) should add 3600s to hour[9] and hour[10]
  })
})
```

- [ ] **Step 2: Run → fail**

- [ ] **Step 3: Implement heatmap.ts**

```ts
import type { Record } from './types'

export function computeHourlyHeatmap(records: Record[]): number[] {
  const buckets = new Array(24).fill(0)
  for (const r of records) {
    let cursor = r.startTime
    const end = r.endTime
    while (cursor < end) {
      const hour = new Date(cursor).getHours()
      const nextHour = new Date(cursor).setHours(hour + 1, 0, 0, 0)
      const sliceEnd = Math.min(nextHour, end)
      buckets[hour] += (sliceEnd - cursor) / 1000
      cursor = sliceEnd
    }
  }
  return buckets
}

export function findPeakHours(heatmap: number[], topN: number = 3): number[] {
  return heatmap
    .map((sec, hour) => ({ sec, hour }))
    .sort((a, b) => b.sec - a.sec)
    .slice(0, topN)
    .map(x => x.hour)
    .sort((a, b) => a - b)
}
```

- [ ] **Step 4: Run → pass**

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(domain): hourly heatmap aggregation for C view morning suggestion"
```

---

### Task B4: Copy template pool

**Files:**
- Create: `public/copy-templates.json` (per PRD Appendix C, expand to 30-50 templates)
- Create: `src/domain/copy.ts`
- Create: `src/domain/__tests__/copy.test.ts`

- [ ] **Step 1: Write template JSON file**

Use the skeleton from PRD Appendix C; expand each category to 5-10 templates. Example for `high_productivity_day`:

```json
{
  "version": "v0.1.0",
  "high_productivity_day": [
    "今天 {hours}h {minutes}min，是个好日子。",
    "{date} 的你 {hours}h {minutes}min。",
    "今天有 {block_count} 个时间块被认真度过 ✦",
    "{hours}h {minutes}min。{block_count} 块拼图。",
    "今天 {block_count} 块时间，{hours}h {minutes}min。"
  ],
  "stable_day": [/* 5-10 templates */],
  "low_productivity_day": [/* 5-10 templates */],
  "first_day": [/* 3-5 */],
  "streak_soft_mention": [/* 3-5 */],
  "pomodoro_completed": [/* 5 */],
  "orange_rain_triggered": [/* 5 */]
}
```

- [ ] **Step 2: Write failing test for pickAndInterpolate**

```ts
describe('copy', () => {
  it('picks a template from the right category and interpolates data', () => {
    const ctx = { hours: 4, minutes: 12, block_count: 6, date: '5月17日' }
    const result = pickCopy('high_productivity_day', ctx, /* seen */ [])
    expect(result).toMatch(/4h 12min|4 12|6 块/)
  })

  it('does not re-pick the same template on consecutive days', () => {
    const seen = ['今天 {hours}h {minutes}min，是个好日子。']
    const result = pickCopy('high_productivity_day', {}, seen)
    expect(seen).not.toContain(result)
  })
})
```

- [ ] **Step 3: Implement copy.ts**

```ts
import templates from '../../public/copy-templates.json'

type CopyContext = Record<string, string | number>
type Category = keyof typeof templates

export function pickCopy(category: Category, ctx: CopyContext, recentlyUsed: string[] = []): string {
  const pool = (templates as any)[category] as string[]
  const available = pool.filter(t => !recentlyUsed.includes(t))
  const candidates = available.length > 0 ? available : pool
  const template = candidates[Math.floor(Math.random() * candidates.length)]
  return interpolate(template, ctx)
}

function interpolate(template: string, ctx: CopyContext): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(ctx[key] ?? ''))
}
```

- [ ] **Step 4: Run tests + commit**

```bash
pnpm test:run -- copy
git add -A
git commit -m "feat(domain): copy template pool — pick + interpolate, no LLM"
```

---

### Task B5: React hooks layer (Phase 1 composable rewrite)

**Files:**
- Create: `src/hooks/useTimer.ts` (rewrite of Phase 1 Vue composable as React hook)
- Create: `src/hooks/useRecords.ts`
- Create: `src/hooks/useTodos.ts`
- Create: `src/hooks/useSettings.ts`

- [ ] **Step 1: useTimer hook — timestamp-based, cross-refresh safe**

```ts
// src/hooks/useTimer.ts
import { useEffect, useState, useCallback } from 'react'
import { getActiveTimer, setActiveTimer, clearActiveTimer } from '@/storage/activeTimerStorage'

export interface TimerState {
  isRunning: boolean
  isPaused: boolean
  elapsedSeconds: number
  label: string
  linkedTodoId: string | null
}

export function useTimer() {
  const [state, setState] = useState<TimerState>(() => loadInitialState())

  useEffect(() => {
    if (!state.isRunning || state.isPaused) return
    const interval = setInterval(() => {
      setState(s => ({ ...s, elapsedSeconds: computeElapsed() }))
    }, 250)
    return () => clearInterval(interval)
  }, [state.isRunning, state.isPaused])

  const start = useCallback((label: string, linkedTodoId: string | null = null) => {
    const now = Date.now()
    setActiveTimer({ startTime: now, pausedAt: null, label, linkedTodoId })
    setState({ isRunning: true, isPaused: false, elapsedSeconds: 0, label, linkedTodoId })
  }, [])

  const pause = useCallback(() => { /* ... */ }, [])
  const resume = useCallback(() => { /* ... */ }, [])
  const stop = useCallback(() => { /* returns a Record to be persisted */ }, [])

  return { state, start, pause, resume, stop }
}

function loadInitialState(): TimerState { /* read activeTimerStorage */ }
function computeElapsed(): number { /* (Date.now() - startTime) / 1000 - pauseDuration */ }
```

- [ ] **Step 2: useRecords / useTodos / useSettings — thin wrappers around storage**

Each hook reads from storage on mount, exposes CRUD methods that write through immediately (write-on-change per PRD § 5.4).

- [ ] **Step 3: Write integration tests with @testing-library/react renderHook**

```ts
import { renderHook, act } from '@testing-library/react'
import { useTimer } from '../useTimer'

it('starts a timer and elapsedSeconds increments', async () => {
  const { result } = renderHook(() => useTimer())
  act(() => result.current.start('test', null))
  expect(result.current.state.isRunning).toBe(true)
  // advance time with vi.useFakeTimers
})
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(hooks): React hooks layer (Phase 1 composable rewrite)"
```

---

## Phase C — UI Layer (8 tasks · ~2 weeks)

### Task C1: App shell — segmented nav + view routing

**Files:**
- Modify: `src/app/page.tsx` (becomes the app shell)
- Create: `src/components/shell/NavSegmented.tsx`
- Create: `src/components/shell/ModeToggle.tsx`

- [ ] **Step 1: Translate the mockup app.html app shell into JSX**

Read `docs/mockups/app.html` lines 800-900 (header section). Recreate as `page.tsx`:

```tsx
'use client'
import { useState } from 'react'
import { NavSegmented } from '@/components/shell/NavSegmented'
import { ModeToggle } from '@/components/shell/ModeToggle'
import { NowPage } from '@/components/now/NowPage'
import { TodayPage } from '@/components/today/TodayPage'
import { ReflectionPage } from '@/components/reflection/ReflectionPage'

export default function App() {
  const [view, setView] = useState<'now' | 'today' | 'reflection'>('now')
  const [isPomodoro, setIsPomodoro] = useState(false)

  return (
    <div className={`app ${isPomodoro ? 'pomodoro-mode' : ''}`}>
      <header className="grid grid-cols-[1fr_auto_1fr] items-center mb-14">
        <div className="brand font-mono text-sm">peel<span className="text-peel-orange">.</span></div>
        <NavSegmented value={view} onChange={setView} />
        {view === 'now' && <ModeToggle value={isPomodoro} onChange={setIsPomodoro} />}
      </header>
      <main className="flex-1">
        {view === 'now' && <NowPage isPomodoro={isPomodoro} />}
        {view === 'today' && <TodayPage />}
        {view === 'reflection' && <ReflectionPage />}
      </main>
    </div>
  )
}
```

- [ ] **Step 2: NavSegmented component**

```tsx
// src/components/shell/NavSegmented.tsx
interface Props {
  value: 'now' | 'today' | 'reflection'
  onChange: (v: 'now' | 'today' | 'reflection') => void
}
export function NavSegmented({ value, onChange }: Props) {
  // 3 buttons, .active class on current, mockup styles
}
```

- [ ] **Step 3: ModeToggle component (Normal ↔ Pomodoro switch)**

```tsx
// src/components/shell/ModeToggle.tsx
interface Props { value: boolean; onChange: (v: boolean) => void }
export function ModeToggle({ value, onChange }: Props) {
  // matches mockup .toggle-switch with spring animation
}
```

- [ ] **Step 4: Move all `.app`, `.nav-segmented`, `.toggle-switch` styles from mockup CSS to globals.css**

- [ ] **Step 5: Smoke test — load page, switch tabs, toggle Pomodoro**

```bash
pnpm dev  # http://localhost:3000
```

Verify: tabs switch, ModeToggle only visible on Now, body color shifts to pomodoro-tint when toggled.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(ui): app shell — segmented nav + Pomodoro toggle"
```

---

### Task C2: Now page — TimerDisplay + persistence

**Files:**
- Create: `src/components/now/NowPage.tsx`
- Create: `src/components/now/TimerDisplay.tsx`

- [ ] **Step 1: TimerDisplay component**

```tsx
// src/components/now/TimerDisplay.tsx
import { formatTimerDisplay } from '@/domain/time'

interface Props { elapsedSeconds: number; isCountdown?: boolean; target?: number }
export function TimerDisplay({ elapsedSeconds, isCountdown, target }: Props) {
  const displaySeconds = isCountdown && target ? target - elapsedSeconds : elapsedSeconds
  return (
    <div className="font-mono text-display font-semibold tabular-nums tracking-tight">
      {formatTimerDisplay(displaySeconds)}
    </div>
  )
}
```

- [ ] **Step 2: NowPage skeleton (Normal mode only first)**

```tsx
// src/components/now/NowPage.tsx
'use client'
import { useTimer } from '@/hooks/useTimer'
import { TimerDisplay } from './TimerDisplay'

export function NowPage({ isPomodoro }: { isPomodoro: boolean }) {
  const { state, start, pause, resume, stop } = useTimer()
  return (
    <div className="now-page">
      <div className="task-name">{state.label || '你正在做什么？'}</div>
      <TimerDisplay elapsedSeconds={state.elapsedSeconds} />
      <div className="timer-controls">
        {!state.isRunning && <button onClick={() => start('test', null)}>开始</button>}
        {state.isRunning && !state.isPaused && <button onClick={pause}>⏸ 暂停</button>}
        {state.isPaused && <button onClick={resume}>继续</button>}
        {state.isRunning && <button onClick={stop} className="primary">⏹ 结束</button>}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Test cross-refresh persistence manually**

Start a timer, refresh the page, verify timer resumes with correct elapsed.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(ui): Now page — TimerDisplay + start/pause/stop"
```

---

### Task C3: Now page — TaskInput with todo selector

**Files:**
- Create: `src/components/now/TaskInput.tsx`

- [ ] **Step 1: TaskInput component with dropdown of today's pending todos**

```tsx
'use client'
import { useState } from 'react'
import { useTodos } from '@/hooks/useTodos'
import { formatDate } from '@/domain/time'

export function TaskInput({ onSelect }: { onSelect: (label: string, todoId: string | null) => void }) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const { todos } = useTodos()
  const today = formatDate(Date.now())
  const todaysTodos = todos.filter(t => t.date === today && t.status !== 'done')

  return (
    <div className="task-input-wrapper">
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        placeholder="你正在做什么？"
      />
      {open && (
        <ul className="todo-dropdown">
          {todaysTodos.map(t => (
            <li key={t.id} onClick={() => { onSelect(t.text, t.id); setOpen(false) }}>
              ○ {t.text}
            </li>
          ))}
          <li className="divider">─────</li>
          <li className="new" onClick={() => { onSelect(text, null); setOpen(false) }}>
            或者打一个新任务...
          </li>
        </ul>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Wire TaskInput into NowPage for未开始计时态**

- [ ] **Step 3: Smoke test — select a todo → start → record gets linkedTodoId**

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(ui): TaskInput with today's todo selector"
```

---

### Task C4: Now page — Pomodoro mode + RestView fade

**Files:**
- Create: `src/components/now/RestView.tsx`
- Modify: `src/components/now/NowPage.tsx`

- [ ] **Step 1: RestView component (薄荷绿底色，倒计时，跳过/继续)**

```tsx
'use client'
import { TimerDisplay } from './TimerDisplay'
export function RestView({ remaining, onSkip, onContinue }: {
  remaining: number; onSkip: () => void; onContinue: () => void
}) {
  return (
    <div className="rest-view">
      <h2>休息中 ☕</h2>
      <TimerDisplay elapsedSeconds={5 * 60 - remaining} isCountdown target={5 * 60} />
      <div>
        <button onClick={onSkip}>跳过休息</button>
        <button onClick={onContinue}>继续工作</button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Integrate pomodoro state machine in NowPage**

```tsx
// NowPage.tsx — add Pomodoro orchestration
import { createPomodoroSession, tick, skipBreak } from '@/domain/pomodoro'

// when isPomodoro flips on, start a session
// on tick, advance state
// when shouldCreateRecord fires, addRecord({tag: 'pomodoro'}) + trigger orange rain
// when phase becomes 'break', swap to RestView (with fade-in via Framer Motion)
```

- [ ] **Step 3: Wire Framer Motion fade for work → break transition**

```tsx
import { AnimatePresence, motion } from 'framer-motion'

<AnimatePresence mode="wait">
  {phase === 'work' && <motion.div key="work" animate={{ opacity: 1 }} exit={{ opacity: 0 }}>...</motion.div>}
  {phase === 'break' && <RestView ... />}
</AnimatePresence>
```

- [ ] **Step 4: Toggle the `rest-mode` body class for薄荷绿底色 during break**

- [ ] **Step 5: Manual test — start Pomodoro, fast-forward to 0:00, verify auto break transition + orange rain trigger**

(For dev convenience, allow URL `?pomodoro-dev=10s` to set work duration to 10s.)

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(ui): Now page Pomodoro mode + RestView fade transition"
```

---

### Task C5: Today page — TodoList + TodoDetailModal

**Files:**
- Create: `src/components/today/TodayPage.tsx`
- Create: `src/components/today/TodoList.tsx`
- Create: `src/components/today/TodoDetailModal.tsx`

- [ ] **Step 1: TodoList rendering today's todos + [+ 加任务] inline form**

Read mockup lines 850-920 for visual structure. Translate to JSX:

```tsx
'use client'
import { useTodos } from '@/hooks/useTodos'
import { useRecords } from '@/hooks/useRecords'
import { computeTodoDuration } from '@/domain/planner'
import { formatDate, formatDuration } from '@/domain/time'

export function TodoList() {
  const { todos, addTodo, updateTodo } = useTodos()
  const { records } = useRecords()
  const today = formatDate(Date.now())
  const todaysTodos = todos.filter(t => t.date === today)
  // render each as <TodoItem> with checkbox + text + meta + click → open modal
}
```

- [ ] **Step 2: TodoDetailModal — edit text / mark done / delete / unlink**

```tsx
import * as Dialog from '@radix-ui/react-dialog'  // shadcn provides this
// or use shadcn Dialog primitive

export function TodoDetailModal({ todo, open, onClose, onUpdate, onDelete }: Props) {
  // form with text input, status buttons, delete confirm
}
```

- [ ] **Step 3: Wire click handlers from TodoList → open Modal with selected todo**

- [ ] **Step 4: Verify todo.actualDuration display from `computeTodoDuration(records, todo.id)`**

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(ui): Today page — TodoList + TodoDetailModal"
```

---

### Task C6: Today page — TimeBlockList + HeatmapHourly

**Files:**
- Create: `src/components/today/TimeBlockList.tsx`
- Create: `src/components/today/HeatmapHourly.tsx`
- Modify: `src/components/today/TodayPage.tsx` (compose left/right grid)

- [ ] **Step 1: TimeBlockList — render today's records as cards (mockup lines 925-985)**

```tsx
import { useRecords } from '@/hooks/useRecords'
import { formatDate, formatDuration } from '@/domain/time'

export function TimeBlockList() {
  const { records } = useRecords()
  const today = formatDate(Date.now())
  const todaysRecords = records.filter(r => formatDate(r.startTime) === today)
  // render each card: name + duration + time range, .pomodoro class if tag
}
```

- [ ] **Step 2: HeatmapHourly — 24 bars colored by activity, peaks in deep orange**

```tsx
import { computeHourlyHeatmap, findPeakHours } from '@/domain/heatmap'
import { useRecords } from '@/hooks/useRecords'

export function HeatmapHourly() {
  const { records } = useRecords()
  // get last 7 days records
  const heatmap = computeHourlyHeatmap(recent7Days)
  const peaks = findPeakHours(heatmap, 3)
  const max = Math.max(...heatmap)
  return (
    <div>
      <p>过去 7 天，高效时段集中在 <strong>{peaks[0]}-{peaks[peaks.length-1]+1} 点</strong></p>
      <div className="heatmap-bars">
        {heatmap.map((sec, hour) => (
          <div
            key={hour}
            className={`heatmap-bar ${peaks.includes(hour) ? 'peak' : ''}`}
            style={{ height: `${Math.max(4, (sec / max) * 48)}px` }}
          />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Compose TodayPage with left col (TodoList + HeatmapHourly) + right col (TimeBlockList)**

- [ ] **Step 4: Verify layout matches mockup at 1440px wide; verify single-column at <900px**

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(ui): Today page — TimeBlockList + HeatmapHourly + full layout"
```

---

### Task C7: Reflection page — DayView + WeekView + day mosaic

**Files:**
- Create: `src/components/reflection/ReflectionPage.tsx`
- Create: `src/components/reflection/DayView.tsx`
- Create: `src/components/reflection/WeekView.tsx`
- Create: `src/components/reflection/DayMosaic.tsx`

- [ ] **Step 1: DayMosaic — proportional-width colored blocks**

```tsx
import type { Record } from '@/domain/types'
export function DayMosaic({ records }: { records: Record[] }) {
  return (
    <div className="reflection-mosaic">
      {records.map(r => {
        const heightPx = Math.min(74, Math.max(14, r.duration / 60))
        const flexValue = Math.max(20, r.duration / 60)
        const variant = r.duration > 3600 ? '' : r.duration > 1800 ? 'deep' : 'light'
        return <div key={r.id} className={`mosaic-block ${variant}`} style={{ flex: flexValue, height: `${heightPx}px` }} />
      })}
    </div>
  )
}
```

- [ ] **Step 2: DayView — composed with total + avg + DayMosaic + quote + meta**

```tsx
import { pickCopy } from '@/domain/copy'
import { formatDuration } from '@/domain/time'

export function DayView({ date, records }: Props) {
  const total = records.reduce((s, r) => s + r.duration, 0)
  const quote = pickCopy(categorizeDay(total), { /* ctx */ }, recentlyUsed)
  return (
    <div className="reflection-page">
      <h1 className="font-mono text-display">{formatDuration(total)}</h1>
      <DayMosaic records={records} />
      <p>{quote}</p>
    </div>
  )
}

function categorizeDay(totalSec: number): 'high_productivity_day' | 'stable_day' | 'low_productivity_day' {
  if (totalSec >= 4 * 3600) return 'high_productivity_day'
  if (totalSec >= 2 * 3600) return 'stable_day'
  return 'low_productivity_day'
}
```

- [ ] **Step 3: WeekView — 7 mini mosaics + week total**

(Iterate 7 days, render mini DayMosaic for each, weekly sum row at bottom.)

- [ ] **Step 4: ReflectionPage with arrow navigation + day/week toggle**

```tsx
const [granularity, setGranularity] = useState<'day' | 'week'>('day')
const [cursor, setCursor] = useState(formatDate(Date.now()))
// ◀▶ buttons step cursor by 1 day or 1 week
```

- [ ] **Step 5: Manual test — switch to Reflection tab, see today's data, click ◀ to see yesterday (mock data ok for now), toggle to week mode**

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(ui): Reflection page — DayView + WeekView + day mosaic"
```

---

### Task C8: Orange rain animation (jittered grid)

**Files:**
- Create: `src/lib/orange-rain.ts`
- Create: `src/components/orange-rain/OrangeRain.tsx`
- Modify: `src/app/page.tsx` (mount OrangeRain at root)

- [ ] **Step 1: orange-rain.ts — jittered grid generator (port from mockup JS)**

```ts
// src/lib/orange-rain.ts
export interface Raindrop {
  id: string
  type: 'blossom' | 'orange'
  leftPct: number
  delayMs: number
  durationMs: number
  rotateEnd: number
  scale: number
}

export function generateRain(): Raindrop[] {
  const total = 20  // PRD § 7.8 + 268e450 fix: ≥6 oranges
  const blossomCount = 14
  const orangeCount = 6

  const slotWidth = 96 / total
  const positions = shuffle(Array.from({ length: total }, (_, i) =>
    2 + i * slotWidth + Math.random() * slotWidth * 0.7
  ))

  const timeSlot = 2500 / total
  const delays = Array.from({ length: total }, (_, i) =>
    i * timeSlot + Math.random() * timeSlot * 0.6
  )

  const types: ('blossom' | 'orange')[] = [
    ...Array(blossomCount).fill('blossom'),
    ...Array(orangeCount).fill('orange'),
  ]
  shuffle(types)

  return types.map((type, i) => ({
    id: `${Date.now()}-${i}`,
    type,
    leftPct: positions[i],
    delayMs: delays[i],
    durationMs: 4000 + Math.random() * 1800,
    rotateEnd: Math.random() * 360 - 180,
    scale: 0.85 + Math.random() * 0.30,
  }))
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
```

- [ ] **Step 2: OrangeRain component — render drops with CSS animation**

```tsx
'use client'
import { useState, useEffect } from 'react'
import { generateRain, type Raindrop } from '@/lib/orange-rain'

export function OrangeRain({ trigger }: { trigger: number }) {
  const [drops, setDrops] = useState<Raindrop[]>([])

  useEffect(() => {
    if (trigger === 0) return
    const newDrops = generateRain()
    setDrops(d => [...d, ...newDrops])
    const cleanup = setTimeout(() => {
      setDrops(d => d.filter(x => !newDrops.includes(x)))
    }, 8500)
    return () => clearTimeout(cleanup)
  }, [trigger])

  return (
    <div className="orange-rain-container">
      {drops.map(d => (
        <div
          key={d.id}
          className={`raindrop ${d.type}`}
          style={{
            left: `${d.leftPct}%`,
            animationDelay: `${d.delayMs}ms`,
            animationDuration: `${d.durationMs}ms`,
            width: `${28 * d.scale}px`,
            height: `${28 * d.scale}px`,
            '--rotate-end': `${d.rotateEnd}deg`,
          } as React.CSSProperties}
        >
          {d.type === 'blossom' ? <BlossomSVG /> : <OrangeSVG />}
        </div>
      ))}
    </div>
  )
}
```

(Copy `BlossomSVG` and `OrangeSVG` JSX from mockup `<template>` blocks.)

- [ ] **Step 3: Mount OrangeRain at app root with trigger counter**

```tsx
// page.tsx
const [rainTrigger, setRainTrigger] = useState(0)
// trigger from: orange rain interval timer, Pomodoro completion
<OrangeRain trigger={rainTrigger} />
```

- [ ] **Step 4: Wire interval-based trigger from useTimer (every N minutes of active running time)**

- [ ] **Step 5: Wire Pomodoro completion trigger (when shouldCreateRecord fires)**

- [ ] **Step 6: Smoke test — start timer, advance time, verify rain appears**

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(ui): orange rain — jittered grid, 14 blossoms + 6 oranges per scene"
```

---

## Phase D — Polish + Validation (3 tasks · ~1 week)

### Task D1: Settings page + JSON export

**Files:**
- Create: `src/app/settings/page.tsx`
- Create: `src/components/settings/SettingsPage.tsx`

- [ ] **Step 1: SettingsPage with sections**

- Orange rain: interval dropdown (15/30/45/60/off) + sound toggle
- Pomodoro: work duration / break duration / cycles inputs
- Data: 导出 JSON button → downloads `peel-data-YYYY-MM-DD.json`

- [ ] **Step 2: Export implementation**

```ts
function exportData() {
  const data = {
    version: 'v0.1.0',
    exportedAt: new Date().toISOString(),
    records: JSON.parse(localStorage.getItem('peel-records') || '{}'),
    todos: JSON.parse(localStorage.getItem('peel-todos') || '{}'),
    settings: JSON.parse(localStorage.getItem('peel-settings') || '{}'),
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `peel-data-${formatDate(Date.now())}.json`
  a.click()
  URL.revokeObjectURL(url)
}
```

- [ ] **Step 3: Wire navigation to settings (gear icon in app shell)**

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(ui): settings page + JSON export"
```

---

### Task D2: Responsive breakpoints + onboarding empty states

**Files:**
- Modify: `src/app/globals.css` (add `@media` queries)
- Modify: various components for empty states

- [ ] **Step 1: Add media queries (port from mockup CSS)**

```css
@media (max-width: 900px) {
  .today-page { grid-template-columns: 1fr; gap: 32px; }
}
@media (max-width: 640px) {
  /* mockup app.html mobile breakpoint rules */
}
```

- [ ] **Step 2: NowPage empty state — input placeholder + 大圆"开始"按钮 + 角落剥开橘子**

- [ ] **Step 3: TodayPage empty state — "今天还没安排，加点什么吗？"**

- [ ] **Step 4: ReflectionPage empty state — "今天还没开始记录..."**

- [ ] **Step 5: Test in DevTools responsive mode at 1440 / 900 / 640 / 375 widths**

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(ui): responsive breakpoints + onboarding empty states"
```

---

### Task D3: Cross-browser smoke + UX validation prep

**Files:**
- Create: `docs/qa/cross-browser-test-checklist.md`
- Create: `docs/qa/5-second-test-script.md`
- Create: `docs/qa/24h-aha-validation.md`

- [ ] **Step 1: Cross-browser checklist**

Test core flows in:
- Chrome (macOS, latest)
- Safari (macOS, latest)
- Edge (Windows or macOS, latest)
- iOS Safari (iPhone 12 or similar)
- Android Chrome (any current device)

Per PRD § 8.4 — Firefox explicitly excluded.

For each: start/stop timer, switch tabs, trigger orange rain, refresh and verify persistence.

- [ ] **Step 2: 5-second test script**

Recruit 3 design-savvy friends. Open Peel, show first screen for 5 seconds, ask "3 words to describe the feeling." Per PRD § 8.3 — pass if ≥2 mention "fresh / minimal / natural / poetic / 清新".

- [ ] **Step 3: 24h aha validation plan**

Recruit 5-10 users for 2-day usage. After day 2, ask: "When did Peel feel useful?" Pass if ≥60% mention B (evening reflection data) or C (morning peak hours hint).

- [ ] **Step 4: Run cross-browser smoke (Step 1)**

Fill in the checklist with results. Fix any issues encountered.

- [ ] **Step 5: Tag v0.1.0-alpha + push**

```bash
git tag -a v0.1.0-alpha -m "v0.1.0-alpha — feature complete for friend testing"
git push origin claude/init-peel
git push origin v0.1.0-alpha
```

- [ ] **Step 6: Commit checklist files**

```bash
git add -A
git commit -m "docs(qa): cross-browser checklist + 5s/24h validation scripts"
```

After Task D3, **send the alpha link to 3 friends for 5-second test**, then to 5-10 users for 24h validation. Iterate on findings before tagging v1.0.0.

---

## Self-Review

Spec coverage check against PRD:
- § 1 Positioning → embedded in README + naming throughout
- § 2 Core loop A/B/C → Tasks B5 + C2-C7 (timer + Now + Today/Reflection)
- § 3 MVP scope → Phase A-C cover all v1 required features
- § 4 IA three pages → Tasks C1-C7
- § 5 Data model → Tasks A4, B1, B5
- § 6 Differentiation UI flows → Tasks C3 (todo selector) + C4 (Pomodoro toggle)
- § 7 Design language → Tasks A2 (tokens) + applied throughout C
- § 8.1 Functional verification → embedded in TDD steps + Task D3
- § 8.2 Performance → spot-check during dev + D3 smoke
- § 8.3 UX validation → Task D3
- § 8.4 Browser compat → Task D3 (Firefox explicitly excluded)
- § 8.5 Edge cases → covered in A4 (formatDate cross-midnight) + B1 (cross-midnight grouping test)
- § 9 Backlog → not implemented (out of v1 scope by design)
- § 10 Change log → README handled, version tagged in D3

No placeholders left, no "TBD" or "similar to Task N". Function names checked: `formatDate`, `formatDuration`, `computeTodoDuration`, `computeHourlyHeatmap`, `pickCopy`, `useTimer`, `generateRain` — used consistently across tasks.

---

## Execution Handoff

Plan complete and saved to `~/Desktop/peel/docs/plans/2026-05-17-peel-v1-implementation.md`.

Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration. Best for plans this size (22 tasks); the per-task context isolation keeps quality high.

2. **Inline Execution** — Execute tasks in this current session. Slower but everything stays in one chat history.

Which approach?
