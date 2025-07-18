import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useUserStore } from '../store/userStore';
import CompletedMissions from '../components/CompletedMissions';
import XPProgressBar from '../components/XPProgressBar';
import { resetProduction } from '../services/timer';

const format = (sec) => {
  const h = String(Math.floor(sec / 3600)).padStart(2, '0');
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
};

export default function PerformanceScreen() {
  const {
    productionSeconds,
    wasteSeconds,
    tasks,
  } = useUserStore();

  const reset = () => {
    resetProduction();
  };

  const completed = tasks.filter((t) => t.isCompleted);
  const total = productionSeconds + wasteSeconds;
  const prodRatio = total ? productionSeconds / total : 0;

  return (
    <View style={styles.container}>
      <XPProgressBar />
      <View style={styles.chart}>
        <View style={[styles.prodBar, { flex: prodRatio }]} />
        <View style={[styles.wasteBar, { flex: 1 - prodRatio }]} />
      </View>      <Text style={styles.text}>Production: {format(productionSeconds)}</Text>
      <Text style={styles.text}>Waste: {format(wasteSeconds)}</Text>
      <Text style={styles.sub}>Completed Missions: {completed.length}</Text>
      <CompletedMissions />
      <TouchableOpacity style={styles.button} onPress={reset}>
        <Text style={styles.buttonText}>Reset Production</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  sub: { fontSize: 16, marginBottom: 10 },
  text: { fontSize: 18, marginBottom: 10 },
  chart: { flexDirection: 'row', width: '80%', height: 10, marginBottom: 20, backgroundColor: '#eee', borderRadius: 5, overflow: 'hidden' },
  prodBar: { backgroundColor: '#00cc66' },
  wasteBar: { backgroundColor: '#ff5555' },
  text: { fontSize: 18, marginBottom: 10 },
  button: { backgroundColor: '#ff5555', padding: 12, borderRadius: 8, marginTop: 20 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

