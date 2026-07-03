import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#F5F7F4',
          surface: '#FFFFFF',
          text: '#18302B',
          muted: '#5F6F69',
          primary: '#4E8F7C',
          'primary-dark': '#2F6757',
          border: '#DDE6E1',
          success: '#3E7A43',
          warning: '#A36A2B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Instrument Serif', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
