'use client';

import { useState } from 'react';
import type { TimerSettings } from '@/types/timer';

interface SettingsPanelProps {
  settings: TimerSettings;
}

function toMinutes(seconds: number): number {
  return Math.round(seconds / 60);
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
        isOpen ? 'rotate-180' : ''
      }`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <title>{isOpen ? 'Collapse settings' : 'Expand settings'}</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}

export default function SettingsPanel({ settings }: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-6 p-4 bg-gray-800 rounded-lg">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-sm uppercase tracking-widest text-gray-400 cursor-pointer hover:text-gray-300 transition-colors"
      >
        <span>Settings</span>
        <ChevronIcon isOpen={isOpen} />
      </button>

      {isOpen && (
        <div className="space-y-4 mt-4">
          <div>
            <label
              htmlFor="work-duration"
              className="block text-xs text-gray-400 mb-1"
            >
              Work Duration (min)
            </label>
            <input
              id="work-duration"
              type="number"
              defaultValue={toMinutes(settings.workDuration)}
              min={1}
              max={60}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label
              htmlFor="short-break-duration"
              className="block text-xs text-gray-400 mb-1"
            >
              Short Break (min)
            </label>
            <input
              id="short-break-duration"
              type="number"
              defaultValue={toMinutes(settings.shortBreakDuration)}
              min={1}
              max={30}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label
              htmlFor="long-break-duration"
              className="block text-xs text-gray-400 mb-1"
            >
              Long Break (min)
            </label>
            <input
              id="long-break-duration"
              type="number"
              defaultValue={toMinutes(settings.longBreakDuration)}
              min={1}
              max={60}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            type="button"
            className="w-full px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-semibold transition-colors"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
