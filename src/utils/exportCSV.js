// import * as FileSystem from 'expo-file-system';
// import * as Sharing from 'expo-sharing';

// export const exportKPIHistoryToCSV = async (history) => {
//   console.log("exportKPIHistoryToCSV")
//   if (!history || history.length === 0) return;

//   // Header CSV (tanggal + nama KPI)
//   const header = ['Tanggal', ...history[0].kpis.map(kpi => kpi.name)];
//   const rows = history.map(h => [
//     h.date,
//     ...h.kpis.map(kpi => kpi.count),
//   ]);

//   // Gabungkan header dan baris data
//   const csvContent = [
//     header.join(','),
//     ...rows.map(row => row.join(',')),
//   ].join('\n');
//   console.log("csvcontent")

//   // Simpan ke file sementara
//   const fileUri = FileSystem.documentDirectory + 'kpi_history.csv';
//   await FileSystem.writeAsStringAsync(fileUri, csvContent, {
//     encoding: FileSystem.EncodingType.UTF8,
//   });
//   console.log("share")
//   // Buka dialog share/download
//   await Sharing.shareAsync(fileUri);
// };


import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export const exportKPIHistoryToCSV = async (history) => {
  if (!history || history.length === 0) return;

  const header = ['Tanggal', ...history[0].kpis.map(kpi => kpi.name)];
  const rows = history.map(h => [
    h.date,
    ...h.kpis.map(kpi => kpi.count),
  ]);

  const csvContent = [
    header.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  if (Platform.OS === 'web') {
    // Untuk web, gunakan anchor download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'kpi_history.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } else {
    // Untuk iOS/Android
    const fileUri = FileSystem.documentDirectory + 'kpi_history.csv';
    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    await Sharing.shareAsync(fileUri);
  }
};
