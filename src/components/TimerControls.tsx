import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

interface TimerControlsProps {
  isRunning: boolean;
  color: string;
  onToggle: () => void;
  onReset: () => void;
  onSkip: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function TimerControls({
  isRunning,
  color,
  onToggle,
  onReset,
  onSkip,
  soundEnabled,
  onToggleSound,
}: TimerControlsProps) {
  return (
    <View style={styles.container}>
      <CircleBtn onPress={onReset} size={48} bg="#F3F4F6" emoji="↺" />
      <TouchableOpacity
        onPress={onToggle}
        activeOpacity={0.85}
        style={[styles.playBtn, { backgroundColor: isRunning ? '#1F2937' : color }]}
      >
        <Text style={styles.playText}>{isRunning ? '⏸' : '▶'}</Text>
      </TouchableOpacity>
      <CircleBtn onPress={onSkip} size={48} bg="#F3F4F6" emoji="⏭" />
      <CircleBtn
        onPress={onToggleSound}
        size={48}
        bg="#F3F4F6"
        emoji={soundEnabled ? '🔊' : '🔇'}
      />
    </View>
  );
}

function CircleBtn({
  onPress,
  size,
  bg,
  emoji,
}: {
  onPress: () => void;
  size: number;
  bg: string;
  emoji: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.circleBtn, { width: size, height: size, backgroundColor: bg }]}
    >
      <Text style={styles.circleEmoji}>{emoji}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  playText: {
    fontSize: 24,
    color: '#fff',
  },
  circleBtn: {
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleEmoji: {
    fontSize: 20,
  },
});
