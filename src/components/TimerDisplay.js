import React, { useEffect } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useUserStore } from '../store/userStore';
import { stopTimer, resumeTimer } from '../services/timer';

const TimerDisplay = () => {
  const isTimerRunning = useUserStore((s) => s.isTimerRunning);
  const secondsLeft = useUserStore((s) => s.secondsLeft);

  useEffect(() => {
    console.log('TimerDisplay mounted');
  }, []);

  if (secondsLeft <= 0) return null;

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>⏱️ {minutes}:{seconds}</Text>
      <TouchableOpacity
        style={styles.stopButton}
        onPress={isTimerRunning ? stopTimer : resumeTimer}
      >
        <Text style={styles.stopText}>
          {isTimerRunning ? 'Stop' : 'Resume'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TimerDisplay;

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
