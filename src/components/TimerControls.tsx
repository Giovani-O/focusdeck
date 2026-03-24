import type { TimerAction } from '@/hooks/useTimer';
import type { TimerStatus } from '@/types/timer';

interface TimerControlsProps {
  status: TimerStatus;
  dispatch: React.Dispatch<TimerAction>;
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

export default function TimerControls({
  status,
  dispatch,
}: TimerControlsProps) {
  const handleActionClick = () => {
    switch (status) {
      case 'idle':
        dispatch({ type: 'START' });
        break;
      case 'running':
        dispatch({ type: 'PAUSE' });
        break;
      case 'paused':
        dispatch({ type: 'RESUME' });
        break;
    }
  };

  const handleResetClick = () => {
    dispatch({
      type: 'RESET',
      payload: {
        workDuration: 1500,
        shortBreakDuration: 300,
        longBreakDuration: 900,
      },
    });
  };

  return (
    <div className="flex justify-center gap-3 mt-6">
      <button
        type="button"
        className={`px-6 py-2 rounded-lg font-semibold text-white cursor-pointer transition-colors ${BUTTON_VARIANTS[status]}`}
        onClick={handleActionClick}
      >
        {STATUS_LABELS[status]}
      </button>
      <button
        type="button"
        className="px-6 py-2 rounded-lg font-semibold bg-gray-700 cursor-pointer hover:bg-gray-600 text-white transition-colors"
        onClick={handleResetClick}
      >
        Reset
      </button>
    </div>
  );
}
