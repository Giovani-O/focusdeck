# Project Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up the FocusDeck project with Next.js 15, TypeScript, Tailwind CSS, and Biome for linting/formatting.

**Architecture:** Initialize Next.js project with create-next-app, then configure Biome for linting and formatting.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Biome

---

### Task 1: Initialize Next.js Project

**Files:**
- Create: All project files via `npx create-next-app@latest`

- [ ] **Step 1: Run create-next-app**

Run:
```bash
cd /home/murasaki/Documents/projects/focusdeck && npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-turbopack --import-alias "@/*" -y
```

Expected: Project scaffolded with TypeScript, Tailwind, ESLint, App Router

---

### Task 2: Setup Biome

**Files:**
- Create: `biome.json`

- [ ] **Step 1: Install Biome**

Run:
```bash
npm install -D @biomejs/biome
```

- [ ] **Step 2: Initialize Biome config**

Run:
```bash
npx biome init
```

- [ ] **Step 3: Configure Biome for linting + formatting**

Modify `biome.json`:
```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.0/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 80
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single"
    }
  }
}
```

- [ ] **Step 4: Add Biome scripts to package.json**

Modify `package.json`, add to scripts:
```json
"lint": "biome lint .",
"format": "biome format --write ."
```

---

### Task 3: Create Hello World Page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace page content with hello world**

Modify `src/app/page.tsx`:
```tsx
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold">Hello World</h1>
    </main>
  )
}
```

- [ ] **Step 2: Run lint to verify setup**

Run:
```bash
npm run lint
```

Expected: No errors

- [ ] **Step 3: Verify dev server starts**

Run:
```bash
npm run dev
```

Expected: Dev server starts successfully (can cancel after verification)

---

### Task 4: Create .gitignore

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Ensure proper gitignore exists**

The create-next-app template should have already created one. Verify it exists and contains proper entries for Next.js, Node, and Biome.

---

### Task 5: Commit

- [ ] **Step 1: Stage and commit**

```bash
git add .
git commit -m "feat: project setup with Next.js, TypeScript, Tailwind, and Biome"
```
