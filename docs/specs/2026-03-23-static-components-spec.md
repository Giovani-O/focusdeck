# FocusDeck Static Components Spec

## Overview

This spec covers the creation of static React components for FocusDeck. Components will display UI with hardcoded/mock data initially, with hooks and state integration coming later.

## Architecture

- **Project structure**: `src/components/` for all components
- **Styling**: Tailwind CSS v4 with existing color theme (gray, violet, sky, green, red, yellow)
- **Data**: All components receive props but render static/mock data for now
- **Composition**: Parent components pass props to children (composition pattern)

## Component Hierarchy

```
FocusDeck (root)
├── TimerCard (wrapper for left/top card)
│   ├── TimerDisplay
│   ├── TimerControls
│   └── SettingsPanel
└── LogCard (wrapper for right/bottom card)
    └── SessionLog
```

## Visual Design

### Layout
- Two cards stacked vertically (mobile-friendly)
- Cards: `bg-gray-900`, rounded corners, subtle shadow
- Centered on page with flexbox
- Card width: max-w-md (around 400-450px)

### Color Mapping (by Timer Mode)
- **Work**: violet-500 primary
- **Short Break**: sky-500 primary
- **Long Break**: green-500 primary
- **Idle/Reset**: gray-400

### Typography
- Timer display: 6xl size, bold, monospace
- Labels: sm size, uppercase, tracking-wide
- Log entries: base size

## Components Specification

### 1. FocusDeck.tsx
- Root component, owns layout structure
- Two cards stacked vertically with gap-6 between
- Props: none (static for now)
- Renders static timer card and log card

### 2. TimerDisplay.tsx
- Props: `timeLeft: number` (seconds), `mode: TimerMode`
- Displays time in MM:SS format
- Shows mode label below timer ("FOCUS", "SHORT BREAK", "LONG BREAK")
- Uses mode-specific colors for visual feedback

### 3. TimerControls.tsx
- Props: `status: TimerStatus`
- Buttons: Start, Pause, Resume, Reset
- Conditional rendering based on status
- Start: shown when idle
- Pause: shown when running
- Resume: shown when paused
- Reset: always visible
- Uses mode-appropriate colors for primary actions

### 4. SettingsPanel.tsx
- Props: `isOpen: boolean`, `settings: TimerSettings`
- Collapsible panel (shown/hidden based on isOpen)
- Three input fields: Work, Short Break, Long Break
- Duration in minutes (convert to seconds in parent)
- Submit button to apply settings

### 5. SessionLog.tsx
- Props: `sessions: SessionEntry[]`, `onClear: () => void`
- Renders list of completed sessions
- Each entry shows: session number, duration (formatted), timestamp
- Most recent first (reverse order)
- Clear button to clear log

## Static Data Values

### Default Settings
```typescript
workDuration: 25 * 60        // 1500 seconds
shortBreakDuration: 5 * 60   // 300 seconds  
longBreakDuration: 15 * 60  // 900 seconds
```

### Mock Session Log (3 entries)
```typescript
[
  { id: 1, sessionNumber: 3, duration: 1500, completedAt: "14:32" },
  { id: 2, sessionNumber: 2, duration: 1500, completedAt: "13:45" },
  { id: 3, sessionNumber: 1, duration: 1500, completedAt: "09:15" },
]
```

### Timer Display Example
- Time left: 1500 seconds → "25:00"
- Mode: "work" → "FOCUS"

## Types

```typescript
type TimerMode = 'work' | 'short-break' | 'long-break'
type TimerStatus = 'idle' | 'running' | 'paused'

interface TimerSettings {
  workDuration: number
  shortBreakDuration: number
  longBreakDuration: number
}

interface SessionEntry {
  id: number
  sessionNumber: number
  duration: number
  completedAt: string
}
```

## Acceptance Criteria

1. ✅ FocusDeck renders two stacked cards centered on page
2. ✅ TimerDisplay shows "25:00" and "FOCUS" (static values)
3. ✅ TimerControls shows appropriate buttons for 'idle' status
4. ✅ SettingsPanel is collapsible and shows all three duration inputs
5. ✅ SessionLog displays 3 mock session entries in reverse chronological order
6. ✅ All components use Tailwind CSS with existing color palette
7. ✅ Components follow composition pattern (props flow down)
8. ✅ No hooks or state used yet (pure presentational components)
