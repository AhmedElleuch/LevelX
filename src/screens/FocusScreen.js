import React from 'react';
import { Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { useUserStore } from '../store/userStore';
import { stopTimer } from '../services/focusTimer';
import { tasksAtSameLevelWithChildren } from '../utils/taskTree';
import ProductionTimer  from '../components/Home/ProductionTimer'

const FocusScreen = () => {
  const { colors } = useTheme();
  const secondsLeft = useUserStore((s) => s.secondsLeft);
  const tasks = useUserStore((s) => s.tasks);
  const activeTaskId = useUserStore((s) => s.activeTaskId);
  const toggleTaskCompletion = useUserStore((s) => s.toggleTaskCompletion);
  

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');
  const allTasks = tasksAtSameLevelWithChildren(tasks, activeTaskId);

  return (
    <SafeAreaView
      accessible
      accessibilityLabel='Focus mode screen'
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ProductionTimer/>
      <Text
        accessibilityLabel={`Time remaining ${minutes}:${seconds}`}
        style={[styles.timer, { color: colors.text }]}
      >
        {minutes}:{seconds}
      </Text>
      <FlatList
        data={allTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            accessibilityRole='button'
            accessibilityLabel={`Toggle completion for ${item.title}`}
            style={styles.task}
            onPress={() => toggleTaskCompletion(item.id)}
          >
            <Text style={{ color: colors.text }}>
              {item.isCompleted ? '✅ ' : ''}
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        accessibilityRole='button'
        accessibilityLabel='Stop focus mode'
        style={styles.stop}
        onPress={() => stopTimer()}
      >
        <Text style={styles.stopText}>Stop</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default FocusScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  timer: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  task: { padding: 12, borderBottomWidth: 1, borderColor: '#ccc' },
  stop: { backgroundColor: '#ff5555', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  stopText: { color: '#fff', fontWeight: 'bold' },
});
