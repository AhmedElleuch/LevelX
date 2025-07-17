import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useUserStore } from '../store/userStore';

export default function ConfigMenu({ onClose }) {
  const { focusMinutes, setFocusMinutes } = useUserStore();
  const [minutes, setMinutes] = useState(String(focusMinutes));

  const save = () => {
    const val = parseInt(minutes, 10);
    if (!isNaN(val) && val > 0) {
      setFocusMinutes(val);
    }
    if (onClose) onClose();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={minutes}
        onChangeText={setMinutes}
        placeholder="Focus minutes"
      />
      <TouchableOpacity style={styles.button} onPress={save}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#eee', borderRadius: 8, marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 10 },
  button: { backgroundColor: '#00aaff', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});