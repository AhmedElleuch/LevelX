import {
  startProductionTimer,
  stopProductionTimer,
  startWasteTimer,
  resumeProductionTimer,
  resetProduction,
  startBreakTimer,
} from '../src/services/productionTimer';

import { useUserStore } from '../src/store/userStore';

jest.useFakeTimers();

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('timers interaction', () => {
  beforeEach(() => {
    const state = useUserStore.getState();
    state.setIsProductionActive(false);
    state.setIsWasteActive(false);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  test('starting production stops waste timer', () => {
    startWasteTimer();
    expect(useUserStore.getState().isWasteActive).toBe(true);
    useUserStore.getState().setActiveTaskId('1');
    startProductionTimer();
    expect(useUserStore.getState().isProductionActive).toBe(true);
    expect(useUserStore.getState().isWasteActive).toBe(false);
  });

  test('stopping production starts waste timer', () => {
    useUserStore.getState().setActiveTaskId('1');
    startProductionTimer();
    stopProductionTimer();
    expect(useUserStore.getState().isProductionActive).toBe(false);
    expect(useUserStore.getState().isWasteActive).toBe(true);
  });

  test('production timer stops when no task is active', () => {
    useUserStore.getState().setActiveTaskId(null);
    startProductionTimer();
    useUserStore.getState().setActiveTaskId('1');
    resumeProductionTimer();
    expect(useUserStore.getState().isProductionActive).toBe(false);
    expect(useUserStore.getState().isWasteActive).toBe(false);
  });

  test('production timer does not start without active task', () => {
    useUserStore.getState().setActiveTaskId(null);
    startProductionTimer();
    expect(useUserStore.getState().isProductionActive).toBe(false);
  });

  test('resetProduction zeros timers', () => {
    useUserStore.getState().setProductionSeconds(50);
    useUserStore.getState().setWasteSeconds(40);
    resetProduction();
    const state = useUserStore.getState();
    expect(state.productionSeconds).toBe(0);
    expect(state.wasteSeconds).toBe(0);
  });

  test('production auto stops after 15 min inactive', () => {
    const state = useUserStore.getState();
    state.setActiveTaskId('1');
    state.setIsTimerRunning(false);
    state.setInactivityMinutes(15);
    startProductionTimer();
    jest.advanceTimersByTime(900000);
    expect(useUserStore.getState().isProductionActive).toBe(false);
  });

  test('startBreakTimer countdown ends then waste starts', () => {
    const state = useUserStore.getState();
    state.setBreakMinutes(1);
    startBreakTimer();
    expect(useUserStore.getState().isOnBreak).toBe(true);
    jest.advanceTimersByTime(30000);
    expect(useUserStore.getState().breakSeconds).toBe(30);
    jest.advanceTimersByTime(31000);
    expect(useUserStore.getState().isOnBreak).toBe(false);
    expect(useUserStore.getState().isWasteActive).toBe(true);
  });

  test('break end stops production when no task', () => {
    const state = useUserStore.getState();
    state.setBreakMinutes(1);
    state.setIsProductionActive(true);
    state.setActiveTaskId(null);
    startBreakTimer();
    jest.advanceTimersByTime(61000);
    expect(useUserStore.getState().isProductionActive).toBe(false);
  });
});

