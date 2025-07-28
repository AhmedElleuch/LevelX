import React from 'react';
import renderer from 'react-test-renderer';
import { Text } from 'react-native';
import HomeScreen from '../src/screens/HomeScreen';
import { useUserStore } from '../src/store/userStore';
import { SafeAreaProvider } from 'react-native-safe-area-context';

jest.mock('react-native-draggable-flatlist');
jest.mock('react-native-gesture-handler');
jest.mock('../src/services/timer', () => ({
  resumeProductionTimer: jest.fn(),
  resumeWasteTimer: jest.fn(),
  resumeTimer: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useTheme: () => ({ colors: { text: '#000', background: '#fff', card: '#fff', border: '#000' } }),
}));

jest.useFakeTimers();

afterEach(() => {
  renderer.act(() => {
    jest.runOnlyPendingTimers();
    jest.clearAllTimers();
  });
});

test('header renders when task list is empty', () => {
  renderer.act(() => {
    useUserStore.setState({ tasks: [] });
  });
  let tree;
  renderer.act(() => {
    tree = renderer.create(
      <SafeAreaProvider>
        <HomeScreen />
      </SafeAreaProvider>
    );
  });
  const json = tree.toJSON();
  expect(JSON.stringify(json)).toContain('Welcome back!');
  renderer.act(() => {
    tree.unmount();
  });
});

test('typing does not remount TimerDisplay', () => {
  const log = jest.spyOn(console, 'log').mockImplementation(() => {});
  renderer.act(() => {
    useUserStore.setState({ tasks: [], secondsLeft: 10 });
  });
  let tree;
  renderer.act(() => {
    tree = renderer.create(
      <SafeAreaProvider>
        <HomeScreen />
      </SafeAreaProvider>
    );
  });
  const input = tree.root.findByProps({ placeholder: 'Enter task...' });
  renderer.act(() => {
    input.props.onChangeText('a');
  });
  renderer.act(() => {
    input.props.onChangeText('ab');
  });
  const calls = log.mock.calls.filter((c) => c[0] === 'TimerDisplay mounted');
  expect(calls.length).toBe(1);
  log.mockRestore();
  renderer.act(() => {
    tree.unmount();
  });
});
