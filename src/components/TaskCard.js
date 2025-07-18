import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import { useUserStore } from '../store/userStore';
import { startTimer, startProductionTimer } from '../services/timer';
import { sortTasks } from '../utils/sortTasks';
import PriorityBadge from './PriorityBadge';

const TaskCard = ({ task, onLongPress, drag, isActive }) => {
  const { colors } = useTheme();
  const { tasks, setTasks, setActiveTaskId, removeTask, completeTask } =
    useUserStore();

  const startTask = (id) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, isStarted: true } : t
    );
    setTasks(sortTasks(updated));
    setActiveTaskId(id);
    startProductionTimer();
    startTimer();
  };

    const right = () => (
    <TouchableOpacity style={styles.swipeButton} onPress={() => removeTask(task.id)}>
      <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity>
  );

  const left = () => (
    <TouchableOpacity style={styles.swipeButton} onPress={() => completeTask(task.id)}>
      <Text style={styles.completeText}>Done</Text>
    </TouchableOpacity>
  );

  return (
    <Swipeable renderRightActions={right} renderLeftActions={left}>
      <TouchableOpacity
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
          isActive && styles.dragging,
        ]}
        onLongPress={drag || onLongPress}
      >
        <View style={styles.header}>
          <Text style={[styles.text, { color: colors.text }]}>{task.title}</Text>
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
      </TouchableOpacity>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
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
  swipeButton: { justifyContent: 'center', paddingHorizontal: 20 },
  completeText: { color: 'green' },
  dragging: { opacity: 0.7 },
});

export default TaskCard;


