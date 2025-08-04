import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TaskBrowser from '../../components/Home/TaskBrowser';
import { useTheme } from '@react-navigation/native';
import { useUserStore } from '../../store/userStore';
import TimerDisplay from '../../components/Home/TimerDisplay';
import BreakTimer from '../../components/Home/BreakTimer';
import {
  resumeProductionTimer,
  resumeWasteTimer,
  startProductionTimer,
} from '../../services/productionTimer';
import { resumeTimer, startTimer } from '../../services/focusTimer';
import ProductionTimer from '../../components/Home/ProductionTimer';
import { flattenTasks } from '../../utils/taskTree';

const HomeHeader = () => {

  return (
    <View>
      <ProductionTimer />
      <TimerDisplay />
      <BreakTimer />
    </View>
  );
};

const WelcomeSection = ({ onSelect }) => {
  const { colors } = useTheme();
  const tasks = useUserStore((s) => s.tasks);
  const editTask = useUserStore((s) => s.editTask);
  const setActiveTaskId = useUserStore((s) => s.setActiveTaskId);
  const isTimerRunning = useUserStore((s) => s.isTimerRunning);
  const isProductionActive = useUserStore((s) => s.isProductionActive);
  const suggestions = useMemo(() => {
    const undone = flattenTasks(tasks).filter((t) => !t.isCompleted);
    const shuffled = [...undone].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  }, [tasks]);

  const start = (id) => {
    editTask(id, { isStarted: true, dateStarted: Date.now() });
    setActiveTaskId(id);
    if (!isTimerRunning) {
      startProductionTimer();
      startTimer();
    } else if (!isProductionActive) {
      startProductionTimer();
    }
    onSelect(id);
  };

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={[styles.title, { color: colors.text }]}>Welcome back!</Text>
      <Text style={[styles.section, { color: colors.text }]}>Suggestions</Text>

      {suggestions.map((t) => (
        <View key={t.id} style={styles.ticket} testID={`suggest-ticket-${t.id}`}> 
          <Text style={[styles.ticketText, { color: colors.text }]}>{t.title}</Text>
          <TouchableOpacity
            style={styles.startBtn}
            onPress={() => start(t.id)}
            testID={`suggest-start-${t.id}`}
          >
            <Text style={styles.startText}>Start</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const HomeScreen = () => {
  const { colors } = useTheme();
  const tasks = useUserStore((s) => s.tasks);
  const addTask = useUserStore((s) => s.addTask);
  const addTaskSubtask = useUserStore((s) => s.addTaskSubtask);
  const habits = useUserStore((s) => s.habits);
  const addHabit = useUserStore((s) => s.addHabit);
  const addHabitSubtask = useUserStore((s) => s.addHabitSubtask);
  const skills = useUserStore((s) => s.skills);
  const addSkill = useUserStore((s) => s.addSkill);
  const addSkillSubtask = useUserStore((s) => s.addSkillSubtask);
  const [focusedTaskId, setFocusedTaskId] = useState(null);

  useEffect(() => {
    resumeProductionTimer();
    resumeWasteTimer();
    resumeTimer();
  }, []);

  const headerComponent = (
    <View>
      <HomeHeader />
      <WelcomeSection onSelect={setFocusedTaskId} />
      <View>
        <TaskBrowser
          style={{ marginTop: 20 }}
          tasks={tasks}
          addTaskRoot={addTask}
          addSubtask={addTaskSubtask}
          rootTitle='Projects'
          testIDPrefix='project-'
          focusedTaskId={focusedTaskId}
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <TaskBrowser
          tasks={habits}
          addTaskRoot={addHabit}
          addSubtask={addHabitSubtask}
          rootTitle='Habits'
          testIDPrefix='habit-'
          focusedTaskId={focusedTaskId}
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <TaskBrowser
          tasks={skills}
          addTaskRoot={addSkill}
          addSubtask={addSkillSubtask}
          rootTitle='Skills'
          testIDPrefix='skill-'
          focusedTaskId={focusedTaskId}
        />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <FlatList
          data={[]}
          keyExtractor={() => 'dummy'}
          renderItem={null}
          ListHeaderComponent={headerComponent}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20 }}
          keyboardShouldPersistTaps='handled'
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 10 },
  sub: { fontSize: 16, marginBottom: 10 },
  taskList: { gap: 10 },
  stopButton: { backgroundColor: '#ff5555',padding: 12,borderRadius: 8,alignItems: 'center',marginBottom: 20,},
  section: { fontWeight: 'bold', marginBottom: 6, marginTop: 10 },
  ticket: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 8, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 6 },
  ticketText: { fontSize: 14, flex: 1, marginRight: 6 },
  startBtn: { backgroundColor: '#00cc66', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  startText: { color: '#fff', fontWeight: 'bold' },
});
