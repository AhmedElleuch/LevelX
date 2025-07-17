import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useUserStore } from '../store/userStore';
import { startTimer, startProductionTimer } from '../services/timer';
import { sortTasks } from '../utils/sortTasks';
import PriorityBadge from './PriorityBadge';

export default function TaskCard({ task }) {
  const { tasks, setTasks, setActiveTaskId, removeTask } = useUserStore();

  const startTask = (id) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, isStarted: true } : t
    );
    setTasks(sortTasks(updated));
    setActiveTaskId(id);
    startProductionTimer();
    startTimer();
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.text}>{task.title}</Text>
        <PriorityBadge level={task.priority} />
      </View>

      {task.isCompleted ? (
        <Text style={styles.completed}>✅ Done</Text>
      ) : !task.isStarted ? (
        <TouchableOpacity style={styles.button} onPress={() => startTask(task.id)}>
          <Text style={styles.buttonText}>▶ Start</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.locked}>🔒 Started</Text>
      )}

      <TouchableOpacity style={styles.deleteButton} onPress={() => removeTask(task.id)}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 10 },
  text: { fontSize: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  button: {
    marginTop: 10, backgroundColor: '#00cc66', padding: 6, borderRadius: 6, alignSelf: 'flex-start',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  locked: { marginTop: 10, color: 'gray', fontStyle: 'italic' },
  completed: { marginTop: 10, color: 'green', fontStyle: 'italic' },
  deleteButton: { marginTop: 8, alignSelf: 'flex-start' },
  deleteText: { color: '#ff5555' },
  priorityHigh: { color: 'red', fontWeight: 'bold' },
  priorityMedium: { color: 'orange' },
  priorityLow: { color: 'green' },
});
