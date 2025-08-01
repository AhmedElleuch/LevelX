import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { useUserStore } from '../store/userStore';
import { flattenTasks } from '../utils/taskTree';
import CompletedMissions from '../components/CompletedMissions';
import XPProgressBar from '../components/XPProgressBar';
import { resetProduction } from '../services/productionTimer';

const format = (sec) => {
  const h = String(Math.floor(sec / 3600)).padStart(2, '0');
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const PerformanceScreen = () => {
  const { colors } = useTheme();
  const {
    productionSeconds,
    wasteSeconds,
    tasks,
  } = useUserStore();

  const reset = () => {
    resetProduction();
  };

  const completed = flattenTasks(tasks).filter((t) => t.isCompleted);
  const total = productionSeconds + wasteSeconds;
  const prodRatio = total ? productionSeconds / total : 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <XPProgressBar />
      <View style={styles.chart}>
        <View style={[styles.prodBar, { flex: prodRatio }]} />
        <View style={[styles.wasteBar, { flex: 1 - prodRatio }]} />
      </View>
      <Text style={[styles.text, { color: colors.text }]}>Production: {format(productionSeconds)}</Text>
      <Text style={[styles.text, { color: colors.text }]}>Waste: {format(wasteSeconds)}</Text>
      <Text style={[styles.sub, { color: colors.text }]}>Completed Missions: {completed.length}</Text>
      <CompletedMissions />
      <TouchableOpacity style={styles.button} onPress={reset}>
        <Text style={styles.buttonText}>Reset Production</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PerformanceScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  sub: { fontSize: 16, marginBottom: 10 },
  text: { fontSize: 18, marginBottom: 10 },
  chart: {
    flexDirection: 'row',
    width: '80%',
    height: 10,
    marginBottom: 20,
    backgroundColor: '#eee',
    borderRadius: 5,
    overflow: 'hidden',
  },
  prodBar: { backgroundColor: '#00cc66' },
  wasteBar: { backgroundColor: '#ff5555' },
  button: { backgroundColor: '#ff5555', padding: 12, borderRadius: 8, marginTop: 20 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

