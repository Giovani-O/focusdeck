# Timer Logic Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement timer logic in useTimer.ts hook and integrate with FocusDeck.tsx, using NumberFlow for animated time display.

**Architecture:** useReducer manages timer state (mode, status, timeLeft, sessionCount). Effects handle interval ticking, session completion, and settings sync. NumberFlow animates the countdown display.

**Tech Stack:** React (useReducer, useEffect), @number-flow/react, TypeScript

---

## File Structure

- `src/hooks/useTimer.ts` — Full implementation (timer reducer + hook)
- `src/components/FocusDeck.tsx` — Integrate useTimer, remove local timerStatus
- `src/components/TimerDisplay.tsx` — Add NumberFlow, update props
- `src/components/TimerControls.tsx` — Update to use dispatch

---

## Task 1: Install NumberFlow

- [ ] **Step 1: Install @number-flow/react**

```bash
npm install @number-flow/react
```

---

## Task 2: Implement useTimer hook

**Files:**
- Modify: `src/hooks/useTimer.ts`
- Reference: `docs/specs/2026-03-23-timer-logic-spec.md`, `src/types/timer.ts`

- [ ] **Step 1: Write the TimerState type and initial state function**

Add to `src/hooks/useTimer.ts`:

```typescript
import { useReducer, useEffect } from "react";
import type { TimerMode, TimerStatus, TimerSettings, TimerState } from "@/types/timer";

type TimerAction =
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "RESET"; payload: TimerSettings }
  | { type: "TICK" }
  | { type: "COMPLETE_SESSION"; payload: TimerSettings }
  | { type: "APPLY_SETTINGS"; payload: TimerSettings };

function getInitialState(settings: TimerSettings): TimerState {
  return {
    mode: "work",
    status: "idle",
    timeLeft: settings.workDuration,
    sessionCount: 0,
  };
}
```

- [ ] **Step 2: Write the timer reducer**

```typescript
function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case "START":
      return { ...state, status: "running" };

    case "PAUSE":
      return { ...state, status: "paused" };

    case "RESUME":
      return { ...state, status: "running" };

    case "RESET":
      return getInitialState(action.payload);

    case "TICK":
      return {
        ...state,
        timeLeft: Math.max(0, state.timeLeft - 1),
      };

    case "COMPLETE_SESSION": {
      const { workDuration, shortBreakDuration, longBreakDuration } = action.payload;

      if (state.mode === "work") {
        const newSessionCount = state.sessionCount + 1;
        const isLongBreak = newSessionCount % 4 === 0;
        return {
          ...state,
          mode: isLongBreak ? "long-break" : "short-break",
          status: "running",
          timeLeft: isLongBreak ? longBreakDuration : shortBreakDuration,
          sessionCount: newSessionCount,
        };
      } else {
        return {
          ...state,
          mode: "work",
          status: "idle",
          timeLeft: workDuration,
        };
      }
    }

    case "APPLY_SETTINGS": {
      const { workDuration, shortBreakDuration, longBreakDuration } = action.payload;
      let newTimeLeft = state.timeLeft;

      if (state.mode === "work") {
        newTimeLeft = workDuration;
      } else if (state.mode === "short-break") {
        newTimeLeft = shortBreakDuration;
      } else if (state.mode === "long-break") {
        newTimeLeft = longBreakDuration;
      }

      return {
        ...state,
        timeLeft: newTimeLeft,
      };
    }

    default:
      return state;
  }
}
```

- [ ] **Step 3: Write the useTimer hook with effects**

```typescript
export function useTimer(settings: TimerSettings) {
  const [state, dispatch] = useReducer(timerReducer, settings, getInitialState);

  // Interval effect - runs when status is 'running'
  useEffect(() => {
    if (state.status !== "running") return;

    const interval = setInterval(() => {
      dispatch({ type: "TICK" });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.status]);

  // Session completion effect
  useEffect(() => {
    if (state.timeLeft === 0 && state.status === "running") {
      dispatch({ type: "COMPLETE_SESSION", payload: settings });
    }
  }, [state.timeLeft, state.status, settings]);

  // Settings sync effect
  useEffect(() => {
    dispatch({ type: "APPLY_SETTINGS", payload: settings });
  }, [settings]);

  return { state, dispatch };
}
```

- [ ] **Step 4: Run TypeScript check**

```bash
npm run typecheck
```

Expected: PASS (no errors)

---

## Task 3: Integrate useTimer in FocusDeck

**Files:**
- Modify: `src/components/FocusDeck.tsx`

- [ ] **Step 1: Import useTimer and update component**

```typescript
import { useState, useCallback } from "react";
import TimerDisplay from "./TimerDisplay";
import TimerControls from "./TimerControls";
import SettingsPanel from "./SettingsPanel";
import SessionLog from "./SessionLog";
import type { SessionEntry, TimerSettings, TimerMode } from "@/types/timer";
import { useTimer } from "@/hooks/useTimer";
import { toSeconds } from "@/hooks/utils";

const MOCK_SESSIONS: SessionEntry[] = [
  { id: 1, sessionNumber: 3, duration: 1500, completedAt: "14:32" },
  { id: 2, sessionNumber: 2, duration: 1500, completedAt: "13:45" },
  { id: 3, sessionNumber: 1, duration: 1500, completedAt: "09:15" },
];

export default function FocusDeck() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<TimerSettings>({
    workDuration: toSeconds(25),
    shortBreakDuration: toSeconds(5),
    longBreakDuration: toSeconds(15),
  });

  const { state, dispatch } = useTimer(settings);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Timer Card */}
        <div className="p-6 bg-gray-900 rounded-2xl shadow-lg">
          <TimerDisplay timeLeft={state.timeLeft} mode={state.mode} />
          <TimerControls status={state.status} dispatch={dispatch} />
          <SettingsPanel
            isOpen={isSettingsOpen}
            setIsOpen={setIsSettingsOpen}
            settings={settings}
            setSettings={setSettings}
          />
        </div>

        {/* Log Card */}
        <div className="p-6 bg-gray-900 rounded-2xl shadow-lg">
          <SessionLog sessions={MOCK_SESSIONS} />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Run TypeScript check**

```bash
npm run typecheck
```

Expected: PASS

---

## Task 4: Update TimerDisplay with NumberFlow

**Files:**
- Modify: `src/components/TimerDisplay.tsx`

- [ ] **Step 1: Read current TimerDisplay**

```bash
cat src/components/TimerDisplay.tsx
```

- [ ] **Step 2: Update with NumberFlow and props**

```typescript
"use client";

import NumberFlow from "@number-flow/react";
import type { TimerMode } from "@/types/timer";

interface TimerDisplayProps {
  timeLeft: number;
  mode: TimerMode;
}

const modeLabels: Record<TimerMode, string> = {
  work: "Work",
  "short-break": "Short Break",
  "long-break": "Long Break",
};

const modeColors: Record<TimerMode, string> = {
  work: "text-violet-400",
  "short-break": "text-sky-400",
  "long-break": "text-green-400",
};

export default function TimerDisplay({ timeLeft, mode }: TimerDisplayProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeValue = minutes * 60 + seconds;

  return (
    <div className="text-center mb-8">
      <p className={`text-sm uppercase tracking-widest mb-2 ${modeColors[mode]}`}>
        {modeLabels[mode]}
      </p>
      <div className="font-mono text-7xl font-bold text-white tabular-nums">
        <NumberFlow
          value={timeValue}
          format={{
            minimumIntegerDigits: 2,
            maximumFractionDigits: 0,
          }}
          digits={{
            0: { max: 59 },
            1: { max: 59 },
          }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Run TypeScript check**

```bash
npm run typecheck
```

Expected: PASS

---

## Task 5: Update TimerControls to use dispatch

**Files:**
- Modify: `src/components/TimerControls.tsx`

- [ ] **Step 1: Read current TimerControls**

```bash
cat src/components/TimerControls.tsx
```

- [ ] **Step 2: Update to use dispatch**

```typescript
"use client";

import type { TimerStatus, TimerSettings } from "@/types/timer";

interface TimerControlsProps {
  status: TimerStatus;
  dispatch: React.Dispatch<
    | { type: "START" }
    | { type: "PAUSE" }
    | { type: "RESUME" }
    | { type: "RESET"; payload: TimerSettings }
  >;
}

export default function TimerControls({ status, dispatch }: TimerControlsProps) {
  const handleStart = () => dispatch({ type: "START" });
  const handlePause = () => dispatch({ type: "PAUSE" });
  const handleResume = () => dispatch({ type: "RESUME" });
  const handleReset = () => {
    const settings: TimerSettings = {
      workDuration: 25 * 60,
      shortBreakDuration: 5 * 60,
      longBreakDuration: 15 * 60,
    };
    dispatch({ type: "RESET", payload: settings });
  };

  return (
    <div className="flex justify-center gap-3 mb-6">
      {status === "idle" && (
        <button
          type="button"
          onClick={handleStart}
          className="px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-full font-semibold transition-colors"
        >
          Start
        </button>
      )}

      {status === "running" && (
        <button
          type="button"
          onClick={handlePause}
          className="px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-full font-semibold transition-colors"
        >
          Pause
        </button>
      )}

      {status === "paused" && (
        <>
          <button
            type="button"
            onClick={handleResume}
            className="px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-full font-semibold transition-colors"
          >
            Resume
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-full font-semibold transition-colors"
          >
            Reset
          </button>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Run TypeScript check**

```bash
npm run typecheck
```

Expected: PASS

---

## Task 6: Verify implementation

- [ ] **Step 1: Run the dev server**

```bash
npm run dev
```

- [ ] **Step 2: Test in browser**

Open http://localhost:3000

1. Click Start → timer counts down
2. Click Pause → timer pauses
3. Click Resume → timer continues
4. Wait for timer to reach 00:00 → should auto-transition to break mode
5. After break ends → returns to work mode, idle

- [ ] **Step 3: Run lint**

```bash
npm run lint
```

Expected: PASS

---

## Task 7: Commit

```bash
git add src/hooks/useTimer.ts src/components/FocusDeck.tsx src/components/TimerDisplay.tsx src/components/TimerControls.tsx package.json package-lock.json
git commit -m "feat: implement timer logic with useReducer and NumberFlow"
```
