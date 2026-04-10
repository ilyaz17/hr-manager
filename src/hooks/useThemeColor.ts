import { useColorScheme } from 'react-native';

export const useThemeColor = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = {
    background: isDark ? '#0C0C0C' : '#FFFFFF',
    card: isDark ? '#1A1A1A' : '#F8F9FA',
    text: isDark ? '#E4E6EB' : '#1D2129',
    secondaryText: isDark ? '#B0B0B0' : '#606060',
    primary: isDark ? '#7C83E0' : '#3F51B5',
    'primary-dark': isDark ? '#5A6BD8' : '#303F9F',
    'primary-light': isDark ? '#9AA5F8' : '#C5CAE9',
    secondary: isDark ? '#80CBC4' : '#80CBC4',
    'secondary-light': isDark ? '#B2DFDB' : '#B2DFDB',
    surface: isDark ? '#2A2A2A' : '#F5F6FA',
    danger: isDark ? '#EF5350' : '#F44336',
    success: isDark ? '#81C784' : '#4CAF50',
    warning: isDark ? '#FFB74D' : '#FF9800',
    gray: isDark ? '#2A2A2A' : '#E9EBEE',
    'gray-200': isDark ? '#2A2A2A' : '#E9EBEE',
    'gray-300': isDark ? '#3A3A3A' : '#D3D3D3',
    border: isDark ? '#3A3A3A' : '#E9EBEE',
  };

  return { colors, isDark };
};