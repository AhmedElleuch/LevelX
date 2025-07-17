import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import PerformanceScreen from './src/screens/PerformanceScreen';
import DropdownMenu from './src/components/DropdownMenu';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerRight: () => <DropdownMenu />,
          tabBarIcon: ({ color, size }) => {
            const icon = route.name === 'Home' ? 'home' : 'insert-chart';
            return <MaterialIcons name={icon} color={color} size={size} />;
          },
        })}
      >
        <Tab.Screen name='Home' component={HomeScreen} />
        <Tab.Screen name='Performance' component={PerformanceScreen} />
        </Tab.Navigator>
    </NavigationContainer>
  );
}