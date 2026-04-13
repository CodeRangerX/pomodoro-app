import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Task, TimerSettings } from '../types';

interface TaskListProps {
  tasks: Task[];
  onAddTask: (text: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export function TaskList({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}: TaskListProps) {
  const [newTask, setNewTask] = useState('');

  const handleAdd = () => {
    const text = newTask.trim();
    if (!text) return;
    onAddTask(text);
    setNewTask('');
  };

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📋 任务列表</Text>
        <Text style={styles.badge}>{activeTasks.length}</Text>
      </View>

      {/* Add task */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="添加新任务..."
          placeholderTextColor="#9CA3AF"
          value={newTask}
          onChangeText={setNewTask}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={styles.addBtn}
          onPress={handleAdd}
          activeOpacity={0.8}
        >
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Task list */}
      {tasks.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>暂无任务</Text>
          <Text style={styles.emptySub}>添加任务开始专注吧</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          renderItem={({ item: task }) => (
            <TaskItem
              task={task}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
            />
          )}
          ItemSeparatorComponent={() => (
            <View style={styles.separator} />
          )}
        />
      )}
    </View>
  );
}

function TaskItem({
  task,
  onToggle,
  onDelete,
}: {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <TouchableOpacity
      onPress={() => onToggle(task.id)}
      activeOpacity={0.7}
      style={styles.taskRow}
    >
      <View
        style={[
          styles.checkbox,
          task.completed && styles.checkboxDone,
        ]}
      >
        {task.completed && <Text style={styles.checkMark}>✓</Text>}
      </View>
      <View style={styles.taskContent}>
        <Text
          style={[
            styles.taskText,
            task.completed && styles.taskTextDone,
          ]}
          numberOfLines={1}
        >
          {task.text}
        </Text>
        {task.pomodoros > 0 && (
          <Text style={styles.pomodoroCount}>
            {'🍅'.repeat(Math.min(task.pomodoros, 8))}
          </Text>
        )}
      </View>
      <TouchableOpacity
        onPress={() => onDelete(task.id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.deleteBtn}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flex: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  badge: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  emptySub: {
    fontSize: 12,
    color: '#D1D5DB',
    marginTop: 4,
  },
  list: {
    maxHeight: 280,
  },
  listContent: {
    paddingBottom: 4,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#F3F4F6',
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  checkMark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  taskContent: {
    flex: 1,
    gap: 2,
  },
  taskText: {
    fontSize: 14,
    color: '#1F2937',
  },
  taskTextDone: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  pomodoroCount: {
    fontSize: 12,
  },
  deleteBtn: {
    fontSize: 14,
    color: '#D1D5DB',
    fontWeight: '500',
  },
});
