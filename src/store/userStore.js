import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform, ToastAndroid } from 'react-native';
import { sortTasks } from '../utils/sortTasks';
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
    isLocked: t.blockingTasks.some((id) => !allMap[id] || !allMap[id].isCompleted),
    children: t.children ? applyLockStatus(t.children, allMap) : [],
  }));
};

const updateTasksState = (tasks) =>
  applyLockStatus(applyBlocking(tasks.map(ensureTaskFields)));

const syncTasks = (tasks) => {
  const updated = updateTasksState(tasks);
  return { tasks: updated, projects: updated };
};

const createCategoryActions = (key, initial = []) => (set, get) => {
  const singular = key.replace(/s$/, '');
  const capPlural = key.charAt(0).toUpperCase() + key.slice(1);
  const capSingular = singular.charAt(0).toUpperCase() + singular.slice(1);
  return {
    [key]: initial,
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
          }))
        ),
      })),
    [`complete${capSingular}`]: (id) => {
      set((state) => ({
        [key]: updateTasksState(
          updateTaskById(state[key], id, (t) => ({
            ...t,
            isCompleted: true,
          }))
        ),
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

export const useUserStore = create(
  persist(
    (set, get) => ({
      //Timer production
      isProductionActive: false,
      productionStartTime: null,
      productionSeconds: 0,

      // Waste timer
      isWasteActive: false,
      wasteStartTime: null,
      wasteSeconds: 0,

      productionHistory: [],
      lastProductionReset: new Date().toDateString(),

      setIsWasteActive: (val) => set({ isWasteActive: val }),
      setWasteStartTime: (time) => set({ wasteStartTime: time }),
      setWasteSeconds: (sec) => set({ wasteSeconds: sec }),

      checkProductionReset: () =>
        set((state) => {
          const today = new Date().toDateString();
          if (state.lastProductionReset === today) return {};
          return {
            productionHistory: [
              ...state.productionHistory,
              { date: state.lastProductionReset, seconds: state.productionSeconds },
            ],
            productionSeconds: 0,
            wasteSeconds: 0,
            lastProductionReset: today,
          };
        }),

      // Reset timers
      resetProduction: () =>
        set({
          productionSeconds: 0,
          productionStartTime: Date.now(),
          wasteSeconds: 0,
          wasteStartTime: Date.now(),
        }),

      setIsProductionActive: (val) => set({ isProductionActive: val }),
      setProductionStartTime: (time) => set({ productionStartTime: time }),
      setProductionSeconds: (sec) => set({ productionSeconds: sec }),

      //Tasks
      taskTitle: '',
      setTaskTitle: (title) => set({ taskTitle: title }),

      priority: 'Medium',
      setPriority: (p) => set({ priority: p }),

      tasks: [],
      setTasks: (tasks) => set(syncTasks(tasks)),
      addTask: (task) =>
        set((state) => syncTasks([...state.tasks, task])),
      addSubtask: (parentId, task) =>
        set((state) => {
          const depth = getTaskDepth(state.tasks, parentId);
          if (depth >= 5) return {};
          return syncTasks(addChildTask(state.tasks, parentId, task));
        }),
      editTask: (id, updates) =>
        set((state) =>
          syncTasks(
            updateTaskById(state.tasks, id, (t) => ({ ...t, ...updates }))
          )
        ),
      removeTask: (id) =>
        set((state) => syncTasks(deleteTaskById(state.tasks, id))),
      moveTaskToTop: (id) =>
        set((state) => {
          const index = state.tasks.findIndex((t) => t.id === id);
          if (index === -1) return {};
          const updated = [...state.tasks];
          const [item] = updated.splice(index, 1);
          updated.unshift(item);
          return syncTasks(updated);
        }),
      reorderTasks: (parentId, order) =>
        set((state) =>
          syncTasks(reorderTasksByParentId(state.tasks, parentId, order))
        ),
      toggleTaskCompletion: (id) =>
        set((state) =>
          syncTasks(
            updateTaskById(state.tasks, id, (t) => ({
              ...t,
              isCompleted: !t.isCompleted,
              dateFinished: t.isCompleted ? null : new Date().toISOString(),
            }))
          )
        ),

      // project aliases
      projects: [],
      setProjects: (items) => get().setTasks(items),
      addProject: (item) => get().addTask(item),
      addProjectSubtask: (pid, item) => get().addSubtask(pid, item),
      editProject: (id, upd) => get().editTask(id, upd),
      removeProject: (id) => get().removeTask(id),
      moveProjectToTop: (id) => get().moveTaskToTop(id),
      reorderProjects: (pid, order) => get().reorderTasks(pid, order),
      toggleProjectCompletion: (id) => get().toggleTaskCompletion(id),
      completeProject: (id) => get().completeTask(id),

      ...createCategoryActions('habits')(set, get),
      ...createCategoryActions('skills')(set, get),

      // Profile
      name: '',
      setName: (val) => set({ name: val }),

      activeTaskId: null,
      setActiveTaskId: (id) => set({ activeTaskId: id }),

      completeTask: (id) => {
        set((state) => ({
          tasks: updateTasksState(
            updateTaskById(state.tasks, id, (t) => ({
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

      focusMinutes: 25,
      setFocusMinutes: (m) => set({ focusMinutes: m }),
      xpPerFocus: 10,
      setXpPerFocus: (v) => set({ xpPerFocus: v }),
      breakMinutes: 5,
      setBreakMinutes: (v) => set({ breakMinutes: v }),
      breakSeconds: 0,
      setBreakSeconds: (v) => set({ breakSeconds: v }),
      isOnBreak: false,
      setIsOnBreak: (v) => set({ isOnBreak: v }),
      inactivityMinutes: 15,
      setInactivityMinutes: (v) => set({ inactivityMinutes: v }),
      focusStartTime: null,
      setFocusStartTime: (t) => set({ focusStartTime: t }),

      isTimerRunning: false,
      setIsTimerRunning: (v) => set({ isTimerRunning: v }),
      
      isFocusModeVisible: false,
      setIsFocusModeVisible: (v) => set({ isFocusModeVisible: v }),

      secondsLeft: 0,
      setSecondsLeft: (v) => set({ secondsLeft: v }),

    intervalId: null,
    setIntervalId: (id) => set({ intervalId: id }),

      // Level and XP
      xp: 0,
      dailyXp: 0,
      level: 1,
      streak: 0,
      lastCompleteDate: null,
      setXp: (val) => set({ xp: val }),
      addXp: (val) =>
        set((state) => ({ xp: state.xp + val, dailyXp: state.dailyXp + val })),
      setLevel: (val) => set({ level: val }),
      checkLevel: () =>
        set((state) => ({ level: Math.floor(state.xp / 100) + 1 })),
      updateStreak: () =>
        set((state) => {
          const today = new Date().toDateString();
          if (state.lastCompleteDate === today) return {};
          const yesterday = new Date(Date.now() - 86400000).toDateString();
          const streak =
            state.lastCompleteDate === yesterday ? state.streak + 1 : 1;
          return { streak, lastCompleteDate: today };
        }),

      // Theme
      theme: 'light',
      toggleTheme: () =>
      set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

      // Difficulty
      difficulty: 'normal',
      setDifficulty: (val) => set({ difficulty: val }),
    }),
    {
      name: 'levelx-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

Object.defineProperty(global, 'projects', {
  get: () => useUserStore.getState().projects,
  configurable: true,
});
global.addproject = (item) => useUserStore.getState().addProject(item);
global.addprojectSubtask = (id, item) =>
  useUserStore.getState().addProjectSubtask(id, item);

