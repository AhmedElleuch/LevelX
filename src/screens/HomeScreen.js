import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert,
} from 'react-native';
import { useUserStore } from '../store/userStore';
import TaskCard from '../components/TaskCard';
import TimerDisplay from '../components/TimerDisplay';
import { sortTasks } from '../utils/sortTasks';
import { startProductionTimer, stopProductionTimer } from '../services/timer';
import ProductionTimer from '../components/ProductionTimer';
import ConfigMenu from '../components/ConfigMenu';

export default function HomeScreen() {
  const {
    taskTitle, setTaskTitle,
    priority, setPriority,
    tasks, setTasks,
  } = useUserStore();

  const priorities = ['High', 'Medium', 'Low'];

  const [showConfig, setShowConfig] = useState(false);

  const addTask = () => {
    if (taskTitle.trim() === '') {
      Alert.alert('Please enter a task title');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: taskTitle,
      priority,
      isStarted: false,
    };

    const updated = sortTasks([...tasks, newTask]);
    setTasks(updated);
    setTaskTitle('');
    setPriority('Medium');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leveling</Text>
      <TimerDisplay />
      <ProductionTimer />
      <TouchableOpacity style={styles.addButton} onPress={() => setShowConfig(!showConfig)}>
      <Text style={styles.addButtonText}>⚙ Config</Text>
      </TouchableOpacity>
      {showConfig && <ConfigMenu onClose={() => setShowConfig(false)} />}
      <TouchableOpacity style={styles.addButton} onPress={startProductionTimer}>
      <Text style={styles.addButtonText}>▶ Start Production</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.stopButton} onPress={stopProductionTimer}>
      <Text style={styles.addButtonText}>⏹ Stop</Text>
      </TouchableOpacity>
      
      
      <TextInput
        style={styles.input}
        placeholder="Enter task..."
        value={taskTitle}
        onChangeText={setTaskTitle}
      />

      <View style={styles.priorityContainer}>
        {priorities.map((p) => (
          <TouchableOpacity
            key={p}
            onPress={() => setPriority(p)}
            style={[styles.priorityButton, priority === p && styles.selected]}
          >
            <Text>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.addButton} onPress={addTask}>
        <Text style={styles.addButtonText}>+ Add Task</Text>
      </TouchableOpacity>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TaskCard task={item} />}
        contentContainerStyle={styles.taskList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 10 },
  priorityContainer: { flexDirection: 'row', marginBottom: 10, justifyContent: 'space-between' },
  priorityButton: { padding: 8, borderWidth: 1, borderColor: '#999', borderRadius: 6 },
  selected: { backgroundColor: '#d3f4ff', borderColor: '#00aaff' },
  addButton: { backgroundColor: '#00aaff', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  taskList: { gap: 10 },
  stopButton: { backgroundColor: '#ff5555',padding: 12,borderRadius: 8,alignItems: 'center',marginBottom: 20,},
});
