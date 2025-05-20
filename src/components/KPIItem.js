import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const KPIItem = ({ kpi, onIncrement, onDecrement }) => {
  const progress = (kpi.count / kpi.target) * 100;
  const reached = kpi.count >= kpi.target;

  return (
    <View style={[styles.container, reached && styles.reached]}>
      <Text style={styles.title}>{kpi.name}</Text>
      <Text style={styles.counter}>{kpi.count} / {kpi.target}</Text>

      <View style={styles.controls}>
        <TouchableOpacity onPress={onDecrement} style={styles.button}>
          <Text style={styles.buttonText}>−</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onIncrement} style={styles.button}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progress, { width: `${Math.min(progress, 100)}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 3,
  },
  reached: {
    backgroundColor: '#dff9fb',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  counter: {
    fontSize: 16,
    marginVertical: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 8,
  },
  button: {
    backgroundColor: '#dfe6e9',
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 22,
    color: '#0984e3',
    fontWeight: 'bold',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#dcdde1',
    borderRadius: 5,
    marginTop: 8,
  },
  progress: {
    height: 6,
    backgroundColor: '#00b894',
    borderRadius: 5,
  },
});

export default KPIItem;
