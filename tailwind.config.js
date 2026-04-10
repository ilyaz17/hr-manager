/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Light theme colors
        light: {
          background: '#FFFFFF',
          card: '#F8F9FA',
          text: '#1D2129',
          secondaryText: '#606060',
          primary: '#3F51B5',
          'primary-dark': '#303F9F',
          'primary-light': '#C5CAE9',
          secondary: '#80CBC4',
          'secondary-light': '#B2DFDB',
          surface: '#F5F6FA',
          danger: '#F44336',
          success: '#4CAF50',
          warning: '#FF9800',
          gray: '#E9EBEE',
          'gray-200': '#E9EBEE',
          'gray-300': '#D3D3D3',
        },
        // Dark theme colors
        dark: {
          background: '#0C0C0C',
          card: '#1A1A1A',
          text: '#E4E6EB',
          secondaryText: '#B0B0B0',
          primary: '#7C83E0',
          'primary-dark': '#5A6BD8',
          'primary-light': '#9AA5F8',
          secondary: '#80CBC4',
          'secondary-light': '#B2DFDB',
          surface: '#2A2A2A',
          danger: '#EF5350',
          success: '#81C784',
          warning: '#FFB74D',
          gray: '#2A2A2A',
          'gray-200': '#2A2A2A',
          'gray-300': '#3A3A3A',
        },
      },
      borderRadius: {
        DEFAULT: '12px',
        card: '12px',
        btn: '12px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
