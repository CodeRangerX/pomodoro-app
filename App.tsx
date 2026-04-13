import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { useTimer } from './src/hooks/useTimer';
import { loadTasks, saveTasks, loadSettings, saveSettings } from './src/hooks/useStorage';
import { TimerRing } from './src/components/TimerRing';
import { ModeSelector, MODE_COLORS } from './src/components/ModeSelector';
import { TimerControls } from './src/components/TimerControls';
import { TaskList } from './src/components/TaskList';
import { SettingsModal } from './src/components/SettingsModal';
import { playBeep, formatTime } from './src/utils/sound';
import { Task, TimerMode } from './src/types';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const prevPomodoroRef = React.useRef(0);

  const handlePomodoroComplete = useCallback(() => {
    playBeep();
    setTasks((prev) => {
      const active = prev.find((t) => !t.completed);
      if (active) {
        return prev.map((t) =>
          t.id === active.id
            ? { ...t, pomodoros: t.pomodoros + 1 }
            : t,
        );
      }
      return prev;
    });
  }, []);

  const timer = useTimer(handlePomodoroComplete);

  // Load persisted data
  useEffect(() => {
    (async () => {
      const [savedTasks, savedSettings] = await Promise.all([
        loadTasks(),
        loadSettings(),
      ]);
      if (savedTasks.length > 0) setTasks(savedTasks);
      if (savedSettings) {
        timer.setSettings(savedSettings);
        timer.setMode('work');
      }
      setLoaded(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist tasks
  useEffect(() => {
    if (loaded) saveTasks(tasks);
  }, [tasks, loaded]);

  // Persist settings
  useEffect(() => {
    if (loaded) saveSettings(timer.settings);
  }, [timer.settings, loaded]);

  // Update timeLeft when settings change
  useEffect(() => {
    if (loaded) {
      timer.setTimeLeft(timer.settings[timer.mode] * 60);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.settings]);

  const handleSettingsChange = useCallback(
    (newSettings: typeof timer.settings) => {
      timer.setSettings(newSettings);
    },
    [timer],
  );

  const addTask = useCallback((text: string) => {
    setTasks((prev) => [
      { id: Date.now().toString(), text, completed: false, pomodoros: 0 },
      ...prev,
    ]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  if (!loaded) {
    return (
      <SafeAreaView style={[styles.container, styles.loading]}>
        <Text style={styles.loadingText}>🍅 加载中...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Platform.OS === 'android' ? '#FAFAFA' : undefined}
      />
      <View style={styles.content}>
        {/* Header */}
        <Text style={styles.headerTitle}>🍅 番茄钟</Text>

        {/* Mode Selector */}
        <ModeSelector mode={timer.mode} onModeChange={timer.setMode} />

        {/* Timer Ring */}
        <View style={styles.ringWrap}>
          <TimerRing
            progress={timer.progress}
            color={MODE_COLORS[timer.mode]}
          >
            <Text style={styles.timeText}>{formatTime(timer.timeLeft)}</Text>
            <Text
              style={[
                styles.modeLabel,
                { color: MODE_COLORS[timer.mode] },
              ]}
            >
              {timer.mode === 'work'
                ? '专注模式'
                : timer.mode === 'shortBreak'
                  ? '短休模式'
                  : '长休模式'}
            </Text>
          </TimerRing>
        </View>

        {/* Controls */}
        <TimerControls
          isRunning={timer.isRunning}
          color={MODE_COLORS[timer.mode]}
          onToggle={() => timer.setIsRunning(!timer.isRunning)}
          onReset={timer.reset}
          onSkip={timer.skip}
          soundEnabled={timer.soundEnabled}
          onToggleSound={() =>
            timer.setSoundEnabled(!timer.soundEnabled)
          }
        />

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statEmoji}>🍅</Text>
            <Text style={styles.statText}>{timer.completedPomodoros} 个番茄</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statEmoji}>✅</Text>
            <Text style={styles.statText}>{completedTasks.length} 已完成</Text>
          </View>
          <TouchableOpacity onPress={() => setShowSettings(true)} hitSlop={8}>
            <Text style={styles.statEmoji}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Task List */}
        <TaskList
          tasks={tasks}
          onAddTask={addTask}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
        />

        {/* Settings Modal */}
        <SettingsModal
          visible={showSettings}
          settings={timer.settings}
          onChange={handleSettingsChange}
          onClose={() => setShowSettings(false)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#9CA3AF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 20,
  },
  ringWrap: {
    alignItems: 'center',
    marginVertical: 24,
  },
  timeText: {
    fontSize: 56,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    color: '#111827',
    letterSpacing: 2,
  },
  modeLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginVertical: 20,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statEmoji: {
    fontSize: 16,
  },
  statText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
});
