import React from 'react';
import { View, StyleSheet } from 'react-native';
import ConfigMenu from '../components/ConfigMenu';
import { SafeAreaView } from 'react-native-safe-area-context';

const ConfigScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
            <ConfigMenu />
    </SafeAreaView>
  );
};

export default ConfigScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  placeholder: { fontSize: 18, marginBottom: 20 },
});
