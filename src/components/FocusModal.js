import React, { useRef, useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useUserStore } from '../store/userStore';
import { stopTimer } from '../services/focusTimer';

const { width, height } = Dimensions.get('window');

const FocusModal = () => {
  const isFocusModalVisible = useUserStore((s) => s.isFocusModalVisible);
  const { colors } = useTheme();
  const slideAnim = useRef(new Animated.Value(height)).current;
  const [shouldRender, setShouldRender] = useState(isFocusModalVisible);
  // HOOKS ALWAYS HERE:
  const [backgroundVisible, setBackgroundVisible] = useState(false);

  useEffect(() => {
    if (isFocusModalVisible) {
      setShouldRender(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start();
    } else if (shouldRender) {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setShouldRender(false));
    }
  }, [isFocusModalVisible, slideAnim, shouldRender]);

  // Listen to slideAnim value for background
  useEffect(() => {
    const id = slideAnim.addListener(({ value }) => {
      setBackgroundVisible(value < height);
    });
    return () => slideAnim.removeListener(id);
  }, [slideAnim]);

  if (!shouldRender) return null; // ONLY after all hooks

  return (
    <View
      style={[
        styles.overlay,
        { backgroundColor: backgroundVisible ? 'rgba(0,0,0,0.3)' : 'transparent' },
      ]}
      pointerEvents={isFocusModalVisible ? 'auto' : 'none'}
    >
      <Animated.View
        style={[
          styles.popup,
          { backgroundColor: colors.background },
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <TouchableOpacity style={styles.stop} onPress={stopTimer}>
          <Text style={styles.stopText}>Stop</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};