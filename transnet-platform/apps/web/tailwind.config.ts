import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#09243f',
          blue: '#0f6fb8',
          cyan: '#00a6c8',
          ink: '#111827',
          muted: '#64748b',
          surface: '#f5f8fb',
        },
      },
      boxShadow: {
        soft: '0 18px 45px rgba(15, 35, 55, 0.10)',
      },
    },
  },
  plugins: [],
};

export default config;
