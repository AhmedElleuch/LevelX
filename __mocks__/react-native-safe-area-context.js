import React from 'react';
import { View } from 'react-native';

export const SafeAreaView = ({ children }) => <View>{children}</View>;
export const SafeAreaProvider = ({ children }) => <View>{children}</View>;
export const useSafeAreaInsets = () => ({ top: 0, bottom: 0, left: 0, right: 0 });
export default {
  SafeAreaView,
  SafeAreaProvider,
  useSafeAreaInsets,
};
