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
        // semantic icon colors
        custom: {
          fire: '#b45309',        // streak, energy
          calendar: '#10b981',    // dates, scheduling
          psychology: '#d97706',  // mental practices
          history: '#0891b2',     // past records
          man: '#f43f5e',         // MAN practices
          'my-location': '#ec4899', // goals, targeting
          trending: '#f97316',    // progress, growth
          'self-improvement': '#16a34a', // development
          'auto-awesome': '#7c3aed',     // yichudim, special
          'track-changes': '#4f46e5',    // monitoring
        },
      },
      boxShadow: {
        'nav-active': '0 2px 8px rgba(59, 74, 92, 0.15)',
        'nav-active-dark': '0 2px 12px rgba(248, 250, 252, 0.3)',
        'nav-indicator': '0 1px 3px rgba(248, 250, 252, 0.5)',
      },
      minHeight: {
        'touch': '44px', // iOS touch target minimum
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
};