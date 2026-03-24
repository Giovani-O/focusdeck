'use client';

import { useState } from 'react';
import { useTimer } from '@/hooks/useTimer';
import { toSeconds } from '@/hooks/utils';
import type { SessionEntry, TimerSettings } from '@/types/timer';
import SessionLog from './SessionLog';
import SettingsPanel from './SettingsPanel';
import TimerControls from './TimerControls';
import TimerDisplay from './TimerDisplay';

const MOCK_SESSIONS: SessionEntry[] = [
  { id: 1, sessionNumber: 3, duration: 1500, completedAt: '14:32' },
  { id: 2, sessionNumber: 2, duration: 1500, completedAt: '13:45' },
  { id: 3, sessionNumber: 1, duration: 1500, completedAt: '09:15' },
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
          <SessionLog sessions={MOCK_SESSIONS} />
        </div>
      </div>
    </div>
  );
}
