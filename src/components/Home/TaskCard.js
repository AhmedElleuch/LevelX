import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import { useUserStore } from '../../store/userStore';
import { startTimer } from '../../services/focusTimer';
import { startProductionTimer } from '../../services/productionTimer';
import { mapTasks } from '../../utils/taskTree';
import PriorityBadge from './PriorityBadge';
import { navigate } from '../../navigation/RootNavigation';

const TaskCard = ({ task, onLongPress, drag, isActive, onPress, onOpenSubtasks, testID, type }) => {
  const { colors } = useTheme();
  const tasks = useUserStore((s) => s.tasks);
  const setTasks = useUserStore((s) => s.setTasks);
  const setActiveTaskId = useUserStore((s) => s.setActiveTaskId);
  const completeTaskAction = useUserStore((s) => s.completeTask);
  const completeHabit = useUserStore((s) => s.completeHabit);
  const completeSkill = useUserStore((s) => s.completeSkill);
  const removeTaskAction = useUserStore((s) => s.removeTask);
  const removeHabit = useUserStore((s) => s.removeHabit);
  const removeSkill = useUserStore((s) => s.removeSkill);
  const undoTaskAction = useUserStore((s) => s.undoTask);
  const undoHabit = useUserStore((s) => s.undoHabit);
  const undoSkill = useUserStore((s) => s.undoSkill);
  const isTimerRunning = useUserStore((s) => s.isTimerRunning);


  const completeTask =
    {
      project: completeTaskAction,
      habit: completeHabit,
      skill: completeSkill,
    }[type] || completeTaskAction;

  const removeTask =
    {
      project: removeTaskAction,
      habit: removeHabit,
      skill: removeSkill,
    }[type] || removeTaskAction;

  const undoTask =
    {
      project: undoTaskAction,
      habit: undoHabit,
      skill: undoSkill,
    }[type] || undoTaskAction;

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
  };
// Handlers
const handleMenuPress = () => navigate('Task', { id: task.id, type });

  const renderRightActions = () => (
    <TouchableOpacity style={styles.swipeButton} onPress={() => removeTask(task.id)}>
      <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity>
  );

  const renderLeftActions = () => (
    <TouchableOpacity
      style={styles.swipeButton}
      onPress={() => (task.isCompleted ? undoTask(task.id) : completeTask(task.id))}
    >
      <Text style={styles.completeText}>{task.isCompleted ? 'Undone' : 'Done'}</Text>
    </TouchableOpacity>
  );

  return (
    <Swipeable renderRightActions={renderRightActions} renderLeftActions={renderLeftActions}>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
          isActive && styles.dragging,
        ]}
        testID={testID}
      >
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <PriorityBadge level={task.priority} />
            <Text style={[styles.text, { color: colors.text }]}>{task.title}</Text>
            {onOpenSubtasks && (
              <TouchableOpacity onPress={onOpenSubtasks} style={styles.subtaskIcon} testID='open-subtasks'>
                <MaterialIcons name='subdirectory-arrow-right' size={20} color='#00aaff' />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity onPress={handleMenuPress} style={styles.menu}>
            <Text style={styles.menuText}>⋮</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          {task.isCompleted ? (
            <Text style={styles.completed}>✔ Done</Text>
          ) : task.isLocked || task.isStarted ? (
            <Text style={styles.locked}>🔒 Locked</Text>
          ) : (
            <TouchableOpacity style={styles.button} onPress={() => startTask(task.id)}>
              <Text style={styles.buttonText}>▶ Start</Text>
            </TouchableOpacity>
          )}
          {drag && (
            <TouchableOpacity onLongPress={drag} style={styles.dragHandle} testID="drag-handle">
              <Text style={styles.dragText}>≡</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Swipeable>
  );
};

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
  swipeButton: { justifyContent: 'center', paddingHorizontal: 20 },
  completeText: { color: 'green' },
  deleteText: { color: '#ff3333' },
  dragging: { opacity: 0.7 },
  dragHandle: { marginLeft: 6, padding: 8 },
  dragText: { color: '#999', fontSize: 24 },
  menu: { marginLeft: 6, padding: 8 },
  menuText: { color: '#999', fontSize: 24 },
  subtaskIcon: { marginHorizontal: 6 },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
});

export default TaskCard;


