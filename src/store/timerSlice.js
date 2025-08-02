const createTimerSlice = (set) => ({
  isProductionActive: false,
  productionStartTime: null,
  productionSeconds: 0,
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
});

export default createTimerSlice;