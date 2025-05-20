import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTodayDate } from '../utils/dateUtils'; // nanti buat fungsi helper ini

const KPI_STORAGE_KEY = '@kpi_data';
const KPI_HISTORY_KEY = '@kpi_history';

export const saveKPIData = async (kpiList) => {
  try {
    const data = {
      date: getTodayDate(),
      kpis: kpiList,
    };
    await AsyncStorage.setItem(KPI_STORAGE_KEY, JSON.stringify(data));

    // Update history juga
    const historyRaw = await AsyncStorage.getItem(KPI_HISTORY_KEY);
    const history = historyRaw ? JSON.parse(historyRaw) : [];

    // Cek apakah sudah ada data untuk hari ini
    const today = getTodayDate();
    const existingIndex = history.findIndex((h) => h.date === today);

    if (existingIndex > -1) {
      history[existingIndex] = data; // update
    } else {
      history.push(data); // tambah baru
    }

    // Simpan ulang, batasi max 7 hari saja
    const limitedHistory = history.slice(-7);
    await AsyncStorage.setItem(KPI_HISTORY_KEY, JSON.stringify(limitedHistory));
  } catch (e) {
    console.log('Error saving KPI data and history:', e);
  }
};

export const loadKPIData = async () => {
  try {
    const json = await AsyncStorage.getItem(KPI_STORAGE_KEY);
    return json != null ? JSON.parse(json) : null;
  } catch (e) {
    console.log('Error loading KPI data:', e);
    return null;
  }
};

export const loadKPIHistory = async () => {
  try {
    const json = await AsyncStorage.getItem(KPI_HISTORY_KEY);
    return json != null ? JSON.parse(json) : [];
  } catch (e) {
    console.log('Error loading KPI history:', e);
    return [];
  }
};
