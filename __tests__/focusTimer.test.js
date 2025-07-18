import { startTimer, stopTimer, resumeTimer, startProductionTimer } from '../src/services/timer';
import { useUserStore } from '../src/store/userStore';

jest.useFakeTimers();

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

test('resumeTimer continues after stop', () => {
  const store = useUserStore.getState();
  store.setFocusMinutes(1);
  store.setActiveTaskId('1');
  startTimer();
  jest.advanceTimersByTime(30000);
  stopTimer();
  const paused = useUserStore.getState().secondsLeft;
  resumeTimer();
  jest.advanceTimersByTime(1000);
  expect(useUserStore.getState().secondsLeft).toBe(paused - 1);
});

test('resumeTimer stops waste counter', () => {
  const state = useUserStore.getState();
  state.setFocusMinutes(1);
  state.setActiveTaskId('1');
  startProductionTimer();
  startTimer();
  jest.advanceTimersByTime(1000);
  stopTimer();
  const wasteBefore = useUserStore.getState().wasteSeconds;
  resumeTimer();
  jest.advanceTimersByTime(2000);
  expect(useUserStore.getState().wasteSeconds).toBe(wasteBefore);
});
