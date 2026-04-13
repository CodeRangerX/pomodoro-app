import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { TimerMode } from '../types';

const MODES: {
  key: TimerMode;
  label: string;
  emoji: string;
}[] = [
  { key: 'work', label: '专注', emoji: '🍅' },
  { key: 'shortBreak', label: '短休', emoji: '☕' },
  { key: 'longBreak', label: '长休', emoji: '🌴' },
];

const MODE_COLORS: Record<TimerMode, string> = {
  work: '#EF4444',
  shortBreak: '#22C55E',
  longBreak: '#3B82F6',
};

const MODE_BG_ACTIVE: Record<TimerMode, string> = {
  work: '#FEE2E2',
  shortBreak: '#DCFCE7',
  longBreak: '#DBEAFE',
};

interface ModeSelectorProps {
  mode: TimerMode;
  onModeChange: (mode: TimerMode) => void;
}

export function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  return (
    <View style={styles.container}>
      {MODES.map((m) => {
        const isActive = mode === m.key;
        return (
          <TouchableOpacity
            key={m.key}
            onPress={() => onModeChange(m.key)}
            style={[
              styles.tab,
              isActive && { backgroundColor: MODE_BG_ACTIVE[m.key] },
            ]}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 14 }}>{m.emoji}</Text>
            <Text
              style={[
                styles.label,
                isActive && { color: MODE_COLORS[m.key] },
              ]}
            >
              {m.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export { MODE_COLORS };

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
  },
});
