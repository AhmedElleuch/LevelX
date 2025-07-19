import React from 'react';
import renderer from 'react-test-renderer';
import HomeScreen from '../src/screens/HomeScreen';
import { useUserStore } from '../src/store/userStore';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useTheme: () => ({ colors: { text: '#000', background: '#fff', card: '#fff', border: '#000' } }),
}));

test('header renders when task list is empty', () => {
  useUserStore.setState({ tasks: [] });
  const tree = renderer.create(<HomeScreen />);
  expect(() => tree.root.findByProps({ children: 'Welcome back!' })).not.toThrow();
});
