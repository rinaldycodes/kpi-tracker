import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import { verifyPIN, savePIN, getPIN } from '../utils/authUtils';
import MyButton from './MyButton';

const PINInput = ({ onSuccess }: { onSuccess: () => void }) => {
  const [pin, setPin] = useState('');
  const [hasPin, setHasPin] = useState(null);

  useEffect(() => {
    const checkPin = async () => {
      const savedPin = await getPIN();
      setHasPin(!!savedPin);
    };
    checkPin();
  }, []);

  const handleSetPin = async () => {
    if (pin.length < 4) {
      Alert.alert('Error', 'PIN minimal 4 digit');
      return;
    }
    await savePIN(pin);
    Alert.alert('Berhasil', 'PIN berhasil disimpan');
    setHasPin(true);
    setPin('');
  };

  const handleVerifyPin = async () => {
    const valid = await verifyPIN(pin);
    if (valid) {
      onSuccess();
    } else {
      Alert.alert('Error', 'PIN salah');
    }
    setPin('');
  };

  if (hasPin === null) return null; // loading

  return (
    <View style={styles.container}>
      <View style={{ maxWidth: 325 }}>
        <Text style={styles.title}>
          {hasPin
            ? 'Masukkan PIN Anda untuk memulai KPI Tracker'
            : 'Sebelum memulai KPI Tracker,\nbuat PIN terlebih dahulu (minimal 4 digit)'}
        </Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          keyboardType="numeric"
          maxLength={6}
          value={pin}
          onChangeText={setPin}
          placeholder="••••"
        />
        <MyButton variant="gradient" color="primary" onPress={hasPin ? handleVerifyPin : handleSetPin}>
          {hasPin ? 'Masuk' : 'Simpan PIN'}
        </MyButton>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, marginTop: 50, },
  title: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    fontSize: 20,
    letterSpacing: 10,
    textAlign: 'center',
  },
});

export default PINInput;
