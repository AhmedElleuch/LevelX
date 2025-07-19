import React from 'react';
import renderer from 'react-test-renderer';
import HomeScreen from '../src/screens/HomeScreen';
import { useUserStore } from '../src/store/userStore';

jest.mock('react-native-draggable-flatlist', () => {
  const React = require('react');
  const { View } = require('react-native');
  return ({ data = [], ListHeaderComponent, ListEmptyComponent }) => (
    <View>
      {data.length > 0
        ? ListHeaderComponent && <ListHeaderComponent />
        : ListEmptyComponent && <ListEmptyComponent />}
    </View>
  );
});
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native').View;
  return { Swipeable: View, GestureHandlerRootView: View };
});

jest.useFakeTimers();

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
  let tree;
  renderer.act(() => {
    tree = renderer.create(<HomeScreen />);
  });
  expect(() => tree.root.findByProps({ children: 'Welcome back!' })).not.toThrow();
  tree.unmount();
  jest.runOnlyPendingTimers();
});





