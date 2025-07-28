import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import PerformanceScreen from './src/screens/PerformanceScreen';
import HomeScreen from './src/screens/HomeScreen';
import DropdownMenu from './src/components/DropdownMenu';
import { useUserStore } from './src/store/userStore';
import { getThemeColors } from './src/utils/themeColors';
import { AppState } from 'react-native';
import { stopProductionTimer } from './src/services/timer';

const Tab = createBottomTabNavigator();

const App = () => {
  const mode = useUserStore((s) => s.theme);
  const colors = getThemeColors(mode);
  const theme = mode === 'dark'
    ? { ...DarkTheme, colors: { ...DarkTheme.colors, ...colors } }
    : { ...DefaultTheme, colors: { ...DefaultTheme.colors, ...colors } };

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'inactive' || state === 'background') {
        stopProductionTimer();
      }
    });
    return () => sub.remove();
  }, []);
  return (
    <NavigationContainer theme={theme}>
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
};

export default App;
