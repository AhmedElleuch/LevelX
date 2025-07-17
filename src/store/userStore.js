import { create } from 'zustand';

export const useUserStore = create((set) => ({
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

  focusMinutes: 25,
  setFocusMinutes: (m) => set({ focusMinutes: m }),

  isTimerRunning: false,
  setIsTimerRunning: (v) => set({ isTimerRunning: v }),

  secondsLeft: 0,
  setSecondsLeft: (v) => set({ secondsLeft: v }),

  intervalId: null,
  setIntervalId: (id) => set({ intervalId: id }),
}));


