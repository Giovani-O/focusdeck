import type { TimerStatus } from '@/types/timer';

interface TimerControlsProps {
  status: TimerStatus;
}

const BUTTON_VARIANTS = {
  idle: 'bg-violet-600 hover:bg-violet-500',
  running: 'bg-yellow-600 hover:bg-yellow-500',
  paused: 'bg-green-600 hover:bg-green-500',
};

const STATUS_LABELS = {
  idle: 'Start',
  running: 'Pause',
  paused: 'Resume',
};

export default function TimerControls({ status }: TimerControlsProps) {
  return (
    <div className="flex justify-center gap-3 mt-6">
      <button
        type="button"
        className={`px-6 py-2 rounded-lg font-semibold text-white transition-colors ${BUTTON_VARIANTS[status]}`}
      >
        {STATUS_LABELS[status]}
      </button>
      <button
        type="button"
        className="px-6 py-2 rounded-lg font-semibold bg-gray-700 hover:bg-gray-600 text-white transition-colors"
      >
        Reset
      </button>
    </div>
  );
}
