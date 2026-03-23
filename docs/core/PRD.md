# PRD — FocusDeck

## Overview

FocusDeck is a Pomodoro-style focus timer with session tracking and configurable settings. Users can run timed work and break cycles, track their completed sessions, and adjust timer durations on the fly.

It is a single-page application with no backend. All state is in-memory.

---

## Goals

- Practice React hooks in a realistic, non-trivial context
- Produce a portfolio-ready productivity tool
- Keep scope small enough to complete in one day

---

## User Stories

1. As a user, I want to start a focus timer so I can track my work sessions
2. As a user, I want to pause and resume the timer so I can handle interruptions
3. As a user, I want the timer to automatically switch to a break when a session ends
4. As a user, I want to configure the work and break durations so the timer fits my preferences
5. As a user, I want to see a log of my completed sessions so I can track my productivity
6. As a user, I want to reset the timer to its initial state at any point

---

## Functional Requirements

### Timer

- Displays a countdown in MM:SS format
- Has three modes: **Work**, **Short Break**, **Long Break**
- After every 4 completed Work sessions, the next break is a Long Break instead of a Short Break
- Timer counts down in real time using a 1-second interval
- Timer can be **started**, **paused**, **resumed**, and **reset**
- When a Work session ends, the timer automatically transitions to the appropriate Break mode and starts counting down
- When a Break ends, the timer returns to Work mode but does **not** auto-start — it waits for the user to start it

### Settings

- User can configure:
  - Work duration (default: 25 minutes)
  - Short Break duration (default: 5 minutes)
  - Long Break duration (default: 15 minutes)
- Settings can be changed at any time, **including while the timer is running**
- When settings change while the timer is running, the current session restarts with the new duration
- Settings are displayed in a collapsible panel

### Session Log

- Every time a Work session completes (reaches 0), it is logged with:
  - Session number
  - Duration (the configured work duration at the time it completed)
  - Timestamp (HH:MM)
- Log displays most recent session first
- Log can be cleared by the user

---

## Out of Scope

- Persistence (localStorage, database)
- Notifications or sounds
- Authentication
- Mobile-specific layout (responsive is fine, but no native mobile features)

---

## Hook Practice Targets

These are the specific implementation challenges embedded in the requirements above. You are expected to encounter and solve each one:

| Challenge | Where it appears |
|---|---|
| **Stale closure** | The countdown interval captures an outdated value of `timeLeft` if not handled correctly |
| **Dependency array** | The settings change effect — syncing new durations to a running timer without causing unintended re-runs |
| **Infinite loop risk** | The auto-transition logic (Work → Break) inside a `useEffect` that watches `timeLeft` — naive implementations will loop |
| **useReducer vs useState** | Timer has complex, interdependent state (mode, status, timeLeft, sessionCount) that should use `useReducer`. UI state (settings panel open) is simple enough for `useState` |
