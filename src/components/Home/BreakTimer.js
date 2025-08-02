import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useUserStore } from '../../store/userStore';

const BreakTimer = () => {
  const breakSeconds = useUserStore((s) => s.breakSeconds);
  const isOnBreak = useUserStore((s) => s.isOnBreak);

  if (!isOnBreak || breakSeconds <= 0) return null;

  const minutes = String(Math.floor(breakSeconds / 60)).padStart(2, '0');
  const seconds = String(breakSeconds % 60).padStart(2, '0');

  return (
    <View style={styles.container}>
      <Text style={styles.text}>🛌 Break: {minutes}:{seconds}</Text>
    </View>
  );
};

export default BreakTimer;

const styles = StyleSheet.create({
  container: { marginBottom: 10 },
  text: { fontSize: 20, fontWeight: 'bold', color: '#ff9900' },
});
