import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      
      activeTaskId: null,
      setActiveTaskId: (id) => set({ activeTaskId: id }),

      completeTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, isCompleted: true, isStarted: false } : t
          ),
          activeTaskId: state.activeTaskId === id ? null : state.activeTaskId,
        })),

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
      setXp: (val) => set({ xp: val }),
      addXp: (val) =>
        set((state) => ({ xp: state.xp + val, dailyXp: state.dailyXp + val })),
      setLevel: (val) => set({ level: val }),

      // Theme
      theme: 'light',
      toggleTheme: () =>
      set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'levelx-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);



