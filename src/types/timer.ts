export type TimerMode = 'work' | 'short-break' | 'long-break';

export type TimerStatus = 'idle' | 'running' | 'paused';

export interface TimerSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
}

export interface SessionEntry {
  id: number;
  sessionNumber: number;
  mode: TimerMode;
  duration: number;
  completedAt: string;
}
