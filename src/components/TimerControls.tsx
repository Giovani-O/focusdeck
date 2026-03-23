import type { TimerStatus } from "@/types/timer";

interface TimerControlsProps {
  status: TimerStatus;
  setTimerStatus: React.Dispatch<React.SetStateAction<TimerStatus>>;
}

const BUTTON_VARIANTS = {
  idle: "bg-violet-600 hover:bg-violet-500",
  running: "bg-yellow-600 hover:bg-yellow-500",
  paused: "bg-green-600 hover:bg-green-500",
};

const STATUS_LABELS = {
  idle: "Start",
  running: "Pause",
  paused: "Resume",
};

export default function TimerControls({
  status,
  setTimerStatus,
}: TimerControlsProps) {
  const handleActionClick = () => {
    switch (status) {
      case "idle":
        setTimerStatus("running");
        break;
      case "running":
        setTimerStatus("paused");
        break;
      case "paused":
        setTimerStatus("running");
        break;
    }
  };

  // handleResetClick tambem reseta o timer
  const handleResetClick = () => {
    setTimerStatus("idle");
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
