import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
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
  const toggleTaskLockAction = useUserStore((s) => s.toggleTaskLock);
  const toggleHabitLock = useUserStore((s) => s.toggleHabitLock);
  const toggleSkillLock = useUserStore((s) => s.toggleSkillLock);
  const undoTaskAction = useUserStore((s) => s.undoTask);
  const undoHabit = useUserStore((s) => s.undoHabit);
  const undoSkill = useUserStore((s) => s.undoSkill);
  const unlockTaskAction = useUserStore((s) => s.unlockTask);
  const unlockHabit = useUserStore((s) => s.unlockHabit);
  const unlockSkill = useUserStore((s) => s.unlockSkill);
  const isTimerRunning = useUserStore((s) => s.isTimerRunning);
  const activeTaskId = useUserStore((s) => s.activeTaskId);


  const completeTask =
    {
      project: completeTaskAction,
      habit: completeHabit,
      skill: completeSkill,
    }[type] || completeTaskAction;

  const toggleTaskLock =
    {
      project: toggleTaskLockAction,
      habit: toggleHabitLock,
      skill: toggleSkillLock,
    }[type] || toggleTaskLockAction;

  const undoTask =
    {
      project: undoTaskAction,
      habit: undoHabit,
      skill: undoSkill,
    }[type] || undoTaskAction;

  const unlockTask =
    {
      project: unlockTaskAction,
      habit: unlockHabit,
      skill: unlockSkill,
    }[type] || unlockTaskAction;

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

  const resumeTask = (id) => {
    setActiveTaskId(id);
    if (!isTimerRunning) {
      startProductionTimer();
      startTimer();
    }
  };

  const right = () => (
    <TouchableOpacity
      style={styles.swipeButton}
      onPress={() => {
        toggleTaskLock(task.id);
      }}
    >
      <Text style={styles.lockText}>{task.isLocked ? 'Unlock' : 'Lock'}</Text>
    </TouchableOpacity>
  );

  const left = () => (
    <TouchableOpacity
      style={styles.swipeButton}
      onPress={() => {
        task.isCompleted ? undoTask(task.id) : completeTask(task.id);
      }}
    >
      <Text style={styles.completeText}>{task.isCompleted ? 'Undone' : 'Done'}</Text>
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
            task.isCompleted ? undoTask(task.id) : completeTask(task.id);
          }
        }}
        testID={testID}
      >
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <PriorityBadge level={task.priority} />
            <Text style={[styles.text, { color: colors.text }]}>{task.title}</Text>
          </View>
          <TouchableOpacity onPress={() => navigate('Task', { id: task.id, type })} style={styles.menu}>
            <Text style={styles.menuText}>⋮</Text>
          </TouchableOpacity>
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
        <View style={styles.footer}>
          {task.isCompleted ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => undoTask(task.id)}
            >
              <Text style={styles.buttonText}>↩ Undo</Text>
            </TouchableOpacity>
          ) : task.isLocked ? (
            task.isManuallyLocked ? (
              <TouchableOpacity
                style={styles.button}
                onPress={() => unlockTask(task.id)}
              >
                <Text style={styles.buttonText}>🔓 Unlock</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.locked}>🔒 Locked</Text>
            )
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
  swipeButton: { justifyContent: 'center', paddingHorizontal: 20 },
  completeText: { color: 'green' },
  lockText: { color: '#ff9900' },
  dragging: { opacity: 0.7 },
  dragHandle: { marginLeft: 6, padding: 8 },
  dragText: { color: '#999', fontSize: 24 },
  menu: { marginLeft: 6, padding: 8 },
  menuText: { color: '#999', fontSize: 24 },
  subtaskBtn: { marginTop: 10, alignSelf: 'flex-start' },
  subtaskText: { color: '#00aaff', fontWeight: 'bold' },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
});

export default TaskCard;


