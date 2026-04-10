import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'auto';

export const themeUtils = {
  // Get current effective theme
  getEffectiveTheme(mode: ThemeMode): 'light' | 'dark' {
    return mode === 'auto' ? (Appearance.getColorScheme() === 'dark' ? 'dark' : 'light') : mode;
  },

  // Get system theme preference
  getSystemTheme(): 'light' | 'dark' {
    return Appearance.getColorScheme() || 'light';
  },

  // Check if auto mode would result in dark theme
  wouldAutoModeBeDark(mode: ThemeMode): boolean {
    return this.getEffectiveTheme(mode) === 'dark';
  },

  // Save theme preference
  async saveThemeMode(mode: ThemeMode): Promise<void> {
    await AsyncStorage.setItem('themeMode', mode);
  },

  // Load theme preference
  async loadThemeMode(): Promise<ThemeMode | null> {
    const stored = await AsyncStorage.getItem('themeMode');
    return stored === 'light' || stored === 'dark' || stored === 'auto' ? stored : null;
  },

  // Toggle between light and dark
  toggleThemeMode(currentMode: ThemeMode): ThemeMode {
    if (currentMode === 'auto') {
      return this.getSystemTheme() === 'dark' ? 'light' : 'dark';
    } else if (currentMode === 'light') {
      return 'dark';
    } else {
      return 'light';
    }
  },

  // Get theme display name
  getThemeDisplayName(mode: ThemeMode): string {
    switch (mode) {
      case 'light': return 'Light Mode';
      case 'dark': return 'Dark Mode';
      case 'auto': return 'Auto (System)';
      default: return 'Auto (System)';
    }
  },

  // Get theme icon for UI
  getThemeIcon(mode: ThemeMode): string {
    switch (mode) {
      case 'light': return '☀️';
      case 'dark': return '🌙';
      case 'auto': return '🌍';
      default: return '🌍';
    }
  },

  // Check if theme supports customization
  supportsCustomization(mode: ThemeMode): boolean {
    return mode === 'light' || mode === 'dark';
  },
};