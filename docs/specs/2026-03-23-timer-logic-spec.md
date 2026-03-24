# Timer Logic Spec — 2026-03-23

## Overview

Implement timer logic in `useTimer.ts` hook, integrating it with `FocusDeck.tsx`. The timer handles countdown, mode transitions (Work ↔ Break), session counting, and settings synchronization.

## State Architecture

### Timer State (`TimerState`)

| Field | Type | Description |
|-------|------|-------------|
| `mode` | `TimerMode` | `"work" \| "short-break" \| "long-break"` |
| `status` | `TimerStatus` | `"idle" \| "running" \| "paused"` |
| `timeLeft` | `number` | Seconds remaining |
| `sessionCount` | `number` | Completed work sessions |

### Actions (`TimerAction`)

```typescript
type TimerAction =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'RESET'; payload: TimerSettings }
  | { type: 'TICK' }
  | { type: 'COMPLETE_SESSION'; payload: TimerSettings }
  | { type: 'APPLY_SETTINGS'; payload: TimerSettings }
```

## Reducer Logic

### `getInitialState(settings: TimerSettings): TimerState`

- `mode`: `"work"`
- `status`: `"idle"`
- `timeLeft`: `settings.workDuration`
- `sessionCount`: `0`

### `timerReducer(state: TimerState, action: TimerAction): TimerState`

| Action | Logic |
|--------|-------|
| `START` | Sets `status` to `"running"` |
| `PAUSE` | Sets `status` to `"paused"` |
| `RESUME` | Sets `status` to `"running"` |
| `RESET` | Resets to initial state with new `settings.workDuration` |
| `TICK` | Decrements `timeLeft` by 1 (min 0) |
| `COMPLETE_SESSION` | If mode is work: increments `sessionCount`, sets mode to break (long if `sessionCount % 4 === 0`, else short), sets `timeLeft` to break duration, sets `status` to `"running"`. If mode is break: sets mode to `"work"`, sets `timeLeft` to `settings.workDuration`, sets `status` to `"idle"` |
| `APPLY_SETTINGS` | Resets `timeLeft` to appropriate duration for current mode |

## useTimer Hook

### Signature

```typescript
export function useTimer(settings: TimerSettings): {
  state: TimerState;
  dispatch: React.Dispatch<TimerAction>;
}
```

### Effects

1. **Interval**: Runs when `status === "running"`. Dispatches `TICK` every 1000ms.
2. **Session completion**: Watches `timeLeft === 0 && status === "running"`. Dispatches `COMPLETE_SESSION`.
3. **Settings sync**: Watches `settings`. Dispatches `APPLY_SETTINGS`.

### Challenges (per SDD)

1. **Stale closure**: `TICK` dispatch avoids stale closure by not reading state inside interval.
2. **Infinite loop**: `COMPLETE_SESSION` effect uses `status` in deps but structured to not re-trigger.
3. **Settings dependency**: `APPLY_SETTINGS` fires only on settings object change.

## FocusDeck Integration

- Remove local `timerStatus` state
- Call `useTimer(settings)` hook
- Pass to children:
  - `TimerDisplay`: `timeLeft={state.timeLeft}`, `mode={state.mode}`
  - `TimerControls`: `status={state.status}`, `dispatch={dispatch}`
  - `SettingsPanel`: Already integrated

## Components Update

### TimerDisplay

Props: `timeLeft: number`, `mode: TimerMode`

Renders:
- Mode label (Work / Short Break / Long Break)
- Time in MM:SS format

### TimerControls

Props: `status: TimerStatus`, `dispatch: React.Dispatch<TimerAction>`

Buttons:
- `idle` → Start
- `running` → Pause
- `paused` → Resume, Reset

## Files Modified

- `src/hooks/useTimer.ts` — Full implementation
- `src/components/FocusDeck.tsx` — Integrate useTimer
- `src/components/TimerDisplay.tsx` — Add props interface
- `src/components/TimerControls.tsx` — Update to use dispatch

## Out of Scope

- Session logging (onSessionComplete callback)
- Persistence
- Sounds/notifications
