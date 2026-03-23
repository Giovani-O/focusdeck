import type { SessionEntry } from '@/types/timer';

interface SessionLogProps {
  sessions: SessionEntry[];
}

function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60);
  return `${mins} min`;
}

export default function SessionLog({ sessions }: SessionLogProps) {
  return (
    <div className="py-4 bg-gray-900 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm uppercase tracking-widest text-gray-400">
          Session Log
        </h3>
        <button
          type="button"
          className="text-xs text-gray-500 hover:text-red-400 transition-colors"
        >
          Clear
        </button>
      </div>
      {sessions.length === 0 ? (
        <p className="text-gray-600 text-sm text-center py-4">
          No sessions completed yet
        </p>
      ) : (
        <ul className="space-y-2">
          {sessions.map((session) => (
            <li
              key={session.id}
              className="flex items-center justify-between py-2 px-3 bg-gray-800 rounded-lg"
            >
              <span className="text-violet-400 font-semibold">
                #{session.sessionNumber}
              </span>
              <span className="text-gray-400 text-sm">
                {formatDuration(session.duration)}
              </span>
              <span className="text-gray-500 text-sm">
                {session.completedAt}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
