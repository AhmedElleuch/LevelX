import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useUserStore } from '../store/userStore';
import TaskCard from './TaskCard';
import { getTaskDepth } from '../utils/taskTree';

const TaskItem = ({ task, level }) => {
  const { colors } = useTheme();
  const addSubtask = useUserStore((s) => s.addSubtask);
  const tasks = useUserStore((s) => s.tasks);
  const [expanded, setExpanded] = useState(true);
  const [title, setTitle] = useState('');
  const depth = getTaskDepth(tasks, task.id);

  const handleAdd = () => {
    if (!title.trim()) return;
    const newTask = {
      id: Date.now().toString(),
      title,
      priority: 'Low',
      isStarted: false,
      isCompleted: false,
      dateCreated: new Date().toISOString(),
      dateStarted: null,
      dateFinished: null,
      description: '',
      dod: '',
      userNotes: [],
      blockingTasks: [],
      children: [],
    };
    addSubtask(task.id, newTask);
    setTitle('');
  };

  return (
    <View style={{ marginLeft: (level - 1) * 20 }}>
      <TouchableOpacity onPress={() => setExpanded((e) => !e)}>
        <TaskCard task={task} />
      </TouchableOpacity>
      {expanded && task.children &&
        task.children.map((c) => (
          <TaskItem key={c.id} task={c} level={level + 1} />
        ))}
      {expanded && depth < 5 && (
        <View style={styles.addRow}>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder='Add subtask...'
            placeholderTextColor={colors.text}
            value={title}
            onChangeText={setTitle}
          />
          <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const NestedTaskList = ({ tasks }) => (
  <View>
    {tasks.map((t) => (
      <TaskItem key={t.id} task={t} level={1} />
    ))}
  </View>
);

export default NestedTaskList;

const styles = StyleSheet.create({
  addRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  input: { flex: 1, borderWidth: 1, padding: 4, borderRadius: 4 },
  addBtn: { marginLeft: 6, backgroundColor: '#00aaff', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 4 },
  addText: { color: '#fff', fontWeight: 'bold' },
});