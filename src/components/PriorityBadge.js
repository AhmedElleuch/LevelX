import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function PriorityBadge({ level }) {
  if (!level) return null;

  return <Text style={[styles.badge, styles[`level${level}`]]}>{level}</Text>;
}

const styles = StyleSheet.create({
  badge: {
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    color: '#fff',
    overflow: 'hidden',
  },
  levelHigh: {
    backgroundColor: '#ff3333',
  },
  levelMedium: {
    backgroundColor: '#ff9900',
  },
  levelLow: {
    backgroundColor: '#999',
  },
});
