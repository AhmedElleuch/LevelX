import { startProductionTimer, stopProductionTimer, startWasteTimer } from '../src/services/timer';
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
});
