import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '../src/context/ThemeProvider';
import { SafeAreaView } from 'react-native';

export default function Layout() {
  return (
    <ThemeProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack />
      </SafeAreaView>
    </ThemeProvider>
  );
}
