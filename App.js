import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme, ThemeProvider } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import PerformanceScreen from './src/screens/Performance';
import HomeScreen from './src/screens/Home';
import DropdownMenu from './src/components/common/DropdownMenu';
import FocusScreen from './src/screens/FocusScreen';
import TaskScreen from './src/screens/TaskScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { useUserStore } from './src/store/userStore';
import { getThemeColors } from './src/utils/themeColors';
import { View, AppState, StyleSheet } from 'react-native';
import { stopProductionTimer } from './src/services/productionTimer';
import { navigationRef } from './src/navigation/RootNavigation';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainTabs = () => (
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
);

const App = () => {
  const mode = useUserStore((s) => s.theme);
  const isFocusModeVisible = useUserStore((s) => s.isFocusModeVisible);
  const colors = getThemeColors(mode);
  const theme =
    mode === 'dark'
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
    <View style={{ flex: 1 }}>
      <NavigationContainer ref={navigationRef} theme={theme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name='Main' component={MainTabs} />
          <Stack.Screen name='Task' component={TaskScreen} />
          <Stack.Screen
            name='Settings'
            component={SettingsScreen}
            options={{ headerShown: true, headerRight: () => <DropdownMenu />, title: 'Settings' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      {isFocusModeVisible && (
        <ThemeProvider value={theme}>
          <View style={StyleSheet.absoluteFill}>
            <FocusScreen />
          </View>
        </ThemeProvider>
      )}
    </View>
  );
};

export default App;
