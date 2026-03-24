import { useEffect, useReducer, useRef } from 'react';
import type { TimerMode, TimerSettings, TimerStatus } from '@/types/timer';

export interface TimerState {
  mode: TimerMode;
  status: TimerStatus;
  timeLeft: number;
  sessionCount: number;
}

export type TimerAction =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'RESET'; payload: TimerSettings }
  | { type: 'TICK' }
  | { type: 'COMPLETE_SESSION'; payload: TimerSettings }
  | { type: 'APPLY_SETTINGS'; payload: TimerSettings };

/**
 *
 * @param settings
 * @returns TimerState - the initial state for the timer, based on the provided settings
 */
function getInitialState(settings: TimerSettings): TimerState {
  return {
    mode: 'work',
    status: 'idle',
    timeLeft: settings.workDuration,
    sessionCount: 0,
  };
}

/**
 *
 * @param state
 * @param action
 * @returns TimerState - the updated state for the timer, based on the provided action
 */
function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'START':
      return { ...state, status: 'running' };
    case 'PAUSE':
      return { ...state, status: 'paused' };
    case 'RESUME':
      return { ...state, status: 'running' };
    case 'RESET':
      return getInitialState(action.payload);
    case 'TICK':
      return { ...state, timeLeft: Math.max(0, state.timeLeft - 1) };
    case 'COMPLETE_SESSION': {
      const isWork = state.mode === 'work';
      if (isWork) {
        const newSessionCount = state.sessionCount + 1;
        const isLongBreak = newSessionCount % 4 === 0;
        return {
          mode: isLongBreak ? 'long-break' : 'short-break',
          status: 'paused',
          timeLeft: isLongBreak
            ? action.payload.longBreakDuration
            : action.payload.shortBreakDuration,
          sessionCount: newSessionCount,
        };
      } else {
        return {
          mode: 'work',
          status: 'idle',
          timeLeft: action.payload.workDuration,
          sessionCount: state.sessionCount,
        };
      }
    }
    case 'APPLY_SETTINGS': {
      return {
        ...getInitialState(action.payload),
        sessionCount: state.sessionCount,
      };
    }
    default:
      return state;
  }
}

export function useTimer(settings: TimerSettings) {
  const [state, dispatch] = useReducer(timerReducer, settings, getInitialState);

  useEffect(() => {
    if (state.status !== 'running') return;

    const interval = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.status]);

  useEffect(() => {
    if (state.timeLeft === 0 && state.status === 'running') {
      dispatch({ type: 'COMPLETE_SESSION', payload: settings });
    }
  }, [state.timeLeft, state.status, settings]);

  const prevSettingsRef = useRef<TimerSettings | null>(null);

  useEffect(() => {
    if (
      prevSettingsRef.current === null ||
      prevSettingsRef.current.workDuration !== settings.workDuration ||
      prevSettingsRef.current.shortBreakDuration !==
        settings.shortBreakDuration ||
      prevSettingsRef.current.longBreakDuration !== settings.longBreakDuration
    ) {
      prevSettingsRef.current = settings;
      dispatch({ type: 'APPLY_SETTINGS', payload: settings });
    }
  }, [settings]);

  return { state, dispatch };
}
