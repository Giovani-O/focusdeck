# Session Log Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement session log with localStorage persistence. When work sessions complete, log entries are created with session number, duration, and timestamp. Logs persist across page reloads.

**Architecture:** FocusDeck owns log state, receives onSessionComplete callback from useTimer. useLocalStorage hook handles localStorage sync. Global session counter persists in localStorage.

**Tech Stack:** React hooks, localStorage API

---

### Task 1: Create useLocalStorage hook

**Files:**
- Create: `src/hooks/useLocalStorage.ts`

- [ ] **Step 1: Create useLocalStorage hook**

```typescript
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue];
}
```

- [ ] **Step 2: Run linter**

Run: `npm run lint`
Expected: No errors

---

### Task 2: Update SessionLog to accept onClear

**Files:**
- Modify: `src/components/SessionLog.tsx`

- [ ] **Step 1: Read current SessionLog.tsx**

- [ ] **Step 2: Add onClear prop**

```typescript
interface SessionLogProps {
  sessions: SessionEntry[];
  onClear?: () => void;
}
```

- [ ] **Step 3: Add Clear button**

Add after the sessions list:
```tsx
{onClear && sessions.length > 0 && (
  <button
    type="button"
    onClick={onClear}
    className="mt-4 text-sm text-gray-500 hover:text-red-400 transition-colors"
  >
    Clear log
  </button>
)}
```

- [ ] **Step 4: Run linter**

Run: `npm run lint`
Expected: No errors

---

### Task 3: Update useTimer to accept onSessionComplete callback

**Files:**
- Modify: `src/hooks/useTimer.ts`

- [ ] **Step 1: Read useTimer.ts**

- [ ] **Step 2: Update function signature**

```typescript
export function useTimer(
  settings: TimerSettings,
  onSessionComplete?: (entry: { sessionNumber: number; duration: number; completedAt: string }) => void
) {
```

- [ ] **Step 3: Call callback in useEffect when session completes**

Update the session completion effect:
```typescript
useEffect(() => {
  if (state.timeLeft === 0 && state.status === 'running') {
    if (onSessionComplete) {
      const now = new Date();
      const completedAt = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      onSessionComplete({
        sessionNumber: state.sessionCount + 1,
        duration: settings.workDuration,
        completedAt,
      });
    }
    dispatch({ type: 'COMPLETE_SESSION', payload: settings });
  }
}, [state.timeLeft, state.status, settings, onSessionComplete]);
```

- [ ] **Step 4: Run linter**

Run: `npm run lint`
Expected: No errors

---

### Task 4: Update FocusDeck to handle session log

**Files:**
- Modify: `src/components/FocusDeck.tsx`

- [ ] **Step 1: Read FocusDeck.tsx**

- [ ] **Step 2: Import useLocalStorage and update imports**

```typescript
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { SessionEntry } from '@/types/timer';
```

- [ ] **Step 3: Add log state using useLocalStorage**

```typescript
const [log, setLog] = useLocalStorage<SessionEntry[]>('focusdeck-session-log', []);
const [sessionCounter, setSessionCounter] = useLocalStorage<number>('focusdeck-session-count', 0);
```

- [ ] **Step 4: Add onSessionComplete handler**

```typescript
const handleSessionComplete = (entry: { sessionNumber: number; duration: number; completedAt: string }) => {
  const newEntry: SessionEntry = {
    id: Date.now(),
    sessionNumber: sessionCounter + 1,
    duration: entry.duration,
    completedAt: entry.completedAt,
  };
  setLog([newEntry, ...log]);
  setSessionCounter(sessionCounter + 1);
};
```

- [ ] **Step 5: Update useTimer call**

```typescript
const { state, dispatch } = useTimer(settings, handleSessionComplete);
```

- [ ] **Step 6: Pass log and onClear to SessionLog**

```typescript
<SessionLog
  sessions={log}
  onClear={() => {
    setLog([]);
  }}
/>
```

- [ ] **Step 7: Run linter and typecheck**

Run: `npm run lint && npx tsc --noEmit`
Expected: No errors

---

### Task 5: Final verification

- [ ] **Step 1: Run all linters**

Run: `npm run lint && npm run biome:lint`
Expected: No errors

- [ ] **Step 2: Test the app**

Run: `npm run dev`
Verify: Complete a work session, check that log appears with correct session number, duration, and timestamp. Refresh page, verify log persists.
