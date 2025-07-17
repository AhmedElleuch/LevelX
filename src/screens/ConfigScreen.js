import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ConfigScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Login placeholder</Text>
      <Text style={styles.placeholder}>Variable settings placeholder</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  placeholder: { fontSize: 18, marginBottom: 20 },
});