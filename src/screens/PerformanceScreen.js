import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useUserStore } from '../store/userStore';

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
    setProductionSeconds,
    setProductionStartTime,
  } = useUserStore();

  const reset = () => {
    setProductionSeconds(0);
    setProductionStartTime(Date.now());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Performance</Text>
      <Text style={styles.text}>Production: {format(productionSeconds)}</Text>
      <Text style={styles.text}>Waste: {format(wasteSeconds)}</Text>
      <TouchableOpacity style={styles.button} onPress={reset}>
        <Text style={styles.buttonText}>Reset Production</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  text: { fontSize: 18, marginBottom: 10 },
  button: { backgroundColor: '#ff5555', padding: 12, borderRadius: 8, marginTop: 20 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
