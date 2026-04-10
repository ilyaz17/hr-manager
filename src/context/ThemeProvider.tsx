import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance, AppearanceProvider, useColorScheme as useSystemColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextProps {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  systemMode: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemMode = useSystemColorScheme(); // 'light' | 'dark'
  const [mode, setModeState] = useState<ThemeMode>('auto');

  // Load persisted mode
  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem('themeMode');
      if (stored === 'light' || stored === 'dark' || stored === 'auto') {
        setModeState(stored);
      }
    };
    load();
  }, []);

  // Persist mode changes
  useEffect(() => {
    AsyncStorage.setItem('themeMode', mode);
  }, [mode]);

  // Apply mode to Appearance API for NativeWind
  useEffect(() => {
    const effective = mode === 'auto' ? systemMode : mode;
    Appearance.setColorScheme(effective);
  }, [mode, systemMode]);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
  };

  return (
    <ThemeContext.Provider value={{ mode, setMode, systemMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
