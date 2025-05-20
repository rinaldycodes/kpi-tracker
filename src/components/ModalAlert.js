// components/ModalAlert.js
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ModalAlert = ({ visible, title, message, onClose, onConfirm, confirmText = 'OK', cancelText = 'Batal' }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {title && <Text style={styles.title}>{title}</Text>}
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            {onConfirm ? (
              <>
                <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancel]}>
                  <Text style={styles.buttonText}>{cancelText}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onConfirm} style={[styles.button, styles.confirm]}>
                  <Text style={styles.buttonText}>{confirmText}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity onPress={onClose} style={[styles.button, styles.confirm]}>
                <Text style={styles.buttonText}>{confirmText}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalAlert;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    width: '80%',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    marginBottom: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 10,
    borderRadius: 6,
  },
  cancel: {
    backgroundColor: '#ccc',
  },
  confirm: {
    backgroundColor: '#6c5ce7',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
