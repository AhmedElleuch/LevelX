import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useUserStore } from '../store/userStore';

const TaskDetails = ({ visible, task, onClose }) => {
  const { colors } = useTheme();
  const editTask = useUserStore((s) => s.editTask);
  const [note, setNote] = useState('');

  useEffect(() => {
    setNote('');
  }, [task]);

  if (!task) return null;

  const addNote = () => {
    if (!note.trim()) return;
    editTask(task.id, { userNotes: [...task.userNotes, note] });
    setNote('');
  };

  const removeNote = (idx) => {
    const notes = task.userNotes.filter((_, i) => i !== idx);
    editTask(task.id, { userNotes: notes });
  };

  return (
    <Modal transparent visible={visible} animationType='slide'>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.card }]}>
          <Text style={[styles.header, { color: colors.text }]}>{task.title}</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            value={task.description}
            placeholder='Description'
            onChangeText={(t) => editTask(task.id, { description: t })}
          />
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            value={task.dod}
            placeholder='Definition of Done'
            onChangeText={(t) => editTask(task.id, { dod: t })}
          />
          <View style={styles.prioRow}>
            {['Low', 'Medium', 'High'].map((p) => (
              <TouchableOpacity
                key={p}
                onPress={() => editTask(task.id, { priority: p })}
                style={[styles.prioBtn, task.priority === p && styles.prioActive]}
              >
                <Text>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <FlatList
            data={task.userNotes}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.noteRow}>
                <Text style={{ color: colors.text, flex: 1 }}>{item}</Text>
                <TouchableOpacity onPress={() => removeNote(index)}>
                  <Text>✕</Text>
                </TouchableOpacity>
              </View>
            )}
            ListFooterComponent={(
              <View style={styles.noteRow}>
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  style={[styles.input, { borderColor: colors.border, color: colors.text, flex: 1 }]}
                  placeholder='Add note'
                />
                <TouchableOpacity onPress={addNote} style={styles.addBtn}>
                  <Text>Add</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TaskDetails;

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  container: { width: '80%', padding: 16, borderRadius: 8 },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  input: { borderWidth: 1, padding: 6, borderRadius: 4, marginBottom: 8 },
  prioRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 },
  prioBtn: { padding: 6, borderWidth: 1, borderRadius: 4 },
  prioActive: { backgroundColor: '#ddd' },
  noteRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  addBtn: { marginLeft: 6, padding: 6, backgroundColor: '#00aaff', borderRadius: 4 },
  closeBtn: { marginTop: 10, alignSelf: 'center', padding: 6 },
  closeText: { fontWeight: 'bold' },
});
