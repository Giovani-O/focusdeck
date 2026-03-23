import TimerDisplay from './TimerDisplay';
import TimerControls from './TimerControls';
import SettingsPanel from './SettingsPanel';
import SessionLog from './SessionLog';
import type { TimerSettings, SessionEntry } from '@/types/timer';

const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
};

const MOCK_SESSIONS: SessionEntry[] = [
  { id: 1, sessionNumber: 3, duration: 1500, completedAt: '14:32' },
  { id: 2, sessionNumber: 2, duration: 1500, completedAt: '13:45' },
  { id: 3, sessionNumber: 1, duration: 1500, completedAt: '09:15' },
];

export default function FocusDeck() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Timer Card */}
        <div className="p-6 bg-gray-900 rounded-2xl shadow-lg">
          <TimerDisplay timeLeft={1500} mode="work" />
          <TimerControls status="idle" />
          <SettingsPanel settings={DEFAULT_SETTINGS} />
        </div>

        {/* Log Card */}
        <div className="p-6 bg-gray-900 rounded-2xl shadow-lg">
          <SessionLog sessions={MOCK_SESSIONS} />
        </div>
      </div>
    </div>
  );
}
