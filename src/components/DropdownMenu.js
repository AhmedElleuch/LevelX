import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Modal, StyleSheet } from 'react-native';
import { useUserStore } from '../store/userStore';
import ConfigMenu from './ConfigMenu';

export default function DropdownMenu() {
  const [visible, setVisible] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const toggleTheme = useUserStore((s) => s.toggleTheme);

  const close = () => setVisible(false);

  return (
    <View>
      <TouchableOpacity onPress={() => setVisible(true)} style={styles.icon}>
        <Text style={styles.iconText}>☰</Text>
      </TouchableOpacity>
      <Modal transparent visible={visible} animationType='fade'>
        <TouchableOpacity style={styles.overlay} onPress={close}>
          <View style={styles.menu}>
            <TouchableOpacity style={styles.item} onPress={() => alert('Profile')}>
              <Text>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item} onPress={() => setShowConfig(true)}>
              <Text>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item} onPress={() => { toggleTheme(); close(); }}>
              <Text>Switch Theme</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item} onPress={() => alert('Sync / Export')}>
              <Text>Sync/Export</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item} onPress={() => alert('Logout')}>
              <Text>Logout</Text>
            </TouchableOpacity>
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
}

const styles = StyleSheet.create({
  icon: { paddingHorizontal: 16 },
  iconText: { fontSize: 24 },
  overlay: { flex: 1, justifyContent: 'flex-start', alignItems: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' },
  menu: { backgroundColor: '#fff', padding: 10, borderRadius: 6, marginTop: 40, marginRight: 10 },
  item: { paddingVertical: 8 },
});
