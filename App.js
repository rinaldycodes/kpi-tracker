import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeView from './src/views/HomeView';
import HistoryView from './src/views/HistoryView';
import PINInput from './src/components/PINInput';

import { useWindowDimensions } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  const { width } = useWindowDimensions();

  const [authenticated, setAuthenticated] = useState(false);

  if (!authenticated) {
    return <PINInput onSuccess={() => setAuthenticated(true)} />;
  }

  if ( width > 425 ) {
    alert("Buka di handphone untuk pengalaman lebih dibaik");
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeView}
          options={({ navigation }) => ({
            title: 'KPI Tracker',
          })}
        />
        <Stack.Screen
          name="History"
          component={HistoryView}
          options={{ title: 'Riwayat 7 Hari' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
