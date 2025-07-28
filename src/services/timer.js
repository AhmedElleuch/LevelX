import { Alert } from 'react-native';
import { useUserStore } from '../store/userStore';

let productionInterval = null;
let wasteInterval = null;
let inactivityInterval = null;
let breakInterval = null;
let inactiveSeconds = 0;

const startInactivityCheck = () => {
  if (inactivityInterval) return;
  inactivityInterval = setInterval(() => {
    const { isTimerRunning, inactivityMinutes } = useUserStore.getState();
    if (isTimerRunning) {
      inactiveSeconds = 0;
    } else {
      inactiveSeconds += 1;
      if (inactiveSeconds >= inactivityMinutes * 60) {
        stopProductionTimer();
      }
    }
  }, 1000);
};

const stopInactivityCheck = () => {
  clearInterval(inactivityInterval);
  inactivityInterval = null;
  inactiveSeconds = 0;
};

export const startBreakTimer = () => {
  const { breakMinutes, setBreakSeconds, setIsOnBreak } =
    useUserStore.getState();
  if (breakInterval) return;
  setIsOnBreak(true);
  setBreakSeconds(breakMinutes * 60);
  breakInterval = setInterval(() => {
    const {
      breakSeconds,
      setBreakSeconds: update,
      setIsOnBreak: setBreak,
    } = useUserStore.getState();
    if (breakSeconds <= 1) {
      clearInterval(breakInterval);
      breakInterval = null;
      update(0);
      setBreak(false);
      startWasteTimer();
    } else {
      update(breakSeconds - 1);
    }
  }, 1000);
};

export const stopBreakTimer = () => {
  if (breakInterval) {
    clearInterval(breakInterval);
    breakInterval = null;
  }
  const { setIsOnBreak, setBreakSeconds } = useUserStore.getState();
  setIsOnBreak(false);
  setBreakSeconds(0);
};

export const startProductionTimer = () => {
  const {
    isProductionActive,
    activeTaskId,
    setIsProductionActive,
    setProductionStartTime,
    setProductionSeconds,
    productionSeconds,
    isWasteActive,
    checkProductionReset,
  } = useUserStore.getState();

  if (isProductionActive) return;
  if (!activeTaskId) return;

  checkProductionReset();

  if (isWasteActive) stopWasteTimer();

  setIsProductionActive(true);
  setProductionStartTime(Date.now());

  inactiveSeconds = 0;
  startInactivityCheck();

  productionInterval = setInterval(() => {
    const { productionSeconds: current } = useUserStore.getState();
    setProductionSeconds(current + 1);
  }, 1000);
};

export const resumeProductionTimer = () => {
  const { isProductionActive, activeTaskId } = useUserStore.getState();

  if (isProductionActive && !activeTaskId) {
    stopProductionTimer();
    return;
  }
  if (isProductionActive && !productionInterval) {
    productionInterval = setInterval(() => {
      const { productionSeconds, setProductionSeconds } =
        useUserStore.getState();
      setProductionSeconds(productionSeconds + 1);
    }, 1000);
  }
  if (isProductionActive && !inactivityInterval) {
    startInactivityCheck();
  }
};

export const stopProductionTimer = () => {
  const { isProductionActive, setIsProductionActive } = useUserStore.getState();
  if (!isProductionActive) return;

  clearInterval(productionInterval);
  productionInterval = null;
  stopInactivityCheck();
  setIsProductionActive(false);
  startWasteTimer();
};

export const startTimer = () => {
  const {
    setSecondsLeft,
    setIsTimerRunning,
    setIntervalId,
    focusMinutes,
    setFocusStartTime,
    xpPerFocus,
    addXp,
    breakMinutes,
  } = useUserStore.getState();

  stopBreakTimer();

  setSecondsLeft(focusMinutes * 60);
  setIsTimerRunning(true);
  setFocusStartTime(Date.now());

  const id = setInterval(() => {
  const { secondsLeft, activeTaskId, completeTask } = useUserStore.getState();
    inactiveSeconds = 0;

    if (secondsLeft <= 1) {
      clearInterval(id);
      setIsTimerRunning(false);
      setSecondsLeft(0);
      completeTask(activeTaskId);
      addXp(xpPerFocus);
      setFocusStartTime(null);
      stopWasteTimer();
      startBreakTimer();
      Alert.alert('Focus session complete! ✅');
    } else {
      setSecondsLeft(secondsLeft - 1);
    }
  }, 1000);

  setIntervalId(id);
};

export const resumeTimer = () => {
  const {
    secondsLeft,
    intervalId,
    setIsTimerRunning,
    isProductionActive,
    setFocusStartTime,
    xpPerFocus,
    addXp,
  } = useUserStore.getState();

  stopBreakTimer();

  if (secondsLeft <= 0 || intervalId) return;

  stopWasteTimer();

  if (!isProductionActive) {
    startProductionTimer();
  } else {
    resumeProductionTimer();
  }

  setIsTimerRunning(true);
  setFocusStartTime(Date.now());

  const id = setInterval(() => {
    const { secondsLeft: current, activeTaskId, completeTask } =
      useUserStore.getState();
    inactiveSeconds = 0;

    if (current <= 1) {
      clearInterval(id);
      useUserStore.getState().setIsTimerRunning(false);
      useUserStore.getState().setSecondsLeft(0);
      completeTask(activeTaskId);
      addXp(xpPerFocus);
      useUserStore.getState().setFocusStartTime(null);
      stopProductionTimer();
      startBreakTimer();
      Alert.alert('Focus session complete! ✅');
    } else {
      useUserStore.getState().setSecondsLeft(current - 1);
    }
  }, 1000);

  useUserStore.getState().setIntervalId(id);
};

export const stopTimer = () => {
  const {
    intervalId,
    setIsTimerRunning,
    setIntervalId,
    secondsLeft,
    focusMinutes,
    xpPerFocus,
    addXp,
    setSecondsLeft,
    focusStartTime,
    setFocusStartTime,
    setActiveTaskId,
  } = useUserStore.getState();
  if (intervalId) {
    clearInterval(intervalId);
    setIntervalId(null);
  }
  if (focusStartTime) {
    const total = focusMinutes * 60;
    const elapsed = total - secondsLeft;
    let earned = 0;
    if (elapsed >= total * 0.33) {
      earned = Math.round((elapsed / total) * xpPerFocus);
    }
    addXp(earned);
    setFocusStartTime(null);
  }
  setSecondsLeft(0);
  setIsTimerRunning(false);
  stopProductionTimer();
  setActiveTaskId(null);
  stopBreakTimer();
};

export const startWasteTimer = () => {
  const {
    isWasteActive,
    setIsWasteActive,
    setWasteStartTime,
    setWasteSeconds,
    checkProductionReset,
    } = useUserStore.getState();

  if (isWasteActive) return;

  checkProductionReset();

  setIsWasteActive(true);
  setWasteStartTime(Date.now());

  wasteInterval = setInterval(() => {
    const { wasteSeconds: current, setWasteSeconds } = useUserStore.getState();
    setWasteSeconds(current + 1);
  }, 1000);
};

export const resumeWasteTimer = () => {
  const { isWasteActive } = useUserStore.getState();
  if (isWasteActive && !wasteInterval) {
    wasteInterval = setInterval(() => {
      const { wasteSeconds, setWasteSeconds } = useUserStore.getState();
      setWasteSeconds(wasteSeconds + 1);
    }, 1000);
  }
};

export const stopWasteTimer = () => {
  const { isWasteActive, setIsWasteActive } = useUserStore.getState();
  if (!isWasteActive) return;

  clearInterval(wasteInterval);
  wasteInterval = null;
  setIsWasteActive(false);
};

export const resetProduction = () => {
  const {
    setProductionSeconds,
    setProductionStartTime,
    setWasteSeconds,
    setWasteStartTime,
  } = useUserStore.getState();
  setProductionSeconds(0);
  setProductionStartTime(Date.now());
  setWasteSeconds(0);
  setWasteStartTime(Date.now());
};

