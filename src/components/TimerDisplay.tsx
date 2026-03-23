import type { TimerMode } from '@/types/timer';

interface TimerDisplayProps {
  timeLeft: number;
  mode: TimerMode;
}

const MODE_LABELS: Record<TimerMode, string> = {
  work: 'FOCUS',
  'short-break': 'SHORT BREAK',
  'long-break': 'LONG BREAK',
};

const MODE_COLORS: Record<TimerMode, string> = {
  work: 'text-violet-400',
  'short-break': 'text-sky-400',
  'long-break': 'text-green-400',
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function TimerDisplay({ timeLeft, mode }: TimerDisplayProps) {
  return (
    <div className="text-center">
      <div className={`text-6xl font-bold tabular-nums ${MODE_COLORS[mode]}`}>
        {formatTime(timeLeft)}
      </div>
      <div
        className={`mt-2 text-sm uppercase tracking-widest ${MODE_COLORS[mode]}`}
      >
        {MODE_LABELS[mode]}
      </div>
    </div>
  );
}
