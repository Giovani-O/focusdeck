# AGENTS.md — FocusDeck

## Project Overview

FocusDeck is a Pomodoro-style focus timer with session tracking and configurable settings. It's a React hooks practice project built with Next.js 15, TypeScript, and Tailwind CSS.

## Documentation

### Core Docs (`docs/core/`)

- **PRD.md** — Product requirements, user stories, and functional requirements
- **SDD.md** — Technical specification, project structure, state architecture, and implementation details

Consult these files whenever adding a new feature to ensure alignment with established requirements.

### Specs (`docs/specs/`)

All spec files must be saved in this folder exclusively. Use the naming convention:
- `YYYY-MM-DD-<feature-name>-spec.md`

Example: `2026-03-23-static-components-spec.md`

### Plans (`docs/plans/`)

All implementation plan files should be saved in this folder. Use the naming convention:
- `YYYY-MM-DD-<feature-name>-implementation-plan.md`

Example: `2026-03-23-project-setup.md`

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- React hooks only (no external state library)

## Key Architecture Notes

- All timer logic lives in `hooks/useTimer.ts`
- Timer state uses `useReducer` (mode, status, timeLeft, sessionCount)
- UI state uses `useState` (settings, isSettingsOpen, log)
- Components are pure presentational where possible
