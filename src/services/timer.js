import { Alert } from 'react-native';
import { useUserStore } from '../store/userStore';

let productionInterval = null;
let wasteInterval = null;

export const startProductionTimer = () => {
  const {
    isProductionActive,
    activeTaskId,
    setIsProductionActive,
    setProductionStartTime,
    setProductionSeconds,
    isWasteActive,
  } = useUserStore.getState();

  if (isProductionActive) return;
  if (!activeTaskId) return;

  if (isWasteActive) stopWasteTimer();

  setIsProductionActive(true);
  setProductionStartTime(Date.now());
  setProductionSeconds(0);

  productionInterval = setInterval(() => {
    const { productionStartTime } = useUserStore.getState();
    const elapsed = Math.floor((Date.now() - productionStartTime) / 1000);
    setProductionSeconds(elapsed);
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
      const { productionStartTime, setProductionSeconds } =
        useUserStore.getState();
      const elapsed = Math.floor((Date.now() - productionStartTime) / 1000);
      setProductionSeconds(elapsed);
    }, 1000);
  }
};

export const stopProductionTimer = () => {
  const { isProductionActive, setIsProductionActive } = useUserStore.getState();
  if (!isProductionActive) return;

  clearInterval(productionInterval);
  productionInterval = null;
  setIsProductionActive(false);
  startWasteTimer();
};

export const startTimer = () => {
  const {
    setSecondsLeft,
    setIsTimerRunning,
    setIntervalId,
    focusMinutes,
  } = useUserStore.getState();

  setSecondsLeft(focusMinutes * 60);
  setIsTimerRunning(true);

  const id = setInterval(() => {
  const { secondsLeft, activeTaskId, completeTask } = useUserStore.getState();

    if (secondsLeft <= 1) {
      clearInterval(id);
      setIsTimerRunning(false);
      setSecondsLeft(0);
      completeTask(activeTaskId);
      stopWasteTimer();
      Alert.alert('Focus session complete! ✅');
    } else {
      setSecondsLeft(secondsLeft - 1);
    }
  }, 1000);

  setIntervalId(id);
};

export const resumeTimer = () => {
  const { secondsLeft, intervalId, setIsTimerRunning } =
    useUserStore.getState();

  if (secondsLeft <= 0 || intervalId) return;
  setIsTimerRunning(true);

  const id = setInterval(() => {
    const { secondsLeft: current, activeTaskId, completeTask } =
      useUserStore.getState();

    if (current <= 1) {
      clearInterval(id);
      useUserStore.getState().setIsTimerRunning(false);
      useUserStore.getState().setSecondsLeft(0);
      completeTask(activeTaskId);
      stopProductionTimer();
      Alert.alert('Focus session complete! ✅');
    } else {
      useUserStore.getState().setSecondsLeft(current - 1);
    }
  }, 1000);

  useUserStore.getState().setIntervalId(id);
};

export const stopTimer = () => {
  const { intervalId, setIsTimerRunning, setIntervalId } = useUserStore.getState();
  if (intervalId) {
    clearInterval(intervalId);
    setIntervalId(null);
  }
  setIsTimerRunning(false);
 stopProductionTimer();
};

export const startWasteTimer = () => {
  const {
    isWasteActive,
    setIsWasteActive,
    setWasteStartTime,
    setWasteSeconds,
  } = useUserStore.getState();

  if (isWasteActive) return;

  setIsWasteActive(true);
  setWasteStartTime(Date.now());
  setWasteSeconds(0);

  wasteInterval = setInterval(() => {
    const { wasteStartTime } = useUserStore.getState();
    const elapsed = Math.floor((Date.now() - wasteStartTime) / 1000);
    setWasteSeconds(elapsed);
  }, 1000);
};

export const resumeWasteTimer = () => {
  const { isWasteActive } = useUserStore.getState();
  if (isWasteActive && !wasteInterval) {
    wasteInterval = setInterval(() => {
      const { wasteStartTime, setWasteSeconds } = useUserStore.getState();
      const elapsed = Math.floor((Date.now() - wasteStartTime) / 1000);
      setWasteSeconds(elapsed);
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

