export const Colors = {
  // Dynamic colors that adapt to theme
  get background() {
    return globalThis?.isDarkMode ? '#0C0C0C' : '#FFFFFF';
  },
  get card() {
    return globalThis?.isDarkMode ? '#1A1A1A' : '#F8F9FA';
  },
  get text() {
    return globalThis?.isDarkMode ? '#E4E6EB' : '#1D2129';
  },
  get secondaryText() {
    return globalThis?.isDarkMode ? '#B0B0B0' : '#606060';
  },
  get primary() {
    return globalThis?.isDarkMode ? '#7C83E0' : '#3F51B5';
  },
  'primary-dark': globalThis?.isDarkMode ? '#5A6BD8' : '#303F9F',
  'primary-light': globalThis?.isDarkMode ? '#9AA5F8' : '#C5CAE9',
  get secondary() {
    return '#80CBC4'; // Consistent across themes
  },
  'secondary-light': '#B2DFDB',
  get surface() {
    return globalThis?.isDarkMode ? '#2A2A2A' : '#F5F6FA';
  },
  get danger() {
    return globalThis?.isDarkMode ? '#EF5350' : '#F44336';
  },
  get success() {
    return globalThis?.isDarkMode ? '#81C784' : '#4CAF50';
  },
  get warning() {
    return globalThis?.isDarkMode ? '#FFB74D' : '#FF9800';
  },
  get gray() {
    return globalThis?.isDarkMode ? '#2A2A2A' : '#E9EBEE';
  },
  'gray-200': globalThis?.isDarkMode ? '#2A2A2A' : '#E9EBEE',
  'gray-300': globalThis?.isDarkMode ? '#3A3A3A' : '#D3D3D3',
  get border() {
    return globalThis?.isDarkMode ? '#3A3A3A' : '#E9EBEE';
  },

  // Static fallbacks for compatibility
  primaryLegacy: '#3F51B5',
  secondaryLegacy: '#80CBC4',
  surfaceLegacy: '#F5F6FA',
  dangerLegacy: '#F44336',
  successLegacy: '#4CAF50',
  warningLegacy: '#FF9800',
  grayLegacy: '#E9EBEE',
};