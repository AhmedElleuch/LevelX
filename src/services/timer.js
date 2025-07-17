import React from 'react';
import { Text, StyleSheet, View, Alert } from 'react-native';
import { useUserStore } from '../store/userStore';

export default function ProductionTimer() {
  const { isProductionActive, productionSeconds } = useUserStore();

  if (!isProductionActive) return null;

  const hours = String(Math.floor(productionSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((productionSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(productionSeconds % 60).padStart(2, '0');

  return (
    <View style={styles.container}>
      <Text style={styles.text}>🟢 Production: {hours}:{minutes}:{seconds}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 10 },
  text: { fontSize: 20, fontWeight: 'bold', color: 'green' },
});


let intervalId = null;

export const startProductionTimer = () => {
  const {
    isProductionActive,
    setIsProductionActive,
    setProductionStartTime,
    setProductionSeconds,
  } = useUserStore.getState();

  if (isProductionActive) {
    console.log("Production already running");
    return;
  }

  console.log("Starting production timer...");
  setIsProductionActive(true);
  setProductionStartTime(Date.now());
  setProductionSeconds(0);

  intervalId = setInterval(() => {
    const { productionStartTime } = useUserStore.getState();
    const elapsed = Math.floor((Date.now() - productionStartTime) / 1000);
    setProductionSeconds(elapsed);
    console.log("⏱", elapsed, "seconds");
  }, 1000);
};

export const stopProductionTimer = () => {
  const { isProductionActive, setIsProductionActive } = useUserStore.getState();

  if (!isProductionActive) {
    console.log("Production already stopped");
    return;
  }

  console.log("Stopping production timer");
  clearInterval(intervalId);
  intervalId = null;
  setIsProductionActive(false);
};

export const startTimer = () => {
  const { setSecondsLeft, setIsTimerRunning, setIntervalId, focusMinutes } = useUserStore.getState();

  setSecondsLeft(focusMinutes * 60);
  setIsTimerRunning(true);

  const id = setInterval(() => {
    const { secondsLeft } = useUserStore.getState();

    if (secondsLeft <= 1) {
      clearInterval(id);
      setIsTimerRunning(false);
      setSecondsLeft(0);
      Alert.alert('Focus session complete! ✅');
    } else {
      setSecondsLeft(secondsLeft - 1);
    }
  }, 1000);

  setIntervalId(id);
};

