import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useUserStore } from '../store/userStore';
import { stopTimer } from '../services/timer';

export default function TimerDisplay() {
  const { isTimerRunning, secondsLeft } = useUserStore();

  if (!isTimerRunning) return null;

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>⏱️ {minutes}:{seconds}</Text>
      <TouchableOpacity style={styles.stopButton} onPress={stopTimer}>
        <Text style={styles.stopText}>Stop</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginBottom: 20 },
  timer: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00aaff',
    textAlign: 'center',
    marginBottom: 10,
  },
  stopButton: {
    backgroundColor: '#ff5555',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  stopText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});