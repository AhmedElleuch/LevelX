import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import { useUserStore } from '../store/userStore';
import { startTimer } from '../services/focusTimer';
import { startProductionTimer } from '../services/productionTimer';
import { mapTasks } from '../utils/taskTree';
import PriorityBadge from './PriorityBadge';
import TaskDetails from './TaskDetails';

const TaskCard = ({ task, onLongPress, drag, isActive, onPress, onOpenSubtasks, testID }) => {
  const { colors } = useTheme();
  const [showDetails, setShowDetails] = useState(false);
  const tasks = useUserStore((s) => s.tasks);
  const setTasks = useUserStore((s) => s.setTasks);
  const setActiveTaskId = useUserStore((s) => s.setActiveTaskId);
  const removeTask = useUserStore((s) => s.removeTask);
  const completeTask = useUserStore((s) => s.completeTask);
  const isTimerRunning = useUserStore((s) => s.isTimerRunning);
  const activeTaskId = useUserStore((s) => s.activeTaskId);
  const toggleTaskCompletion = useUserStore((s) => s.toggleTaskCompletion);

  const startTask = (id) => {
    const updated = mapTasks(tasks, (t) =>
      t.id === id
        ? { ...t, isStarted: true, dateStarted: new Date().toISOString() }
        : { ...t, isStarted: false }
    );
    setTasks(updated);
    setActiveTaskId(id);
    if (!isTimerRunning) {
      startProductionTimer();
      startTimer();
    } else if (!useUserStore.getState().isProductionActive) {
      startProductionTimer();
    }
    console.log('Task started', { id });
  };

  const resumeTask = (id) => {
    setActiveTaskId(id);
    if (!isTimerRunning) {
      startProductionTimer();
      startTimer();
    }
    console.log('Task resumed', { id });
  };

  const right = () => (
    <TouchableOpacity
      style={styles.swipeButton}
      onPress={() => {
        console.log('Task removed', { id: task.id });
        removeTask(task.id);
      }}
    >
      <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity>
  );

  const left = () => (
    <TouchableOpacity
      style={styles.swipeButton}
      onPress={() => {
        console.log('Task completed', { id: task.id });
        completeTask(task.id);
      }}
    >
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
        onLongPress={onLongPress}
        onPress={() => {
          if (onPress) {
            onPress();
          } else if (isTimerRunning) {
            toggleTaskCompletion(task.id);
          }
        }}
        testID={testID}
      >
        <View style={styles.header}>
          <Text style={[styles.text, { color: colors.text }]}>{task.title}</Text>
          <PriorityBadge level={task.priority} />
          <TouchableOpacity onPress={() => setShowDetails(true)} style={styles.menu}>
            <Text style={styles.dragText}>⋮</Text>
          </TouchableOpacity>
          {drag && (
            <TouchableOpacity
              onLongPress={drag}
              style={styles.dragHandle}
              testID='drag-handle'
            >
              <Text style={styles.dragText}>≡</Text>
            </TouchableOpacity>
          )}
        </View>
        {onOpenSubtasks && (
          <TouchableOpacity
            onPress={onOpenSubtasks}
            style={styles.subtaskBtn}
            testID='open-subtasks'
          >
            <Text style={styles.subtaskText}>Subtasks</Text>
          </TouchableOpacity>
        )}

        {task.isCompleted ? (
          <Text style={styles.completed}>✅ Done</Text>
        ) : !task.isStarted ? (
          <TouchableOpacity style={styles.button} onPress={() => startTask(task.id)}>
            <Text style={styles.buttonText}>▶ Start</Text>
          </TouchableOpacity>
        ) : !activeTaskId && !isTimerRunning ? (
          <TouchableOpacity style={styles.button} onPress={() => resumeTask(task.id)}>
            <Text style={styles.buttonText}>▶ Resume</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.locked}>🔒 Started</Text>
        )}
      </TouchableOpacity>
      <TaskDetails visible={showDetails} task={task} onClose={() => setShowDetails(false)} />
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
  dragHandle: { marginLeft: 6, padding: 4 },
  dragText: { color: '#999' },
  menu: { marginLeft: 6, padding: 4 },
  subtaskBtn: { marginTop: 10, alignSelf: 'flex-start' },
  subtaskText: { color: '#00aaff', fontWeight: 'bold' },
});

export default TaskCard;


