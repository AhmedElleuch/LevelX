import { useUserStore } from '../store/userStore';

let productionInterval = null;
let wasteInterval = null;
let inactivityInterval = null;
let breakInterval = null;
let inactiveSeconds = 0;

export const resetInactiveSeconds = () => {
  inactiveSeconds = 0;
};

const startInactivityCheck = () => {
  if (inactivityInterval) return;
  inactivityInterval = setInterval(() => {
    const { isTimerRunning, inactivityMinutes } = useUserStore.getState();
    if (isTimerRunning) {
      resetInactiveSeconds();
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
  resetInactiveSeconds();
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
      const { activeTaskId, isProductionActive } = useUserStore.getState();
      if (!activeTaskId && isProductionActive) {
        stopProductionTimer();
      }
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
    isWasteActive,
    checkProductionReset,
  } = useUserStore.getState();

  if (isProductionActive) return;
  if (!activeTaskId) return;

  checkProductionReset();

  if (isWasteActive) stopWasteTimer();

  setIsProductionActive(true);
  setProductionStartTime(Date.now());

  resetInactiveSeconds();
  startInactivityCheck();

  productionInterval = setInterval(() => {
    const { productionSeconds: current, setProductionSeconds } =
      useUserStore.getState();
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

