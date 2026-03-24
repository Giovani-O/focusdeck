'use client';

import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useTimer } from '@/hooks/useTimer';
import { toSeconds } from '@/hooks/utils';
import type { SessionEntry, TimerMode, TimerSettings } from '@/types/timer';
import SessionLog from './SessionLog';
import SettingsPanel from './SettingsPanel';
import TimerControls from './TimerControls';
import TimerDisplay from './TimerDisplay';

export default function FocusDeck() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<TimerSettings>({
    workDuration: toSeconds(25),
    shortBreakDuration: toSeconds(5),
    longBreakDuration: toSeconds(15),
  });

  const [log, setLog] = useLocalStorage<SessionEntry[]>(
    'focusdeck-session-log',
    [],
  );
  const [sessionCounter, setSessionCounter] = useLocalStorage<number>(
    'focusdeck-session-count',
    0,
  );

  const handleSessionComplete = (entry: {
    sessionNumber: number;
    mode: TimerMode;
    duration: number;
    completedAt: string;
  }) => {
    const newEntry: SessionEntry = {
      id: Date.now(),
      sessionNumber: sessionCounter + 1,
      mode: entry.mode,
      duration: entry.duration,
      completedAt: entry.completedAt,
    };
    setLog([newEntry, ...log]);
    setSessionCounter(sessionCounter + 1);
  };

  const { state, dispatch } = useTimer(settings, handleSessionComplete);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
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

        <div className="p-6 bg-gray-900 rounded-2xl shadow-lg">
          <SessionLog
            sessions={log}
            onClear={() => {
              setLog([]);
              setSessionCounter(0);
            }}
          />
        </div>
      </div>
    </div>
  );
}
