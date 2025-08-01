import { Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useUserStore } from '../store/userStore';
import { navigate } from '../navigation/RootNavigation';
import {
  startProductionTimer,
  resumeProductionTimer,
  stopProductionTimer,
  startBreakTimer,
  stopBreakTimer,
  stopWasteTimer,
  resetInactiveSeconds,
} from './ProductionTimer';

export const notifyFocusEnd = async () => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: { title: 'Focus session complete!', sound: true },
      trigger: null,
    });
  } catch (e) {
    // ignore notification errors
  }
};

export const startTimer = () => {
  const {
    setSecondsLeft,
    setIsTimerRunning,
    setIntervalId,
    focusMinutes,
    setFocusStartTime,
    setIsFocusModeVisible,
    xpPerFocus,
    addXp,
  } = useUserStore.getState();

  stopBreakTimer();

  setSecondsLeft(focusMinutes * 60);
  setIsTimerRunning(true);
  setIsFocusModeVisible(true);
  navigate('Focus');
  setFocusStartTime(Date.now());

  const id = setInterval(() => {
    const { secondsLeft, activeTaskId, completeTask } = useUserStore.getState();
    resetInactiveSeconds();

    if (secondsLeft <= 1) {
      clearInterval(id);
      setIsTimerRunning(false);
      setSecondsLeft(0);
      completeTask(activeTaskId);
      addXp(xpPerFocus);
      setFocusStartTime(null);
      setIsFocusModeVisible(false);
      stopWasteTimer();
      startBreakTimer();
      notifyFocusEnd();
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
    setIsFocusModeVisible,
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
  setIsFocusModeVisible(true);
  navigate('Focus');
  setFocusStartTime(Date.now());

  const id = setInterval(() => {
    const { secondsLeft: current, activeTaskId, completeTask } =
      useUserStore.getState();
    resetInactiveSeconds();

    if (current <= 1) {
      clearInterval(id);
      useUserStore.getState().setIsTimerRunning(false);
      useUserStore.getState().setSecondsLeft(0);
      completeTask(activeTaskId);
      useUserStore.getState().setIsFocusModeVisible(false);
      addXp(xpPerFocus);
      useUserStore.getState().setFocusStartTime(null);
      stopProductionTimer();
      startBreakTimer();
      notifyFocusEnd();
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
    setIsFocusModeVisible,
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
  setIsFocusModeVisible(false);
  stopProductionTimer();
  setActiveTaskId(null);
  stopBreakTimer();
};
