import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadKPIHistory, saveKPIData } from '../storage/storage';
import { exportKPIHistoryToCSV } from '../utils/exportCSV';
import HistoryView from './HistoryView';

import MyButton from '../components/MyButton';
import { useNavigation } from '@react-navigation/native';

const KPI_STORAGE_KEY = '@kpi_list';

const initialKPIs = [
  { id: '1', name: 'KPI A', count: 0 },
  { id: '2', name: 'KPI B', count: 0 },
  { id: '3', name: 'KPI C', count: 0 },
];

const HomeView = () => {
  const router = useNavigation();
  const [kpis, setKpis] = useState([]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [newKPIName, setNewKPIName] = useState('');
  const [editingKPIId, setEditingKPIId] = useState(null);
  const [editingKPIName, setEditingKPIName] = useState('');
  const [modal, setModal] = useState({
    visible: false,
    title: '',
    message: '',
  });

  const showModal = (title, message) =>
    setModal({ visible: true, title, message });
  const hideModal = () => setModal({ visible: false, title: '', message: '' });

  useEffect(() => {
    const fetchData = async () => {
      const storedKPIs = await AsyncStorage.getItem(KPI_STORAGE_KEY);
      if (storedKPIs) {
        setKpis(JSON.parse(storedKPIs));
      } else {
        setKpis(initialKPIs);
      }

      const data = await loadKPIHistory();
      setHistory(data);

      const today = new Date().toISOString().split('T')[0];
      const todayData = data.find((h) => h.date === today);
      if (todayData) setKpis(todayData.kpis);
    };
    fetchData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(KPI_STORAGE_KEY, JSON.stringify(kpis));
  }, [kpis]);

  const increment = (id) => {
    setKpis(
      kpis.map((kpi) =>
        kpi.id === id ? { ...kpi, count: kpi.count + 1 } : kpi
      )
    );
  };

  const decrement = (id) => {
    setKpis(
      kpis.map((kpi) =>
        kpi.id === id && kpi.count > 0 ? { ...kpi, count: kpi.count - 1 } : kpi
      )
    );
  };

  const handleSave = async () => {
    await saveKPIData(kpis);
    showModal('Berhasil', 'Data KPI hari ini tersimpan.');
    const data = await loadKPIHistory();
    setHistory(data);
  };

  const handleExportCSV = async () => {
    if (!history || history.length === 0) {
      showModal('Info', 'Data riwayat kosong, tidak bisa export.');
      return;
    }
    await exportKPIHistoryToCSV(history);
  };

  const handleAddKPI = () => {
    if (!newKPIName.trim()) {
      showModal('Error', 'Nama KPI tidak boleh kosong');
      return;
    }
    const newId = (parseInt(kpis[kpis.length - 1]?.id || '0') + 1).toString();
    const newKPI = { id: newId, name: newKPIName.trim(), count: 0 };
    setKpis([...kpis, newKPI]);
    setNewKPIName('');
  };

  const handleEditKPI = (id, name) => {
    setEditingKPIId(id);
    setEditingKPIName(name);
  };

  const handleSaveEditKPI = () => {
    if (!editingKPIName.trim()) {
      showModal('Error', 'Nama KPI tidak boleh kosong');
      return;
    }

    setKpis(
      kpis.map((kpi) =>
        kpi.id === editingKPIId ? { ...kpi, name: editingKPIName.trim() } : kpi
      )
    );
    setEditingKPIId(null);
    setEditingKPIName('');
  };

  const handleDeleteKPI = (id) => {
    setKpis(kpis.filter((kpi) => kpi.id !== id));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>📊 Hitung KPI Hari Ini</Text>

        <FlatList
          data={kpis}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.kpiCard}>
              {editingKPIId === item.id ? (
                <TextInput
                  style={[styles.input, { flex: 1, marginRight: 10 }]}
                  value={editingKPIName}
                  onChangeText={setEditingKPIName}
                  onSubmitEditing={handleSaveEditKPI}
                  returnKeyType="done"
                />
              ) : (
                <Text style={styles.kpiName}>{item.name}</Text>
              )}

              <View style={styles.controls}>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => decrement(item.id)}>
                  <Text style={styles.controlText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.count}>{item.count}</Text>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => increment(item.id)}>
                  <Text style={styles.controlText}>+</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.actionButtons}>
                {editingKPIId === item.id ? (
                  <TouchableOpacity onPress={handleSaveEditKPI}>
                    <Text style={styles.editText}>💾</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleEditKPI(item.id, item.name)}>
                    <Text style={styles.editText}>✏️</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => handleDeleteKPI(item.id)}>
                  <Text style={styles.deleteText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        <View style={styles.addKPIContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nama KPI baru"
            value={newKPIName}
            onChangeText={setNewKPIName}
          />
          <MyButton variant="outline" color="primary" onPress={handleAddKPI}>
            <Text>+ Tambah</Text>
          </MyButton>
        </View>

        <MyButton
          style={{ marginBottom: 15 }}
          variant="solid"
          color="primary"
          onPress={handleSave}>
          <Text>💾 Simpan Data Hari Ini</Text>
        </MyButton>

        <MyButton
          style={{ marginBottom: 15 }}
          variant="solid"
          color="success"
          onPress={handleExportCSV}>
          <Text>📤 Export ke CSV</Text>
        </MyButton>

        <MyButton
          style={{ marginBottom: 15 }}
          variant="solid"
          color="secondary"
          // onPress={() => setShowHistory(!showHistory)}>
          onPress={() => { router.navigate("History")} }>
          <Text style={styles.toggleButtonText}>
            {showHistory ? '⬅️ Sembunyikan Riwayat' : '📅 Lihat Riwayat'}
          </Text>
        </MyButton>

        {showHistory && <HistoryView />}
      </ScrollView>

      <Modal visible={modal.visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modal.title}</Text>
            <Text style={styles.modalMessage}>{modal.message}</Text>
            <TouchableOpacity onPress={hideModal} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f4f8' },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 20,
    color: '#2d3436',
  },
  kpiCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  kpiName: { fontSize: 18, fontWeight: '600', flex: 1 },
  controls: { flexDirection: 'row', alignItems: 'center' },
  controlButton: {
    backgroundColor: '#0984e3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  controlText: { color: 'white', fontSize: 20, fontWeight: '700' },
  count: { fontSize: 18, marginHorizontal: 12, width: 28, textAlign: 'center' },
  actionButtons: { flexDirection: 'row', marginLeft: 12 },
  editText: { fontSize: 18, marginHorizontal: 6, color: '#0984e3' },
  deleteText: { fontSize: 18, marginHorizontal: 6, color: '#d63031' },
  addKPIContainer: { flexDirection: 'row', marginBottom: 20, marginTop: 8, gap: 8, },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#6c5ce7',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    marginLeft: 10,
  },
  addButtonText: { color: 'white', fontSize: 14, fontWeight: '700' },
  mainButton: {
    backgroundColor: '#00b894',
    padding: 14,
    borderRadius: 12,
    marginVertical: 6,
    alignItems: 'center',
  },
  mainButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  toggleButton: {
    padding: 14,
    marginVertical: 10,
    alignItems: 'center',
    backgroundColor: '#dfe6e9',
    borderRadius: 12,
  },
  toggleButtonText: { fontSize: 16, fontWeight: '600' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  modalMessage: { fontSize: 16, textAlign: 'center', marginBottom: 16 },
  modalButton: {
    backgroundColor: '#0984e3',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  modalButtonText: { color: 'white', fontSize: 16, fontWeight: '700' },
});

export default HomeView;
