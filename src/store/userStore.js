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
} from '../utils/taskTree';

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
      setTasks: (tasks) => set({ tasks }),
      addTask: (task) =>
        set((state) => ({ tasks: [...state.tasks, task] })),
      addSubtask: (parentId, task) =>
        set((state) => {
          const depth = getTaskDepth(state.tasks, parentId);
          if (depth >= 5) return {};
          return { tasks: addChildTask(state.tasks, parentId, task) };
        }),
      editTask: (id, updates) =>
        set((state) => ({
          tasks: updateTaskById(state.tasks, id, (t) => ({ ...t, ...updates })),
        })),
      removeTask: (id) =>
        set((state) => ({ tasks: deleteTaskById(state.tasks, id) })),


      moveTaskToTop: (id) =>
        set((state) => {
          const index = state.tasks.findIndex((t) => t.id === id);
          if (index === -1) return {};
          const updated = [...state.tasks];
          const [item] = updated.splice(index, 1);
          updated.unshift(item);
          return { tasks: updated };
        }),

      reorderTasks: (parentId, newOrder) =>
        set((state) => ({
          tasks: reorderTasksByParentId(state.tasks, parentId, newOrder),
        })),

      toggleTaskCompletion: (id) =>
        set((state) => ({
          tasks: updateTaskById(state.tasks, id, (t) => ({
            ...t,
            isCompleted: !t.isCompleted,
          })),
        })),

      habits: [
        {
          id: 'habit-daily',
          title: 'Daily',
          priority: 'Medium',
          isStarted: false,
          isCompleted: false,
          children: [
            {
              id: 'habit-sleep',
              title: 'Sleep',
              priority: 'Medium',
              isStarted: false,
              isCompleted: false,
            },
            {
              id: 'habit-wake',
              title: 'Wake Up',
              priority: 'Medium',
              isStarted: false,
              isCompleted: false,
            },
          ],
        },
      ],
      setHabits: (habits) => set({ habits }),
      addHabit: (habit) =>
        set((state) => ({ habits: [...state.habits, habit] })),
      addHabitSubtask: (parentId, habit) =>
        set((state) => {
          const depth = getTaskDepth(state.habits, parentId);
          if (depth >= 5) return {};
          return { habits: addChildTask(state.habits, parentId, habit) };
        }),
      toggleHabitCompletion: (id) =>
        set((state) => ({
          habits: updateTaskById(state.habits, id, (t) => ({
            ...t,
            isCompleted: !t.isCompleted,
          })),
        })),
      completeHabit: (id) => {
        set((state) => ({
          habits: updateTaskById(state.habits, id, (t) => ({
            ...t,
            isCompleted: true,
          })),
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

      // Profile
      name: '',
      setName: (val) => set({ name: val }),

      activeTaskId: null,
      setActiveTaskId: (id) => set({ activeTaskId: id }),

      completeTask: (id) => {
        set((state) => ({
          tasks: updateTaskById(state.tasks, id, (t) => ({
            ...t,
            isCompleted: true,
            isStarted: false,
          })),
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

