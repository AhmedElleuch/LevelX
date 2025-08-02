import { Alert, Platform, ToastAndroid } from 'react-native';
import {
  addChildTask,
  deleteTaskById,
  updateTaskById,
  getTaskDepth,
  reorderTasksByParentId,
  flattenTasks,
} from '../utils/taskTree';

const ensureTaskFields = (task) => ({
  id: task.id,
  title: task.title,
  priority: task.priority || 'Low',
  isStarted: task.isStarted || false,
  isCompleted: task.isCompleted || false,
  isManuallyLocked: task.isManuallyLocked || false,
  dateCreated: task.dateCreated || new Date().toISOString(),
  dateStarted: 'dateStarted' in task ? task.dateStarted : null,
  dateFinished: 'dateFinished' in task ? task.dateFinished : null,
  description: task.description || '',
  dod: task.dod || '',
  userNotes: task.userNotes || [],
  blockingTasks: task.blockingTasks || [],
  children: task.children ? task.children.map(ensureTaskFields) : [],
});

const applyBlocking = (tasks) =>
  tasks.map((t) => ({
    ...t,
    children: t.children ? applyBlocking(t.children) : [],
  }));

const applyLockStatus = (tasks, allMap = null) => {
  if (!allMap) {
    const flat = flattenTasks(tasks);
    const map = {};
    flat.forEach((t) => {
      map[t.id] = t;
    });
    return applyLockStatus(tasks, map);
  }
  return tasks.map((t) => ({
    ...t,
    isLocked:
      t.isManuallyLocked ||
      t.blockingTasks.some((id) => !allMap[id] || !allMap[id].isCompleted),
    children: t.children ? applyLockStatus(t.children, allMap) : [],
  }));
};

const updateTasksState = (tasks) =>
  applyLockStatus(applyBlocking(tasks.map(ensureTaskFields)));

const createCategorySlice = (key) => (set, get) => {
  const singular = key.replace(/s$/, '');
  const capPlural = key.charAt(0).toUpperCase() + key.slice(1);
  const capSingular = singular.charAt(0).toUpperCase() + singular.slice(1);
  return {
    [key]: [],
    [`set${capPlural}`]: (items) => set({ [key]: updateTasksState(items) }),
    [`add${capSingular}`]: (item) =>
      set((state) => ({ [key]: updateTasksState([...state[key], item]) })),
    [`add${capSingular}Subtask`]: (parentId, item) =>
      set((state) => {
        const depth = getTaskDepth(state[key], parentId);
        if (depth >= 5) return {};
        return {
          [key]: updateTasksState(addChildTask(state[key], parentId, item)),
        };
      }),
    [`edit${capSingular}`]: (id, updates) =>
      set((state) => ({
        [key]: updateTasksState(
          updateTaskById(state[key], id, (t) => ({ ...t, ...updates }))
        ),
      })),
    [`remove${capSingular}`]: (id) =>
      set((state) => ({ [key]: updateTasksState(deleteTaskById(state[key], id)) })),
    [`move${capSingular}ToTop`]: (id) =>
      set((state) => {
        const index = state[key].findIndex((t) => t.id === id);
        if (index === -1) return {};
        const updated = [...state[key]];
        const [item] = updated.splice(index, 1);
        updated.unshift(item);
        return { [key]: updateTasksState(updated) };
      }),
    [`reorder${capPlural}`]: (parentId, order) =>
      set((state) => ({
        [key]: updateTasksState(
          reorderTasksByParentId(state[key], parentId, order)
        ),
      })),
    [`toggle${capSingular}Completion`]: (id) =>
      set((state) => ({
        [key]: updateTasksState(
          updateTaskById(state[key], id, (t) => ({
            ...t,
            isCompleted: !t.isCompleted,
            dateFinished: t.isCompleted ? null : new Date().toISOString(),
          }))
        ),
      })),
    [`toggle${capSingular}Lock`]: (id) =>
      set((state) => ({
        [key]: updateTasksState(
          updateTaskById(state[key], id, (t) => ({
            ...t,
            isManuallyLocked: !t.isManuallyLocked,
          }))
        ),
      })),
    [`complete${capSingular}`]: (id) => {
      set((state) => ({
        [key]: updateTasksState(
          updateTaskById(state[key], id, (t) => ({
            ...t,
            isCompleted: true,
            isStarted: false,
            dateFinished: new Date().toISOString(),
          }))
        ),
        activeTaskId: state.activeTaskId === id ? null : state.activeTaskId,
      }));
      const { addXp, checkLevel, updateStreak } = get();
      addXp(25);
      checkLevel();
      updateStreak();
      if (Platform.OS === 'android') {
        ToastAndroid.show('+25 XP!', ToastAndroid.SHORT);
      } else {
        Alert.alert('+25 XP!');
      }
    },
  };
};

export default createCategorySlice;