import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserStore } from '../store/userStore';
import ConfigMenu from './ConfigMenu';

const DropdownMenu = () => {
  const [visible, setVisible] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const toggleTheme = useUserStore((s) => s.toggleTheme);
  const name = useUserStore((s) => s.name);
  const setName = useUserStore((s) => s.setName);
  const level = useUserStore((s) => s.level);
  const difficulty = useUserStore((s) => s.difficulty);
  const setDifficulty = useUserStore((s) => s.setDifficulty);

  const close = () => setVisible(false);

  const exportData = async () => {
    const data = await AsyncStorage.getItem('levelx-store');
    console.log('Export data requested');
    Alert.alert('Export', data || 'No data');
    close();
  };

  const logout = async () => {
    await AsyncStorage.removeItem('levelx-store');
    console.log('User logged out');
    Alert.alert('Logged out');
    close();
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setVisible(true)} style={styles.icon}>
        <Text style={styles.iconText}>☰</Text>
      </TouchableOpacity>
      <Modal transparent visible={visible} animationType='fade'>
        <TouchableOpacity style={styles.overlay} onPress={close}>
          <View style={styles.menu}>
            <TouchableOpacity style={styles.item} onPress={() => setShowProfile(true)}>
              <Text>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item} onPress={() => setShowConfig(true)}>
              <Text>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item} onPress={() => { toggleTheme(); close(); }}>
              <Text>Switch Theme</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item} onPress={exportData}>
              <Text>Sync/Export</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item} onPress={logout}>
              <Text>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      <Modal transparent visible={showProfile} animationType='slide'>
        <TouchableOpacity style={styles.overlay} onPress={() => setShowProfile(false)}>
          <View style={styles.menu}>
            <Text style={styles.header}>Profile</Text>
            <TextInput
              style={styles.input}
              placeholder='Name'
              value={name}
              onChangeText={setName}
            />
            <Text>Level {level}</Text>
          </View>
        </TouchableOpacity>
      </Modal>
      <Modal transparent visible={showConfig} animationType='slide'>
        <TouchableOpacity style={styles.overlay} onPress={() => setShowConfig(false)}>
          <View style={styles.menu}>
            <ConfigMenu onClose={() => setShowConfig(false)} />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default DropdownMenu;

const styles = StyleSheet.create({
  icon: { paddingHorizontal: 16 },
  iconText: { fontSize: 24 },
  overlay: { flex: 1, justifyContent: 'flex-start', alignItems: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' },
  menu: { backgroundColor: '#fff', padding: 10, borderRadius: 6, marginTop: 40, marginRight: 10 },
  item: { paddingVertical: 8 },
  header: { fontWeight: 'bold', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 6, borderRadius: 6, marginBottom: 10, width: 150 },
});

