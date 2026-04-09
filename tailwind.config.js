/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#3F51B5',
        'primary-dark': '#303F9F',
        'primary-light': '#C5CAE9',
        secondary: '#80CBC4',
        'secondary-light': '#B2DFDB',
        surface: '#F5F6FA',
        danger: '#F44336',
        success: '#4CAF50',
        warning: '#FF9800',
      },
      borderRadius: {
        DEFAULT: '12px',
        card: '12px',
        btn: '12px',
      },
    },
  },
  plugins: [],
};
