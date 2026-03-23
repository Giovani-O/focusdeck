"use client";

import { useState } from "react";
import TimerDisplay from "./TimerDisplay";
import TimerControls from "./TimerControls";
import SettingsPanel from "./SettingsPanel";
import SessionLog from "./SessionLog";
import type { SessionEntry, TimerSettings, TimerStatus } from "@/types/timer";
import { toSeconds } from "@/hooks/utils";

const MOCK_SESSIONS: SessionEntry[] = [
  { id: 1, sessionNumber: 3, duration: 1500, completedAt: "14:32" },
  { id: 2, sessionNumber: 2, duration: 1500, completedAt: "13:45" },
  { id: 3, sessionNumber: 1, duration: 1500, completedAt: "09:15" },
];

export default function FocusDeck() {
  // Estados simples, um único valor, useState é mais apropriado.
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<TimerSettings>({
    workDuration: toSeconds(25),
    shortBreakDuration: toSeconds(5),
    longBreakDuration: toSeconds(15),
  });

  const [timerStatus, setTimerStatus] = useState<TimerStatus>("idle");

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Timer Card */}
        <div className="p-6 bg-gray-900 rounded-2xl shadow-lg">
          <TimerDisplay timeLeft={1500} mode="work" />
          <TimerControls status={timerStatus} setTimerStatus={setTimerStatus} />
          <SettingsPanel
            isOpen={isSettingsOpen}
            setIsOpen={setIsSettingsOpen}
            settings={settings}
            setSettings={setSettings}
          />
        </div>

        {/* Log Card */}
        <div className="p-6 bg-gray-900 rounded-2xl shadow-lg">
          <SessionLog sessions={MOCK_SESSIONS} />
        </div>
      </div>
    </div>
  );
}
