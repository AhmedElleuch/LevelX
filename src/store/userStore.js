import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform, ToastAndroid } from 'react-native';
import { sortTasks } from '../utils/sortTasks';

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

      setIsWasteActive: (val) => set({ isWasteActive: val }),
      setWasteStartTime: (time) => set({ wasteStartTime: time }),
      setWasteSeconds: (sec) => set({ wasteSeconds: sec }),

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
      removeTask: (id) =>
      set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),

      acceptedMissions: [],
      acceptMission: (id) =>
        set((state) => ({
          acceptedMissions: [...state.acceptedMissions, id],
        })),

      moveTaskToTop: (id) =>
        set((state) => {
          const index = state.tasks.findIndex((t) => t.id === id);
          if (index === -1) return {};
          const updated = [...state.tasks];
          const [item] = updated.splice(index, 1);
          updated.unshift(item);
          return { tasks: updated };
        }),

      // Profile
      name: '',
      setName: (val) => set({ name: val }),

      activeTaskId: null,
      setActiveTaskId: (id) => set({ activeTaskId: id }),

      completeTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, isCompleted: true, isStarted: false } : t
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

      isTimerRunning: false,
      setIsTimerRunning: (v) => set({ isTimerRunning: v }),

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

