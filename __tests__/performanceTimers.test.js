import {
  startProductionTimer,
  stopProductionTimer,
  startWasteTimer,
  resumeProductionTimer,
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
    startProductionTimer();
    expect(useUserStore.getState().isProductionActive).toBe(true);
    expect(useUserStore.getState().isWasteActive).toBe(false);
  });

  test('stopping production starts waste timer', () => {
    startProductionTimer();
    stopProductionTimer();
    expect(useUserStore.getState().isProductionActive).toBe(false);
    expect(useUserStore.getState().isWasteActive).toBe(true);
  });

  test('production timer stops when no task is active', () => {
    startProductionTimer();
    useUserStore.getState().setActiveTaskId(null);
    resumeProductionTimer();
    expect(useUserStore.getState().isProductionActive).toBe(false);
    expect(useUserStore.getState().isWasteActive).toBe(true);
  });
});
