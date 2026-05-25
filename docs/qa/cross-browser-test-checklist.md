# Peel v1 — Cross-Browser Test Checklist

Per PRD § 8.4, Firefox is explicitly excluded. We target standard evergreen browsers across macOS, Windows, iOS, and Android.

## Tested Browsers
- [ ] Chrome (macOS, latest)
- [ ] Safari (macOS, latest)
- [ ] Edge (Windows or macOS, latest)
- [ ] iOS Safari (iPhone / iPad)
- [ ] Android Chrome (any current device)

---

## 🔑 Core Validation Targets

### 1. Active Timer & Persistence (Now page)
- [ ] Click "开始" button → Starts timer incrementing (+1s, ≤100ms accuracy).
- [ ] Click "暂停" → Pauses timer.
- [ ] Click "继续" → Resumes timer without loss.
- [ ] Hard refresh page / Close tab and reopen → Timer restores with correct elapsed time (using timestamp calculation, not setInterval drift).
- [ ] Let timer run in a background tab for 30 minutes → Timer state remains accurate on return.
- [ ] Click "结束" → Saves record, resets timer display to 00:00:00.

### 2. Pomodoro Mode & State Sync
- [ ] Switch toggle to "Pomodoro" → background fades to light orange (#FEF3E7), 🍅 icon appears.
- [ ] Start pomodoro work session → 25min countdown starts.
- [ ] When work session finishes → 
  - [ ] Automatically stops and saves Pomodoro record (with tag `pomodoro`).
  - [ ] Instantly triggers Orange Rain animation.
  - [ ] Fades view to Rest view (Resting ☕).
  - [ ] Background changes smoothly to light mint green (#E8F5F0).
  - [ ] Countdown 5min starts.
- [ ] Click "跳过休息" or complete break → returns to work screen.

### 3. Today & Reflection Views
- [ ] Add a new Todo item in Today view.
- [ ] Select that Todo from the dropdown in Now view before starting timer.
- [ ] Verify completed timer records are correctly grouped as "Time Blocks" in Today view.
- [ ] Verify Todo items calculate total time dynamically by scanning record references.
- [ ] Heatmap aggregation displays relative hourly densities for past 7 days correctly.
- [ ] Reflection page mosaic blocks scale proportionately based on duration.
- [ ] Reflection history navigation (◀ / ▶ arrows) flips daily and weekly records correctly.

### 4. Settings & Backups
- [ ] Change Pomodoro work/break durations and cycles → updates configuration immediately.
- [ ] Change Orange rain intervals → verifies orange rain executes automatically at new intervals.
- [ ] Click "导出 JSON 备份" → downloads valid JSON file named `peel-data-YYYY-MM-DD.json`.
- [ ] Local storage capacity meter computes and updates size.
