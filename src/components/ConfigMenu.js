import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useUserStore } from '../store/userStore';

const ConfigMenu = ({ onClose }) => {
  const { colors } = useTheme();
  const focusMinutes = useUserStore((s) => s.focusMinutes);
  const setFocusMinutes = useUserStore((s) => s.setFocusMinutes);
  const [minutes, setMinutes] = useState(String(focusMinutes));
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    console.log('ConfigMenu mounted');
  }, []);

  const save = () => {
    const val = parseInt(minutes, 10);
    if (!isNaN(val) && val > 0) {
      setFocusMinutes(val);
    }
    console.log('Save focus minutes', { minutes: val });
    if (onClose) onClose();
  };

  return (
    <Animated.View style={[styles.container, { opacity, backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={styles.label}>Focus minutes</Text>
      <TextInput
        style={styles.input}
        value={minutes}
        onChangeText={setMinutes}
        placeholder='Focus minutes'
        placeholderTextColor={colors.text}
      />
            <View style={styles.quick}>
        {[5, 15, 25].map((v) => (
          <TouchableOpacity
            key={v}
            style={styles.quickButton}
            onPress={() => setMinutes(String(v))}
          >
            <Text>{v}m</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.xp}>Estimated XP: {parseInt(minutes, 10) || 0}</Text>
      <TouchableOpacity style={styles.button} onPress={save}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ConfigMenu;

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#eee', borderRadius: 8, marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 10 },
  button: { backgroundColor: '#00aaff', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  label: { marginBottom: 5, fontWeight: 'bold' },
  quick: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  quickButton: { padding: 6, borderWidth: 1, borderColor: '#999', borderRadius: 6 },
  xp: { textAlign: 'center', marginBottom: 10 },
});

