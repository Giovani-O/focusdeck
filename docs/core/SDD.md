# SDD — FocusDeck

## Tech Stack

| Concern | Choice | Reason |
|---|---|---|
| Framework | Next.js 15 (App Router) | Portfolio-relevant, close to vanilla React |
| Language | TypeScript | Non-negotiable at mid-level |
| Styling | Tailwind CSS | Fast to use, widely adopted |
| State | React hooks only (no library) | The entire point of this project |
| Testing | Not in scope for this exercise | |

No external state management library. No data fetching library. This is intentional — the goal is to practice hooks in isolation.

---

## Project Structure

```
focusdeck/
├── app/
│   ├── layout.tsx
│   └── page.tsx              # Renders <FocusDeck />
├── components/
│   ├── FocusDeck.tsx          # Root component, owns all state
│   ├── TimerDisplay.tsx       # Renders the countdown, mode label
│   ├── TimerControls.tsx      # Start / Pause / Reset buttons
│   ├── SettingsPanel.tsx      # Collapsible settings form
│   └── SessionLog.tsx         # List of completed sessions
├── hooks/
│   └── useTimer.ts            # All timer logic lives here
└── types/
    └── timer.ts               # Shared TypeScript types
```

---

## Types

```ts
// types/timer.ts

export type TimerMode = 'work' | 'short-break' | 'long-break'

export type TimerStatus = 'idle' | 'running' | 'paused'

export interface TimerSettings {
  workDuration: number       // in seconds
  shortBreakDuration: number
  longBreakDuration: number
}

export interface SessionEntry {
  id: number
  sessionNumber: number
  duration: number           // in seconds
  completedAt: string        // HH:MM
}

export interface TimerState {
  mode: TimerMode
  status: TimerStatus
  timeLeft: number           // in seconds
  sessionCount: number       // completed work sessions
}
```

---

## State Architecture

### useReducer — Timer state

The timer has four interdependent fields: `mode`, `status`, `timeLeft`, and `sessionCount`. These change together in response to actions. This is the canonical case for `useReducer` over multiple `useState` calls.

```ts
type TimerAction =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'RESET'; payload: TimerSettings }
  | { type: 'TICK' }
  | { type: 'COMPLETE_SESSION'; payload: TimerSettings }
  | { type: 'APPLY_SETTINGS'; payload: TimerSettings }
```

The reducer handles all transitions. No timer logic should live outside of it.

### useState — UI state

Simple, independent values that don't affect the timer machine:

```ts
const [isSettingsOpen, setIsSettingsOpen] = useState(false)
const [settings, setSettings] = useState<TimerSettings>(DEFAULT_SETTINGS)
const [log, setLog] = useState<SessionEntry[]>([])
```

---

## useTimer Hook

All timer logic is encapsulated in `useTimer`. `FocusDeck.tsx` consumes it and passes props down. Child components do not call `useTimer` directly.

```ts
// hooks/useTimer.ts

export function useTimer(settings: TimerSettings, onSessionComplete: (entry: SessionEntry) => void) {
  const [state, dispatch] = useReducer(timerReducer, getInitialState(settings))

  // Challenge 1 — The interval
  // A naive implementation using state directly inside setInterval
  // will cause a stale closure. You need to solve this correctly.
  useEffect(() => {
    if (state.status !== 'running') return
    const interval = setInterval(() => {
      dispatch({ type: 'TICK' })
    }, 1000)
    return () => clearInterval(interval)
  }, [state.status])

  // Challenge 2 — Session completion side effect
  // When timeLeft hits 0, the session is complete.
  // A naive useEffect watching timeLeft will cause an infinite loop
  // if it also triggers state changes. Solve this carefully.
  useEffect(() => {
    if (state.timeLeft === 0 && state.status === 'running') {
      // handle completion
    }
  }, [state.timeLeft, state.status])

  // Challenge 3 — Settings change while running
  // When settings change, the running session should restart.
  // The dependency array here is critical — too broad causes unintended
  // re-runs, too narrow causes stale values.
  useEffect(() => {
    dispatch({ type: 'APPLY_SETTINGS', payload: settings })
  }, [settings])

  return { state, dispatch }
}
```

The comments above are intentional hints. Read them, encounter the bug, then fix it.

---

## Component Responsibilities

### FocusDeck.tsx
- Owns `settings`, `isSettingsOpen`, `log` state
- Calls `useTimer`, passes handlers and state as props
- Handles `onSessionComplete` callback — appends to log

### TimerDisplay.tsx
- Receives `timeLeft`, `mode` as props
- Formats `timeLeft` into MM:SS
- No state, no effects — pure presentational

### TimerControls.tsx
- Receives `status` and dispatch callbacks as props
- Renders Start/Pause/Resume/Reset conditionally based on `status`
- No state

### SettingsPanel.tsx
- Receives `settings`, `isOpen`, `onChange` as props
- Local form state only (controlled inputs)
- Calls `onChange` on form submit, not on every keystroke

### SessionLog.tsx
- Receives `log` and `onClear` as props
- Renders entries in reverse order
- No state, no effects

---

## Implementation Notes

### Formatting time
```ts
const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}
```

### Default settings
```ts
const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
}
```

### Long break logic
A long break occurs after every 4 completed work sessions:
```ts
const nextMode = sessionCount % 4 === 0 ? 'long-break' : 'short-break'
```

---

## Intentional Challenges Summary

These are not bugs in this document — they are gaps left for you to solve:

1. **Stale closure in the interval** — `TICK` is dispatched correctly, but if you try to read `state.timeLeft` directly inside `setInterval`, you will get a stale value. Understand why, then fix it.

2. **Infinite loop on session complete** — The `useEffect` watching `timeLeft === 0` will re-run if its dependencies update as a result of the completion handler. Structure the effect and the reducer so this doesn't loop.

3. **Settings dependency array** — The `APPLY_SETTINGS` effect must only fire when settings genuinely change, not on every render. Understand what belongs in the dependency array and why.

4. **useReducer state shape** — Design the reducer so that `COMPLETE_SESSION` transitions mode, resets `timeLeft` to the correct next duration, and increments `sessionCount` atomically — all in one dispatch.
