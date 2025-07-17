import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import PerformanceScreen from './src/screens/PerformanceScreen';
import DropdownMenu from './src/components/DropdownMenu';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerRight: () => <DropdownMenu /> }}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Performance" component={PerformanceScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}