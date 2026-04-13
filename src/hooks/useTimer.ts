import { useState, useEffect, useRef, useCallback } from 'react';
import { TimerMode, TimerSettings } from '../types';

const DEFAULT_SETTINGS: TimerSettings = {
  work: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
};

export function useTimer(
  onPomodoroComplete?: () => void,
) {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SETTINGS.work * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_SETTINGS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completedRef = useRef(0);

  const totalTime = settings[mode] * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const switchMode = useCallback(
    (newMode: TimerMode) => {
      setMode(newMode);
      setTimeLeft(settings[newMode] * 60);
      setIsRunning(false);
    },
    [settings],
  );

  const reset = useCallback(() => {
    setTimeLeft(settings[mode] * 60);
    setIsRunning(false);
  }, [settings, mode]);

  const skip = useCallback(() => {
    if (mode === 'work') {
      const nextIsLong =
        (completedRef.current + 1) % settings.longBreakInterval === 0;
      switchMode(nextIsLong ? 'longBreak' : 'shortBreak');
    } else {
      switchMode('work');
    }
  }, [mode, settings.longBreakInterval, switchMode]);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          if (mode === 'work') {
            completedRef.current += 1;
            setCompletedPomodoros(completedRef.current);
            onPomodoroComplete?.();
            const nextIsLong =
              completedRef.current % settings.longBreakInterval === 0;
            const nextMode: TimerMode = nextIsLong ? 'longBreak' : 'shortBreak';
            setMode(nextMode);
            return settings[nextMode] * 60;
          } else {
            setMode('work');
            return settings.work * 60;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode, settings, onPomodoroComplete]);

  return {
    mode,
    setMode: switchMode,
    timeLeft,
    setTimeLeft,
    totalTime,
    progress,
    isRunning,
    setIsRunning,
    completedPomodoros,
    soundEnabled,
    setSoundEnabled,
    reset,
    skip,
    settings,
    setSettings,
  };
}
