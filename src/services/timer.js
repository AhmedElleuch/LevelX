import { Alert } from 'react-native';
import { useUserStore } from '../store/userStore';

let productionInterval = null;

export const startProductionTimer = () => {
  const {
    isProductionActive,
    setIsProductionActive,
    setProductionStartTime,
    setProductionSeconds,
  } = useUserStore.getState();

  if (isProductionActive) return;

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
  const { isProductionActive } = useUserStore.getState();
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
      Alert.alert('Focus session complete! ✅');
    } else {
      setSecondsLeft(secondsLeft - 1);
    }
  }, 1000);

  setIntervalId(id);
};

export const resumeTimer = () => {
  const { isTimerRunning, secondsLeft, intervalId } = useUserStore.getState();
  if (!isTimerRunning || intervalId) return;

  const id = setInterval(() => {
    const { secondsLeft: current, activeTaskId, completeTask } =
      useUserStore.getState();

    if (current <= 1) {
      clearInterval(id);
      useUserStore.getState().setIsTimerRunning(false);
      useUserStore.getState().setSecondsLeft(0);
      completeTask(activeTaskId);
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
};