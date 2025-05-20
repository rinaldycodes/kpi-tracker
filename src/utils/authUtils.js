import AsyncStorage from '@react-native-async-storage/async-storage';

const PIN_KEY = '@user_pin';

export const savePIN = async (pin) => {
  await AsyncStorage.setItem(PIN_KEY, pin);
};

export const getPIN = async () => {
  return await AsyncStorage.getItem(PIN_KEY);
};

export const verifyPIN = async (inputPin) => {
  const savedPin = await getPIN();
  return savedPin === inputPin;
};
