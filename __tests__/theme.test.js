import { useUserStore } from '../src/store/userStore';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

test('toggleTheme switches theme value', () => {
  const initial = useUserStore.getState().theme;
  useUserStore.getState().toggleTheme();
  const after = useUserStore.getState().theme;
  expect(after).not.toBe(initial);
});
