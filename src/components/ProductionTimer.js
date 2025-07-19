import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { useUserStore } from '../store/userStore';

const ProductionTimer = () => {
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
};

export default ProductionTimer;

const styles = StyleSheet.create({
  container: { marginBottom: 10 },
  text: { fontSize: 20, fontWeight: 'bold', color: 'green' },
});
