import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useUserStore } from '../store/userStore';
import { startTimer } from '../services/timer';
import { sortTasks } from '../utils/sortTasks';

export default function TaskCard({ task }) {
  const { tasks, setTasks, setActiveTaskId } = useUserStore();

  const startTask = (id) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, isStarted: true } : t
    );
    setTasks(sortTasks(updated));
    setActiveTaskId(id);
    startTimer();
  };

  return (
    <View style={styles.card}>
      <Text style={styles.text}>
        {task.title} - <Text style={styles[`priority${task.priority}`]}>{task.priority}</Text>
      </Text>

      {task.isCompleted ? (
        <Text style={styles.completed}>✅ Done</Text>
      ) : !task.isStarted ? (
        <TouchableOpacity style={styles.button} onPress={() => startTask(task.id)}>
          <Text style={styles.buttonText}>▶ Start</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.locked}>🔒 Started</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 10 },
  text: { fontSize: 16 },
  button: {
    marginTop: 10, backgroundColor: '#00cc66', padding: 6, borderRadius: 6, alignSelf: 'flex-start',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  locked: { marginTop: 10, color: 'gray', fontStyle: 'italic' },
  completed: { marginTop: 10, color: 'green', fontStyle: 'italic' },
  priorityHigh: { color: 'red', fontWeight: 'bold' },
  priorityMedium: { color: 'orange' },
  priorityLow: { color: 'green' },
});
