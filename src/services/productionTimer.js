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

export const pauseProductionTimer = () => {
  if (productionInterval) {
    clearInterval(productionInterval);
    productionInterval = null;
  }
  if (inactivityInterval) {
    clearInterval(inactivityInterval);
    inactivityInterval = null;
  }
};

export const pauseWasteTimer = () => {
  if (wasteInterval) {
    clearInterval(wasteInterval);
    wasteInterval = null;
  }
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
  const {
    isProductionActive,
    activeTaskId,
    productionStartTime,
    setProductionSeconds,
  } = useUserStore.getState();

  if (isProductionActive && !activeTaskId) {
    stopProductionTimer();
    return;
  }

  if (isProductionActive) {
    const elapsed = Math.floor((Date.now() - productionStartTime) / 1000);
    setProductionSeconds(elapsed);
    if (!productionInterval) {
      productionInterval = setInterval(() => {
        const { productionSeconds: current, setProductionSeconds: update } =
          useUserStore.getState();
        update(current + 1);
      }, 1000);
    }
    if (!inactivityInterval) {
      startInactivityCheck();
    }
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
  const { isWasteActive, wasteStartTime, setWasteSeconds } =
    useUserStore.getState();
  if (isWasteActive) {
    const elapsed = Math.floor((Date.now() - wasteStartTime) / 1000);
    setWasteSeconds(elapsed);
    if (!wasteInterval) {
      wasteInterval = setInterval(() => {
        const { wasteSeconds: current, setWasteSeconds: update } =
          useUserStore.getState();
        update(current + 1);
      }, 1000);
    }
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

