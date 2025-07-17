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
    }),
    {
      name: 'levelx-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);



