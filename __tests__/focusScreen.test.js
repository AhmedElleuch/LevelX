import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import FocusScreen from '../src/screens/FocusScreen';
import { useUserStore } from '../src/store/userStore';
import { stopTimer } from '../src/services/focusTimer';

jest.useFakeTimers();

jest.mock('../src/services/focusTimer', () => ({
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
  // Optionally, reset Zustand state after each test
  useUserStore.setState({
    tasks: [],
    isTimerRunning: false,
    secondsLeft: 0,
    isFocusModeVisible: false,
    toggleTaskCompletion: () => {},
  });
});

test('renders tasks when timer running', () => {
  act(() => {
    useUserStore.setState({
      tasks: [{ id: '1', title: 'Test', isCompleted: false }],
      isTimerRunning: true,
      secondsLeft: 60,
      isFocusModeVisible: true,
      toggleTaskCompletion: () => {},   // << Avoids undefined error if used
    });
  });

  let tree;
  act(() => {
    tree = renderer.create(
      <SafeAreaProvider>
        <FocusScreen />
      </SafeAreaProvider>
    );
  });

  const json = tree.toJSON();
  expect(JSON.stringify(json)).toContain('Test');
  act(() => {
    tree.unmount();
  });
});

test('shows completed tasks for toggling', () => {
  act(() => {
    useUserStore.setState({
      tasks: [{ id: '1', title: 'Done', isCompleted: true }],
      isTimerRunning: true,
      secondsLeft: 60,
      isFocusModeVisible: true,
      toggleTaskCompletion: () => {},
    });
  });

  let tree;
  act(() => {
    tree = renderer.create(
      <SafeAreaProvider>
        <FocusScreen />
      </SafeAreaProvider>
    );
  });

  const json = tree.toJSON();
  expect(JSON.stringify(json)).toContain('Done');
  act(() => {
    tree.unmount();
  });
});

test('stop button triggers stopTimer', () => {
  act(() => {
    useUserStore.setState({
      tasks: [],
      isTimerRunning: true,
      secondsLeft: 60,
      isFocusModeVisible: true,
      toggleTaskCompletion: () => {},
    });
  });

  let tree;
  act(() => {
    tree = renderer.create(
      <SafeAreaProvider>
        <FocusScreen />
      </SafeAreaProvider>
    );
  });

  // You may have multiple TouchableOpacity (e.g. one for each task), so find the one with "Stop" label
  const stopButton = tree.root.findAllByType(TouchableOpacity).find(
    btn =>
      btn.props.children &&
      btn.props.children.props &&
      btn.props.children.props.children === 'Stop'
  );
  expect(stopButton).toBeTruthy();

  act(() => {
    stopButton.props.onPress();
  });
  expect(stopTimer).toHaveBeenCalled();

  act(() => {
    tree.unmount();
  });
});

test('stop button has accessibility role', () => {
  act(() => {
    useUserStore.setState({
      tasks: [],
      isTimerRunning: true,
      secondsLeft: 60,
      isFocusModeVisible: true,
      toggleTaskCompletion: () => {},
    });
  });

  let tree;
  act(() => {
    tree = renderer.create(
      <SafeAreaProvider>
        <FocusScreen />
      </SafeAreaProvider>
    );
  });

  const stopButton = tree.root.findAllByType(TouchableOpacity).find(
    btn => btn.props.accessibilityLabel === 'Stop focus mode'
  );
  expect(stopButton.props.accessibilityRole).toBe('button');

  act(() => {
    tree.unmount();
  });
});