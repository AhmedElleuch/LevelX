import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function PriorityBadge({ level }) {
  if (!level) return null;

  return <Text style={[styles.badge, styles[`level${level}`]]}>{level}</Text>;
}

const styles = StyleSheet.create({
  badge: {
    fontWeight: 'bold',
  },
  levelHigh: {
    color: 'red',
  },
  levelMedium: {
    color: 'orange',
  },
  levelLow: {
    color: 'green',
  },
});