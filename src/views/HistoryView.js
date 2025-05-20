import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { loadKPIHistory } from '../storage/storage';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const HistoryView = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await loadKPIHistory();
      setHistory(data);
    };
    fetchHistory();
  }, []);

  if (history.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Tidak ada data riwayat</Text>
      </View>
    );
  }

  // Ambil nama KPI dari data pertama
  const kpiNames = history[0].kpis.map(kpi => kpi.name);

  // Persiapkan data chart per KPI
  const labels = history.map(h => h.date.slice(5)); // MM-DD untuk label x-axis
  const datasets = kpiNames.map((name, i) => ({
    data: history.map(h => h.kpis[i].count),
    strokeWidth: 2,
  }));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📈 Riwayat 7 Hari Terakhir</Text>
      {kpiNames.map((name, i) => (
        <View key={name} style={styles.chartContainer}>
          <Text style={styles.chartTitle}>{name}</Text>
          <LineChart
            data={{
              labels,
              datasets: [datasets[i]],
            }}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#f0f0f0',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 184, 148, ${opacity})`,
              labelColor: () => '#333',
              style: { borderRadius: 16 },
              propsForDots: {
                r: '5',
                strokeWidth: '2',
                stroke: '#00b894',
              },
            }}
            bezier
            style={{ borderRadius: 16, marginVertical: 8 }}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f6fa',
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },
  chartContainer: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
});

export default HistoryView;
