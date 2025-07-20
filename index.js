import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React from 'react';
import { registerRootComponent } from 'expo';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import App from './App';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Root = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  </GestureHandlerRootView>
);

registerRootComponent(Root);
