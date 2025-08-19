/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#3b4a5c',
          600: '#2f3a47',
          700: '#243343',
          800: '#1e293b',
          900: '#0f172a',
        },
        accent: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        success: colors.green,
        warning: colors.amber,
        error: colors.red,
        neutral: colors.slate,
        // practice colors
        'practice-basic': colors.amber,
        'practice-small': colors.emerald,
        'practice-yichudim': colors.violet,
        'practice-intention': colors.indigo,
        // custom icon colors
        custom: {
          fire: '#b45309',
          chart: '#3b4a5c',
          calendar: '#10b981',
          schedule: '#6366f1',
          psychology: '#d97706',
          history: '#0891b2',
          man: '#f43f5e',
          'my-location': '#ec4899',
          trending: '#f97316',
          sunny: '#b45309',
          'self-improvement': '#16a34a',
          'auto-awesome': '#7c3aed',
          'track-changes': '#4f46e5',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
};