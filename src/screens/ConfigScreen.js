import React from 'react';
import { View, StyleSheet } from 'react-native';
import ConfigMenu from '../components/ConfigMenu';

export default function ConfigScreen() {
  return (
    <View style={styles.container}>
      <ConfigMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  placeholder: { fontSize: 18, marginBottom: 20 },
});
