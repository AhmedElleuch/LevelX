import React, { useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Platform,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NestedTaskList from '../components/NestedTaskList';
import { useTheme } from '@react-navigation/native';
import { useUserStore } from '../store/userStore';
import TimerDisplay from '../components/TimerDisplay';
import BreakTimer from '../components/BreakTimer';
import { resumeProductionTimer, resumeWasteTimer } from '../services/productionTimer';
import { resumeTimer } from '../services/focusTimer';
import ProductionTimer from '../components/ProductionTimer';
import { PRIORITIES } from '../constants/priorities';

import XPProgressBar from '../components/XPProgressBar';
import FocusMode from '../components/focusMode';

const HomeHeader = () => {
  const { colors } = useTheme();
  const taskTitle = useUserStore((s) => s.taskTitle);
  const setTaskTitle = useUserStore((s) => s.setTaskTitle);
  const priority = useUserStore((s) => s.priority);
  const setPriority = useUserStore((s) => s.setPriority);
  const tasks = useUserStore((s) => s.tasks);
  const addTaskRoot = useUserStore((s) => s.addTask);
  const dailyXp = useUserStore((s) => s.dailyXp);
  const streak = useUserStore((s) => s.streak);
  const addXp = useUserStore((s) => s.addXp);

  const priorities = PRIORITIES;

  const addTask = () => {
    if (taskTitle.trim() === '') {
      Alert.alert('Please enter a task title');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: taskTitle,
      priority,
      isStarted: false,
      isCompleted: false,
    };

    console.log('Add task', newTask);

    addTaskRoot(newTask);
    setTaskTitle('');
    setPriority('Medium');
  };

  return (
    <View>
      <XPProgressBar />
      <Text style={[styles.sub, { color: colors.text }]}>Daily XP {dailyXp} • Streak {streak}</Text>
      <ProductionTimer />
      <TimerDisplay />
      <BreakTimer />



      <TextInput
        style={styles.input}
        placeholder='Enter task...'
        placeholderTextColor={colors.text}
        value={taskTitle}
        onChangeText={setTaskTitle}
      />

      <View style={styles.priorityContainer}>
        {priorities.map((p) => (
          <TouchableOpacity
            key={p}
            onPress={() => setPriority(p)}
            style={[styles.priorityButton, priority === p && styles.selected]}
          >
            <Text>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Pressable
        style={({ pressed }) => [
          styles.addButton,
          pressed && styles.pressedButton,
        ]}
        onPress={addTask}
      >
        <Text style={styles.addButtonText}>+ Add Task</Text>
      </Pressable>


    </View>
  );
};

const HomeScreen = () => {
  const { colors } = useTheme();
  const tasks = useUserStore((s) => s.tasks);

  useEffect(() => {
    console.log('HomeScreen mounted', { tasksCount: tasks.length });
    resumeProductionTimer();
    resumeWasteTimer();
    resumeTimer();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <HomeHeader />
      <NestedTaskList tasks={tasks} />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 10 },
  sub: { fontSize: 16, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 10 },
  priorityContainer: { flexDirection: 'row', marginBottom: 10, justifyContent: 'space-between' },
  priorityButton: { padding: 8, borderWidth: 1, borderColor: '#999', borderRadius: 6 },
  selected: { backgroundColor: '#d3f4ff', borderColor: '#00aaff' },
  addButton: { backgroundColor: '#00aaff', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  taskList: { gap: 10 },
  stopButton: { backgroundColor: '#ff5555',padding: 12,borderRadius: 8,alignItems: 'center',marginBottom: 20,},
  section: { fontWeight: 'bold', marginBottom: 6, marginTop: 10 },
  pressedButton: { opacity: 0.7 },
});

