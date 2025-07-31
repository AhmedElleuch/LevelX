import { useUserStore } from '../src/store/userStore';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

test('placeholder nested tasks test', () => {
  useUserStore.setState({ tasks: [] });
  expect(Array.isArray(useUserStore.getState().tasks)).toBe(true);
});
