import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useUserStore } from '../store/userStore';
import { flattenTasks } from '../utils/taskTree';

const CompletedMissions = () => {
  const { colors } = useTheme();
  const tasks = useUserStore((s) => s.tasks);
  const completed = flattenTasks(tasks).filter((t) => t.isCompleted);
  const totalXp = completed.length * 25;

  return (
    <View style={styles.container}>
      <Text style={[styles.header, { color: colors.text }]}>Completed Missions: {completed.length}</Text>
      {completed.map((t) => (
        <Text key={t.id} style={[styles.item, { color: colors.text }]}>{t.title}</Text>
      ))}
      <Text style={[styles.total, { color: colors.text }]}>Task XP: {totalXp}</Text>
    </View>
  );
};

export default CompletedMissions;

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginTop: 20 },
  header: { fontWeight: 'bold', marginBottom: 6 },
  item: { fontSize: 12 },
  total: { marginTop: 6, fontWeight: 'bold' },
});

