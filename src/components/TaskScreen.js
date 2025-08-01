import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useUserStore } from '../store/userStore';
import { findTaskById, findTaskPath } from '../utils/taskTree';

const TaskScreen = ({ visible, task, type, onClose }) => {
  const { colors } = useTheme();
  const projects = useUserStore((s) => s.projects);
  const habits = useUserStore((s) => s.habits);
  const skills = useUserStore((s) => s.skills);
  const editProject = useUserStore((s) => s.editProject);
  const editHabit = useUserStore((s) => s.editHabit);
  const editSkill = useUserStore((s) => s.editSkill);
  const [current, setCurrent] = useState(task);
  const [note, setNote] = useState('');

  useEffect(() => {
    setCurrent(task);
    setNote('');
  }, [task]);

  if (!current) return null;

  const allMap = {
    project: projects,
    habit: habits,
    skill: skills,
  }[type];

  const edit = {
    project: editProject,
    habit: editHabit,
    skill: editSkill,
  }[type];

  const path = findTaskPath(allMap, current.id) || [];
  const parentId = path.length > 1 ? path[path.length - 2] : null;
  const parentTask = parentId ? findTaskById(allMap, parentId) : null;

  const openTask = (t) => {
    setCurrent(t);
    setNote('');
  };

  const addNote = () => {
    if (!note.trim()) return;
    edit(current.id, { userNotes: [...current.userNotes, note] });
    setNote('');
  };

  const removeNote = (idx) => {
    const notes = current.userNotes.filter((_, i) => i !== idx);
    edit(current.id, { userNotes: notes });
  };

  const blocking = current.blockingTasks
    .map((id) => findTaskById(allMap, id))
    .filter(Boolean);

  return (
    <Modal transparent visible={visible} animationType='slide'>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.card }]}>
          <ScrollView>
            <Text style={[styles.header, { color: colors.text }]}>{current.title}</Text>
            <Text style={[styles.section, { color: colors.text }]}>Description</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
              value={current.description}
              onChangeText={(t) => edit(current.id, { description: t })}
            />
            <Text style={[styles.section, { color: colors.text }]}>Notes</Text>
            <FlatList
              data={current.userNotes}
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
            <Text style={[styles.section, { color: colors.text }]}>Definition of Done</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
              value={current.dod}
              onChangeText={(t) => edit(current.id, { dod: t })}
            />
            <Text style={[styles.section, { color: colors.text }]}>Relations</Text>
            <View style={styles.relationRow}>
              <Text style={{ color: colors.text, marginRight: 4 }}>Parent:</Text>
              {parentTask ? (
                <TouchableOpacity onPress={() => openTask(parentTask)}>
                  <Text style={{ color: colors.primary }}>{parentTask.title}</Text>
                </TouchableOpacity>
              ) : (
                <Text style={{ color: colors.text }}>None</Text>
              )}
            </View>
            <Text style={[styles.subHeader, { color: colors.text }]}>Subtasks</Text>
            {current.children && current.children.length ? (
              current.children.map((c) => (
                <TouchableOpacity key={c.id} onPress={() => openTask(c)} style={styles.relationRow}>
                  <Text style={{ color: colors.primary, flex: 1 }}>{c.title}</Text>
                  {c.isCompleted && <Text style={{ color: 'green' }}>✓</Text>}
                </TouchableOpacity>
              ))
            ) : (
              <Text style={{ color: colors.text }}>None</Text>
            )}
            <Text style={[styles.subHeader, { color: colors.text }]}>Blocking</Text>
            {blocking.length ? (
              blocking.map((b) => (
                <TouchableOpacity key={b.id} onPress={() => openTask(b)} style={styles.relationRow}>
                  <Text style={{ color: colors.primary, flex: 1 }}>{b.title}</Text>
                  {b.isCompleted && <Text style={{ color: 'green' }}>✓</Text>}
                </TouchableOpacity>
              ))
            ) : (
              <Text style={{ color: colors.text }}>None</Text>
            )}
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default TaskScreen;

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  container: { width: '90%', maxHeight: '90%', padding: 16, borderRadius: 8 },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  section: { fontWeight: 'bold', marginTop: 10, marginBottom: 4 },
  subHeader: { marginTop: 8, marginBottom: 4, fontWeight: 'bold' },
  input: { borderWidth: 1, padding: 6, borderRadius: 4, marginBottom: 8 },
  noteRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  addBtn: { marginLeft: 6, padding: 6, backgroundColor: '#00aaff', borderRadius: 4 },
  relationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  closeBtn: { marginTop: 10, alignSelf: 'center', padding: 6 },
  closeText: { fontWeight: 'bold' },
});