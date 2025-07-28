import {
  startProductionTimer,
  stopProductionTimer,
  startWasteTimer,
  resumeProductionTimer,
  resetProduction,
} from '../src/services/timer';

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

  test('production auto stops after 10 min inactive', () => {
    const state = useUserStore.getState();
    state.setActiveTaskId('1');
    state.setIsTimerRunning(false);
    startProductionTimer();
    jest.advanceTimersByTime(600000);
    expect(useUserStore.getState().isProductionActive).toBe(false);
  });
});

