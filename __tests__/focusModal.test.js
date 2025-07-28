import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import FocusModal from '../src/components/FocusModal';
import { useUserStore } from '../src/store/userStore';
import { stopTimer } from '../src/services/timer';

jest.useFakeTimers();

jest.mock('../src/services/timer', () => ({
  stopTimer: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useTheme: () => ({ colors: { text: '#000', background: '#fff' } }),
}));

afterEach(() => {
  jest.clearAllTimers();
});

test('renders tasks when timer running', () => {
  useUserStore.setState({
    tasks: [{ id: '1', title: 'Test', isCompleted: false }],
    isTimerRunning: true,
    secondsLeft: 60,
  });
  let tree;
  act(() => {
    tree = renderer.create(
      <SafeAreaProvider>
        <FocusModal />
      </SafeAreaProvider>
    );
  });
  const json = tree.toJSON();
  expect(JSON.stringify(json)).toContain('Test');
  act(() => {
    tree.unmount();
  });
});

test('stop button triggers stopTimer', () => {
  useUserStore.setState({
    tasks: [],
    isTimerRunning: true,
    secondsLeft: 60,
  });
  let tree;
  act(() => {
    tree = renderer.create(
      <SafeAreaProvider>
        <FocusModal />
      </SafeAreaProvider>
    );
  });
  act(() => {
    tree.root.findByType(TouchableOpacity).props.onPress();
  });
  expect(stopTimer).toHaveBeenCalled();
  act(() => {
    tree.unmount();
  });
});