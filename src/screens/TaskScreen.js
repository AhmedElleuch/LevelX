import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useTheme, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '../store/userStore';
import { findTaskById, findTaskPath, tasksAtSameLevelWithChildren } from '../utils/taskTree';
import TaskCard from '../components/Home/TaskCard';

const TaskScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id, type } = route.params;
  const { colors } = useTheme();
  const tasks = useUserStore((s) => s.tasks);
  const habits = useUserStore((s) => s.habits);
  const skills = useUserStore((s) => s.skills);
  const editTask = useUserStore((s) => s.editTask);
  const editHabit = useUserStore((s) => s.editHabit);
  const editSkill = useUserStore((s) => s.editSkill);
  const [current, setCurrent] = useState(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    const all = { project: tasks, habit: habits, skill: skills }[type];
    const t = findTaskById(all, id);
    setCurrent(t);
    setNote('');
  }, [id, type, tasks, habits, skills]);

  if (!current) return null;

  const allMap = { project: tasks, habit: habits, skill: skills }[type];
  const edit = { project: editTask, habit: editHabit, skill: editSkill }[type];
  const path = findTaskPath(allMap, current.id) || [];
  const parentId = path.length > 1 ? path[path.length - 2] : null;
  const parentTask = parentId ? findTaskById(allMap, parentId) : null;
  const openTask = (t) => navigation.push('Task', { id: t.id, type });
  const rootTitles = { project: 'Projects', habit: 'Habits', skill: 'Skills' };
  const rootTitle = rootTitles[type];

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
    .map((tid) => findTaskById(allMap, tid))
    .filter(Boolean);

  const available = tasksAtSameLevelWithChildren(allMap, current.id).filter(
    (t) => t.id !== current.id
  );

  const toggleBlocking = (id) => {
    const exists = current.blockingTasks.includes(id);
    const updated = exists
      ? current.blockingTasks.filter((b) => b !== id)
      : [...current.blockingTasks, id];
    edit(current.id, { blockingTasks: updated });
    setCurrent({ ...current, blockingTasks: updated });
  };

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.background }]}>
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
        ListHeaderComponent={(
          <View>
            <Text style={[styles.header, { color: colors.text }]}>{current.title}</Text>
            <Text style={[styles.section, { color: colors.text }]}>Description</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
              value={current.description}
              onChangeText={(t) => edit(current.id, { description: t })}
            />
            <Text style={[styles.section, { color: colors.text }]}>Notes</Text>
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
                <Text style={{ color: colors.text }}>{rootTitle}</Text>
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
            <Text style={[styles.subHeader, { color: colors.text }]}>Manage Blocking</Text>
            {available.map((t) => (
              <TouchableOpacity key={t.id} onPress={() => toggleBlocking(t.id)} style={styles.relationRow}>
                <Text style={{ color: colors.primary, flex: 1 }}>
                  {current.blockingTasks.includes(t.id) ? 'Remove' : 'Add'} {t.title}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={[styles.container, { backgroundColor: colors.card }]}
      />
    </SafeAreaView>
  );
};

export default TaskScreen;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: 16 },
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
