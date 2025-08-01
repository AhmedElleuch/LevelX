import React from 'react';
import { Text, StyleSheet } from 'react-native';

const PriorityBadge = ({ level }) => {
  if (!level) return null;

  return <Text style={[styles.badge, styles[`level${level}`]]}>■</Text>;
};

export default PriorityBadge;

const styles = StyleSheet.create({
  badge: { marginRight: 8, fontWeight: 'bold' },
  levelHigh: { color: '#ff3333' },
  levelMedium: { color: '#ff9900' },
  levelLow: { color: '#999' },
});

