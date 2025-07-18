import { startTimer, stopTimer, resumeTimer } from '../src/services/timer';
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
