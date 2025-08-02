import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useUserStore } from '../../store/userStore';
import { startProductionTimer, stopProductionTimer } from '../../services/productionTimer';

const ProductionTimer = () => {
  const isProductionActive = useUserStore((s) => s.isProductionActive);
  const productionSeconds = useUserStore((s) => s.productionSeconds);

  if (!isProductionActive) {
    return (
      <TouchableOpacity style={styles.startButton} onPress={() => {
        useUserStore.getState().setActiveTaskId('manual');
        startProductionTimer();
      }}>
        <Text style={styles.startText}>Start Production</Text>
      </TouchableOpacity>
    );
  }

  const hours = String(Math.floor(productionSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((productionSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(productionSeconds % 60).padStart(2, '0');

  return (
    <View style={styles.container}>
      <Text style={styles.text}>🟢 Production: {hours}:{minutes}:{seconds}</Text>
      <TouchableOpacity style={styles.stopButton} onPress={() => {
        useUserStore.getState().setActiveTaskId(null);
        stopProductionTimer();
      }}>
        <Text style={styles.stopText}>Stop</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProductionTimer;

const styles = StyleSheet.create({
  container: { marginBottom: 10 },
  text: { fontSize: 20, fontWeight: 'bold', color: 'green' },
  startButton: {
    backgroundColor: '#00cc66',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  startText: { color: '#fff', fontWeight: 'bold' },
  stopButton: {
    backgroundColor: '#ff5555',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  stopText: { color: '#fff', fontWeight: 'bold' },
});
