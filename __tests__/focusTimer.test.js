import { startTimer, stopTimer, resumeTimer } from '../src/services/focusTimer';
import { useUserStore } from '../src/store/userStore';

jest.useFakeTimers();

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

test('stopTimer awards partial xp', () => {
  const store = useUserStore.getState();
  store.setFocusMinutes(3);
  store.setXpPerFocus(9);
  store.setXp(0);
  store.setActiveTaskId('1');
  startTimer();
  jest.advanceTimersByTime(120000);
  stopTimer();
  expect(useUserStore.getState().xp).toBe(6);
});

test('timer cannot resume after stop', () => {
  const state = useUserStore.getState();
  state.setFocusMinutes(1);
  state.setActiveTaskId('1');
  startTimer();
  jest.advanceTimersByTime(20000);
  stopTimer();
  const left = useUserStore.getState().secondsLeft;
  resumeTimer();
  jest.advanceTimersByTime(1000);
  expect(useUserStore.getState().secondsLeft).toBe(left);
});


test('startTimer sets running and shows modal', () => {
  const state = useUserStore.getState();
  state.setFocusMinutes(1);
  state.setActiveTaskId('1');
  startTimer();
  expect(useUserStore.getState().isTimerRunning).toBe(true);
  expect(useUserStore.getState().isFocusModalVisible).toBe(true);
  stopTimer();
});

test('stopTimer clears running and hides modal', () => {
  const state = useUserStore.getState();
  state.setFocusMinutes(1);
  state.setActiveTaskId('1');
  startTimer();
  stopTimer();
  expect(useUserStore.getState().isTimerRunning).toBe(false);
  expect(useUserStore.getState().isFocusModalVisible).toBe(false);
});

test('resumeTimer sets running and shows modal again', () => {
  const state = useUserStore.getState();
  state.setFocusMinutes(1);
  state.setActiveTaskId('1');
  startTimer();
  jest.advanceTimersByTime(1000);
  stopTimer();
  resumeTimer();
  expect(useUserStore.getState().isTimerRunning).toBe(true);
  expect(useUserStore.getState().isFocusModalVisible).toBe(true);
  stopTimer();
});