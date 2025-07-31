import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useUserStore } from '../store/userStore';
import TaskCard from './TaskCard';
import { findTaskById, getTaskDepth } from '../utils/taskTree';

const TaskBrowser = ({
  tasks = useUserStore((s) => s.tasks),
  addSubtask = useUserStore((s) => s.addSubtask),
  addTaskRoot = useUserStore((s) => s.addTask),
  rootTitle = 'Projects',
  testIDPrefix = 'task-',
}) => {
  const { colors } = useTheme();
  const [path, setPath] = useState([]);
  const [title, setTitle] = useState('');

  const parent = path.length ? findTaskById(tasks, path[path.length - 1]) : null;
  const currentTasks = parent ? parent.children || [] : tasks;
  const depth = parent ? getTaskDepth(tasks, parent.id) : 0;

  const addTask = () => {
    if (!title.trim()) return;
    const newTask = {
      id: Date.now().toString(),
      title,
      priority: 'Medium',
      isStarted: false,
      isCompleted: false,
      children: [],
    };
    if (parent) {
      addSubtask(parent.id, newTask);
    } else {
      addTaskRoot(newTask);
    }
    setTitle('');
  };

  return (
    <View>
      <View style={styles.headerRow}>
        {path.length > 0 && (
          <TouchableOpacity onPress={() => setPath(path.slice(0, -1))}>
            <Text style={[styles.back, { color: colors.primary }]}>◀ Back</Text>
          </TouchableOpacity>
        )}
        <Text style={[styles.title, { color: colors.text }]}>{parent ? parent.title : rootTitle}</Text>
      </View>
      {currentTasks.map((t) => (
        <TaskCard
          key={t.id}
          task={t}
          onPress={() => setPath([...path, t.id])}
          testID={`${testIDPrefix}${t.id}`}
        />
      ))}
      {depth < 5 && (
        <View style={styles.addRow}>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder='Add task...'
            placeholderTextColor={colors.text}
            value={title}
            onChangeText={setTitle}
          />
          <TouchableOpacity style={styles.addBtn} onPress={addTask}>
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default TaskBrowser;

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 20, fontWeight: 'bold', flex: 1 },
  back: { marginRight: 10 },
  addRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  input: { flex: 1, borderWidth: 1, padding: 4, borderRadius: 4 },
  addBtn: { marginLeft: 6, backgroundColor: '#00aaff', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 4 },
  addText: { color: '#fff', fontWeight: 'bold' },
});
