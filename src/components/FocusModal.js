// src/components/FocusModal.js
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useUserStore } from '../store/userStore';
import { shallow } from 'zustand/shallow';
import { stopTimer } from '../services/focusTimer';

const FocusModal = () => {
const isTimerRunning = useUserStore((s) => s.isTimerRunning);
const secondsLeft = useUserStore((s) => s.secondsLeft);
const tasks = useUserStore((s) => s.tasks);
const toggleTaskCompletion = useUserStore((s) => s.toggleTaskCompletion);
const isFocusModalVisible = useUserStore((s) => s.isFocusModalVisible);
const { colors } = useTheme();

  if (!isFocusModalVisible) return null;

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');
  const activeTasks = tasks.filter((t) => !t.isCompleted);

  return (
    <Modal transparent visible={isTimerRunning} animationType='slide'>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <Text style={[styles.timer, { color: colors.text }]}>
            {minutes}:{seconds}
          </Text>
          <FlatList
            data={activeTasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
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
          <TouchableOpacity style={styles.stop} onPress={stopTimer}>
            <Text style={styles.stopText}>Stop</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default FocusModal;

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  container: { flex: 1, margin: 20, padding: 20, borderRadius: 8 },
  timer: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  task: { padding: 12, borderBottomWidth: 1, borderColor: '#ccc' },
  stop: { backgroundColor: '#ff5555', padding: 12, borderRadius: 6, marginTop: 20, alignItems: 'center' },
  stopText: { color: '#fff', fontWeight: 'bold' },
});
