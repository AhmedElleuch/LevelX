import { startTimer, stopTimer, resumeTimer } from '../src/services/timer';
import { useUserStore } from '../src/store/userStore';

jest.useFakeTimers();

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

test('resumeTimer continues after stop', () => {
  const state = useUserStore.getState();
  state.setFocusMinutes(1);
  startTimer();
  jest.advanceTimersByTime(30000);
  stopTimer();
  expect(state.secondsLeft).toBe(30);
  resumeTimer();
  jest.advanceTimersByTime(1000);
  expect(state.secondsLeft).toBe(29);
});
