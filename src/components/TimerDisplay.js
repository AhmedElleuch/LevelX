import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useUserStore } from '../store/userStore';

export default function TimerDisplay() {
  const { isTimerRunning, secondsLeft } = useUserStore();

  if (!isTimerRunning) return null;

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  return <Text style={styles.timer}>⏱️ {minutes}:{seconds}</Text>;
}

const styles = StyleSheet.create({
  timer: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00aaff',
    textAlign: 'center',
    marginBottom: 20,
  },
});
