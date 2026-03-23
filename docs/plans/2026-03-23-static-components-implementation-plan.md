# FocusDeck Static Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create 5 static React components (FocusDeck, TimerDisplay, TimerControls, SettingsPanel, SessionLog) with mock data, following composition pattern and Tailwind CSS styling.

**Architecture:** Components created in `src/components/` folder with props-driven data flow. Each component is pure presentational, receives data via props, no hooks or internal state.

**Tech Stack:** React (Next.js 15), TypeScript, Tailwind CSS v4

---

### Task 1: Create Types File

**Files:**
- Create: `src/types/timer.ts`

- [ ] **Step 1: Create types/timer.ts with all TypeScript interfaces**

```typescript
export type TimerMode = 'work' | 'short-break' | 'long-break'

export type TimerStatus = 'idle' | 'running' | 'paused'

export interface TimerSettings {
  workDuration: number
  shortBreakDuration: number
  longBreakDuration: number
}

export interface SessionEntry {
  id: number
  sessionNumber: number
  duration: number
  completedAt: string
}
```

---

### Task 2: Create TimerDisplay Component

**Files:**
- Create: `src/components/TimerDisplay.tsx`

- [ ] **Step 1: Write TimerDisplay component**

```typescript
import { TimerMode } from '@/types/timer'

interface TimerDisplayProps {
  timeLeft: number
  mode: TimerMode
}

const MODE_LABELS: Record<TimerMode, string> = {
  'work': 'FOCUS',
  'short-break': 'SHORT BREAK',
  'long-break': 'LONG BREAK',
}

const MODE_COLORS: Record<TimerMode, string> = {
  'work': 'text-violet-400',
  'short-break': 'text-sky-400',
  'long-break': 'text-green-400',
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function TimerDisplay({ timeLeft, mode }: TimerDisplayProps) {
  return (
    <div className="text-center">
      <div className={`text-6xl font-bold tabular-nums ${MODE_COLORS[mode]}`}>
        {formatTime(timeLeft)}
      </div>
      <div className={`mt-2 text-sm uppercase tracking-widest ${MODE_COLORS[mode]}`}>
        {MODE_LABELS[mode]}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify file created correctly**

Run: `ls -la src/components/TimerDisplay.tsx`

---

### Task 3: Create TimerControls Component

**Files:**
- Create: `src/components/TimerControls.tsx`

- [ ] **Step 1: Write TimerControls component**

```typescript
import { TimerStatus } from '@/types/timer'

interface TimerControlsProps {
  status: TimerStatus
}

const BUTTON_VARIANTS = {
  idle: 'bg-violet-600 hover:bg-violet-500',
  running: 'bg-yellow-600 hover:bg-yellow-500',
  paused: 'bg-green-600 hover:bg-green-500',
}

const STATUS_LABELS = {
  idle: 'Start',
  running: 'Pause',
  paused: 'Resume',
}

export default function TimerControls({ status }: TimerControlsProps) {
  return (
    <div className="flex justify-center gap-3 mt-6">
      <button
        type="button"
        className={`px-6 py-2 rounded-lg font-semibold text-white transition-colors ${BUTTON_VARIANTS[status]}`}
      >
        {STATUS_LABELS[status]}
      </button>
      <button
        type="button"
        className="px-6 py-2 rounded-lg font-semibold bg-gray-700 hover:bg-gray-600 text-white transition-colors"
      >
        Reset
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Verify file created correctly**

Run: `ls -la src/components/TimerControls.tsx`

---

### Task 4: Create SettingsPanel Component

**Files:**
- Create: `src/components/SettingsPanel.tsx`

- [ ] **Step 1: Write SettingsPanel component**

```typescript
import { TimerSettings } from '@/types/timer'

interface SettingsPanelProps {
  isOpen: boolean
  settings: TimerSettings
}

function toMinutes(seconds: number): number {
  return Math.round(seconds / 60)
}

export default function SettingsPanel({ isOpen, settings }: SettingsPanelProps) {
  if (!isOpen) return null

  return (
    <div className="mt-6 p-4 bg-gray-800 rounded-lg">
      <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-4">
        Settings
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">
            Work Duration (min)
          </label>
          <input
            type="number"
            defaultValue={toMinutes(settings.workDuration)}
            min={1}
            max={60}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">
            Short Break (min)
          </label>
          <input
            type="number"
            defaultValue={toMinutes(settings.shortBreakDuration)}
            min={1}
            max={30}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">
            Long Break (min)
          </label>
          <input
            type="number"
            defaultValue={toMinutes(settings.longBreakDuration)}
            min={1}
            max={60}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          type="button"
          className="w-full px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-semibold transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify file created correctly**

Run: `ls -la src/components/SettingsPanel.tsx`

---

### Task 5: Create SessionLog Component

**Files:**
- Create: `src/components/SessionLog.tsx`

- [ ] **Step 1: Write SessionLog component**

```typescript
import { SessionEntry } from '@/types/timer'

interface SessionLogProps {
  sessions: SessionEntry[]
}

function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60)
  return `${mins} min`
}

export default function SessionLog({ sessions }: SessionLogProps) {
  return (
    <div className="p-4 bg-gray-900 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm uppercase tracking-widest text-gray-400">
          Session Log
        </h3>
        <button
          type="button"
          className="text-xs text-gray-500 hover:text-red-400 transition-colors"
        >
          Clear
        </button>
      </div>
      {sessions.length === 0 ? (
        <p className="text-gray-600 text-sm text-center py-4">
          No sessions completed yet
        </p>
      ) : (
        <ul className="space-y-2">
          {sessions.map((session) => (
            <li
              key={session.id}
              className="flex items-center justify-between py-2 px-3 bg-gray-800 rounded-lg"
            >
              <span className="text-violet-400 font-semibold">
                #{session.sessionNumber}
              </span>
              <span className="text-gray-400 text-sm">
                {formatDuration(session.duration)}
              </span>
              <span className="text-gray-500 text-sm">
                {session.completedAt}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify file created correctly**

Run: `ls -la src/components/SessionLog.tsx`

---

### Task 6: Create FocusDeck Root Component

**Files:**
- Create: `src/components/FocusDeck.tsx`

- [ ] **Step 1: Write FocusDeck component**

```typescript
import TimerDisplay from './TimerDisplay'
import TimerControls from './TimerControls'
import SettingsPanel from './SettingsPanel'
import SessionLog from './SessionLog'
import { TimerSettings, SessionEntry } from '@/types/timer'

const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
}

const MOCK_SESSIONS: SessionEntry[] = [
  { id: 1, sessionNumber: 3, duration: 1500, completedAt: '14:32' },
  { id: 2, sessionNumber: 2, duration: 1500, completedAt: '13:45' },
  { id: 3, sessionNumber: 1, duration: 1500, completedAt: '09:15' },
]

export default function FocusDeck() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Timer Card */}
        <div className="p-6 bg-gray-900 rounded-2xl shadow-lg">
          <TimerDisplay timeLeft={1500} mode="work" />
          <TimerControls status="idle" />
          <SettingsPanel isOpen={false} settings={DEFAULT_SETTINGS} />
        </div>

        {/* Log Card */}
        <div className="p-6 bg-gray-900 rounded-2xl shadow-lg">
          <SessionLog sessions={MOCK_SESSIONS} />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify file created correctly**

Run: `ls -la src/components/FocusDeck.tsx`

---

### Task 7: Update page.tsx to Render FocusDeck

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Update page.tsx**

```typescript
import FocusDeck from '@/components/FocusDeck'

export default function Home() {
  return <FocusDeck />
}
```

- [ ] **Step 2: Run build to verify no errors**

Run: `npm run build`

---

### Task 8: Run Lint and Verify

**Files:**
- Check: All created files

- [ ] **Step 1: Run biome lint**

Run: `npm run biome:lint`

Expected: No errors

---

## Completion Criteria

- [ ] All 5 components created in `src/components/`
- [ ] Types defined in `src/types/timer.ts`
- [ ] FocusDeck renders in browser with two stacked cards
- [ ] Timer shows "25:00" and "FOCUS" label
- [ ] Controls show Start and Reset buttons (idle state)
- [ ] SettingsPanel is collapsible (closed by default)
- [ ] SessionLog shows 3 mock entries
- [ ] All styling uses Tailwind with existing color theme
- [ ] No lint errors
