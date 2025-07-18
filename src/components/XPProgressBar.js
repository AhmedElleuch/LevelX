import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet, Text } from 'react-native';
import { useUserStore } from '../store/userStore';

const BAR_WIDTH = 200;

export default function XPProgressBar() {
  const { xp, level } = useUserStore();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const progress = (xp % 100) / 100;
    Animated.timing(anim, {
      toValue: progress * BAR_WIDTH,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [xp]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Level {level}</Text>
      <View style={styles.bar}>
        <Animated.View style={[styles.fill, { width: anim }]} />
      </View>
      <Text style={styles.label}>{xp % 100}/100 XP</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', marginBottom: 10 },
  bar: { width: BAR_WIDTH, height: 10, backgroundColor: '#ccc', borderRadius: 5 },
  fill: { height: 10, backgroundColor: '#00cc66', borderRadius: 5 },
  label: { fontSize: 12, marginBottom: 4 },
});
