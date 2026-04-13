import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { TimerSettings } from '../types';

interface SettingsModalProps {
  visible: boolean;
  settings: TimerSettings;
  onChange: (settings: TimerSettings) => void;
  onClose: () => void;
}

const FIELDS: {
  key: keyof TimerSettings;
  label: string;
  suffix: string;
  min: number;
  max: number;
}[] = [
  { key: 'work', label: '专注时长', suffix: '分钟', min: 1, max: 120 },
  { key: 'shortBreak', label: '短休时长', suffix: '分钟', min: 1, max: 60 },
  { key: 'longBreak', label: '长休时长', suffix: '分钟', min: 1, max: 60 },
  { key: 'longBreakInterval', label: '长休间隔', suffix: '个番茄', min: 1, max: 12 },
];

export function SettingsModal({
  visible,
  settings,
  onChange,
  onClose,
}: SettingsModalProps) {
  const update = (key: keyof TimerSettings, value: number) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>⚙️ 计时设置</Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.grid}>
            {FIELDS.map((f) => (
              <View key={f.key} style={styles.field}>
                <Text style={styles.label}>{f.label}</Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    style={styles.input}
                    keyboardType="number-pad"
                    value={String(settings[f.key])}
                    onChangeText={(v) => {
                      const n = parseInt(v) || f.min;
                      update(f.key, Math.min(f.max, Math.max(f.min, n)));
                    }}
                    selectTextOnFocus
                  />
                  <Text style={styles.suffix}>{f.suffix}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.saveBtnText}>完成</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  closeBtn: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  field: {
    width: '46%',
  },
  label: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 40,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    padding: 0,
  },
  suffix: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  saveBtn: {
    marginTop: 24,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});
