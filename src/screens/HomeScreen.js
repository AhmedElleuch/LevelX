import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ToastAndroid,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TaskBrowser from '../components/TaskBrowser';
import { useTheme } from '@react-navigation/native';
import { useUserStore } from '../store/userStore';
import TimerDisplay from '../components/TimerDisplay';
import BreakTimer from '../components/BreakTimer';
import { resumeProductionTimer, resumeWasteTimer } from '../services/productionTimer';
import { resumeTimer } from '../services/focusTimer';
import ProductionTimer from '../components/ProductionTimer';
import XPProgressBar from '../components/XPProgressBar';
import FocusMode from '../components/focusMode';

const HomeHeader = () => {
  const { colors } = useTheme();
  const dailyXp = useUserStore((s) => s.dailyXp);
  const streak = useUserStore((s) => s.streak);

  return (
    <View>
      <XPProgressBar />
      <Text style={[styles.sub, { color: colors.text }]}>Daily XP {dailyXp} • Streak {streak}</Text>
      <ProductionTimer />
      <TimerDisplay />
      <BreakTimer />
    </View>
  );
};

const HomeScreen = () => {
  const { colors } = useTheme();
  const tasks = useUserStore((s) => s.tasks);
  const habits = useUserStore((s) => s.habits);
  const addHabit = useUserStore((s) => s.addHabit);
  const addHabitSubtask = useUserStore((s) => s.addHabitSubtask);

  useEffect(() => {
    console.log('HomeScreen mounted', { tasksCount: tasks.length });
    resumeProductionTimer();
    resumeWasteTimer();
    resumeTimer();
  }, []);

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
          ListHeaderComponent={() => (
            <View>
              <HomeHeader />
              <TaskBrowser />
              <View style={{ marginTop: 20 }}>
                <TaskBrowser
                  tasks={habits}
                  addTaskRoot={addHabit}
                  addSubtask={addHabitSubtask}
                  rootTitle='Habits'
                  testIDPrefix='habit-'
                />
              </View>
            </View>
          )}
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
});

