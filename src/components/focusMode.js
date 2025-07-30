import React, { useRef, useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, Animated, FlatList } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useUserStore } from '../store/userStore';
import { stopTimer } from '../services/focusTimer';

const { height } = Dimensions.get('window');

const FocusMode = () => {
  const isFocusModeVisible = useUserStore((s) => s.isFocusModeVisible);
  const isTimerRunning = useUserStore((s) => s.isTimerRunning);
  const secondsLeft = useUserStore((s) => s.secondsLeft);
  const tasks = useUserStore((s) => s.tasks);
  const toggleTaskCompletion = useUserStore((s) => s.toggleTaskCompletion);
  const { colors } = useTheme();
  const slideAnim = useRef(new Animated.Value(height)).current;
  const [shouldRender, setShouldRender] = useState(isFocusModeVisible);
  const [backgroundVisible, setBackgroundVisible] = useState(false);

  useEffect(() => {
    if (isFocusModeVisible) {
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
  }, [isFocusModeVisible, slideAnim, shouldRender]);

  useEffect(() => {
    const id = slideAnim.addListener(({ value }) => {
      setBackgroundVisible(value < height);
    });
    return () => slideAnim.removeListener(id);
  }, [slideAnim]);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');
  const activeTasks = tasks.filter((t) => !t.isCompleted);

  if (!shouldRender) return null;

  return (
    <View
      style={[
        styles.overlay,
        { backgroundColor: backgroundVisible ? 'rgba(0,0,0,0.3)' : 'transparent' },
      ]}
      pointerEvents={isFocusModeVisible ? 'auto' : 'none'}
    >
      <Animated.View
        style={[
          styles.popup,
          { backgroundColor: colors.background },
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Text style={[styles.timer, { color: colors.text }]}>
          {minutes}:{seconds}
        </Text>
        <FlatList
          data={activeTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.task}
              onPress={() => toggleTaskCompletion(item.id)}
            >
              <Text style={{ color: colors.text }}>
                {item.isCompleted ? '✅ ' : ''}
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity style={styles.stop} onPress={stopTimer}>
          <Text style={styles.stopText}>Stop</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default FocusMode;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  popup: {
    width: '100%',
    padding: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  timer: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  task: { padding: 12, borderBottomWidth: 1, borderColor: '#ccc' },
  stop: {
    backgroundColor: '#ff5555',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  stopText: { color: '#fff', fontWeight: 'bold' },
});