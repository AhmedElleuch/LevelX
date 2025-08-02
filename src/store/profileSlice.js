const createProfileSlice = (set) => ({
  name: '',
  setName: (val) => set({ name: val }),
  activeTaskId: null,
  setActiveTaskId: (id) => set({ activeTaskId: id }),
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
  theme: 'light',
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  difficulty: 'normal',
  setDifficulty: (val) => set({ difficulty: val }),
});

export default createProfileSlice;