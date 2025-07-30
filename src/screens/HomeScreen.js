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
import DraggableFlatList from 'react-native-draggable-flatlist';
import { useTheme } from '@react-navigation/native';
import { useUserStore } from '../store/userStore';
import TaskCard from '../components/TaskCard';
import TimerDisplay from '../components/TimerDisplay';
import BreakTimer from '../components/BreakTimer';
import { resumeProductionTimer, resumeWasteTimer } from '../services/productionTimer';
import { resumeTimer } from '../services/focusTimer';
import ProductionTimer from '../components/ProductionTimer';
import { PRIORITIES } from '../constants/priorities';
import { MISSIONS } from '../constants/missions';
import XPProgressBar from '../components/XPProgressBar';
import FocusMode from '../components/FocusMode';

const HomeHeader = () => {
  const { colors } = useTheme();
  const taskTitle = useUserStore((s) => s.taskTitle);
  const setTaskTitle = useUserStore((s) => s.setTaskTitle);
  const priority = useUserStore((s) => s.priority);
  const setPriority = useUserStore((s) => s.setPriority);
  const tasks = useUserStore((s) => s.tasks);
  const setTasks = useUserStore((s) => s.setTasks);
  const dailyXp = useUserStore((s) => s.dailyXp);
  const streak = useUserStore((s) => s.streak);
  const addXp = useUserStore((s) => s.addXp);
  const acceptedMissions = useUserStore((s) => s.acceptedMissions);
  const acceptMission = useUserStore((s) => s.acceptMission);

  const priorities = PRIORITIES;

  const handleAcceptMission = (mission) => {
    addXp(mission.xp);
    acceptMission(mission.id);
    if (Platform.OS === 'android') {
      ToastAndroid.show('Task Accepted!', ToastAndroid.SHORT);
    } else {
      Alert.alert('Task Accepted!');
    }
  };

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

    setTasks([...tasks, newTask]);
    setTaskTitle('');
    setPriority('Medium');
  };

  return (
    <View>
      <Text style={[styles.title, { color: colors.text }]}>Welcome back!</Text>
      <XPProgressBar />
      <Text style={[styles.sub, { color: colors.text }]}>Daily XP {dailyXp} • Streak {streak}</Text>
      <ProductionTimer />
      <TimerDisplay />
      <BreakTimer />

      {acceptedMissions.length > 0 && (
        <View>
          <Text style={[styles.section, { color: colors.text }]}>Active Missions</Text>
          {MISSIONS.filter((m) => acceptedMissions.includes(m.id)).map((m) => (
            <View
              key={m.id}
              style={[styles.mission, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Text style={[styles.missionText, { color: colors.text }]}>{m.title}</Text>
            </View>
          ))}
        </View>
      )}

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
          styles.challengeButton,
          pressed && styles.pressedButton,
        ]}
        onPress={() => addXp(5)}
      >
        <Text style={styles.challengeText}>Start Challenge</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.addButton,
          pressed && styles.pressedButton,
        ]}
        onPress={addTask}
      >
        <Text style={styles.addButtonText}>+ Add Task</Text>
      </Pressable>

      <Text style={[styles.section, { color: colors.text }]}>Available Missions</Text>
      {MISSIONS.filter((m) => !acceptedMissions.includes(m.id)).map((m) => (
        <View
          key={m.id}
          style={[styles.mission, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Text style={[styles.missionText, { color: colors.text }]}>{m.title}</Text>
          <Pressable
            style={({ pressed }) => [
              styles.accept,
              pressed && styles.pressedButton,
            ]}
            onPress={() => handleAcceptMission(m)}
          >
            <Text style={styles.acceptText}>Accept</Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
};

const HomeScreen = () => {
  const { colors } = useTheme();
  const tasks = useUserStore((s) => s.tasks);
  const setTasks = useUserStore((s) => s.setTasks);

  useEffect(() => {
    console.log('HomeScreen mounted', { tasksCount: tasks.length });
    resumeProductionTimer();
    resumeWasteTimer();
    resumeTimer();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <DraggableFlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item, drag, isActive }) => (
          <TaskCard task={item} drag={drag} isActive={isActive} />
        )}
        onDragEnd={({ data }) => setTasks(data)}
        ListHeaderComponent={HomeHeader}
        ListEmptyComponent={HomeHeader}
        contentContainerStyle={styles.taskList}
      />
      {/* <FocusMode /> */}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 10 },
  sub: { fontSize: 16, marginBottom: 10 },
  mission: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  missionText: { flex: 1, marginRight: 10 },
  accept: {
    backgroundColor: '#00cc66',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  acceptText: { color: '#fff', fontWeight: 'bold' },
  challengeButton: {
    backgroundColor: '#0066cc',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  challengeText: { color: '#fff', fontWeight: 'bold' },
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

