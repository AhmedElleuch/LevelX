import React, { useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useUserStore } from '../store/userStore';
import TaskCard from '../components/TaskCard';
import TimerDisplay from '../components/TimerDisplay';
import { sortTasks } from '../utils/sortTasks';
import {
  resumeProductionTimer,
  resumeWasteTimer,
  resumeTimer,
} from '../services/timer';
import ProductionTimer from '../components/ProductionTimer';
import { PRIORITIES } from '../constants/priorities';
import { MISSIONS } from '../constants/missions';
import XPProgressBar from '../components/XPProgressBar';

export default function HomeScreen() {
  const {
    taskTitle,
    setTaskTitle,
    priority,
    setPriority,
    tasks,
    setTasks,
    dailyXp,
    streak,
    addXp,
    acceptedMissions,
    acceptMission,
    moveTaskToTop,
  } = useUserStore();

  const priorities = PRIORITIES;
  
  const handleAcceptMission = (mission) => {
    addXp(mission.xp);
    acceptMission(mission.id);
    Alert.alert('Mission accepted!');
  };

  useEffect(() => {
    resumeProductionTimer();
    resumeWasteTimer();
    resumeTimer();
  }, []);

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

    const updated = sortTasks([...tasks, newTask]);
    setTasks(updated);
    setTaskTitle('');
    setPriority('Medium');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard task={item} onLongPress={() => moveTaskToTop(item.id)} />
        )}
        ListHeaderComponent={
        <View>
          <Text style={styles.title}>Welcome back!</Text>
          <XPProgressBar />
          <Text style={styles.sub}>Daily XP {dailyXp} • Streak {streak}</Text>
          <ProductionTimer />
          <TimerDisplay />

          {acceptedMissions.length > 0 && (
            <View>
              <Text style={styles.section}>Active Missions</Text>
              {MISSIONS.filter((m) => acceptedMissions.includes(m.id)).map((m) => (
                <View key={m.id} style={styles.mission}>
                  <Text style={styles.missionText}>{m.title}</Text>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.section}>Available Missions</Text>
          {MISSIONS.filter((m) => !acceptedMissions.includes(m.id)).map((m) => (
            <View key={m.id} style={styles.mission}>
              <Text style={styles.missionText}>{m.title}</Text>
              <TouchableOpacity
                style={styles.accept}
                onPress={() => handleAcceptMission(m)}
              >
                <Text style={styles.acceptText}>Accept</Text>
              </TouchableOpacity>
            </View>
          ))}

         <TouchableOpacity
            style={styles.challengeButton}
            onPress={() => addXp(5)}
           >
            <Text style={styles.challengeText}>Start Challenge</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Enter task..."
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

          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Text style={styles.addButtonText}>+ Add Task</Text>
          </TouchableOpacity>
        </View>
      }
      style={styles.container}
      contentContainerStyle={styles.taskList}
      />
    </KeyboardAvoidingView>

    
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#fff' },
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
});

