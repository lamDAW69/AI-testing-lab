import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-app': '#f5f1ed',
        'bg-app-secondary': '#eee9e5',
        surface: {
          DEFAULT: 'rgba(255, 255, 255, 0.72)',
          strong: 'rgba(255, 255, 255, 0.90)',
          soft: 'rgba(255, 255, 255, 0.48)',
          solid: '#FFFFFF',
        },
        ink: {
          primary: '#171719',
          secondary: '#69666d',
          tertiary: '#929097',
        },
        border: {
          DEFAULT: 'rgba(30, 24, 38, 0.08)',
          strong: 'rgba(30, 24, 38, 0.13)',
        },
        brand: {
          DEFAULT: '#685cff',
          hover: '#574af1',
          soft: '#eeeaff',
          'soft-hover': '#e7e1ff',
        },
        semantic: {
          success: '#218a58',
          'success-soft': '#e8f7ef',
          warning: '#ca8517',
          'warning-soft': '#fff3db',
          danger: '#e44848',
          'danger-soft': '#ffeded',
          info: '#6054ef',
          'info-soft': '#efedff',
          neutral: '#efedef',
        },
      },
      fontFamily: {
        ui: ['Inter', 'Geist', 'system-ui', '-apple-system', 'sans-serif'],
        editorial: ['Newsreader', 'Instrument Serif', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        xs: '8px',
        sm: '10px',
        md: '14px',
        lg: '18px',
        xl: '24px',
        pill: '999px',
      },
      boxShadow: {
        xs: '0 1px 2px rgba(21, 17, 30, 0.03)',
        sm: '0 4px 18px rgba(21, 17, 30, 0.05)',
        md: '0 14px 40px rgba(21, 17, 30, 0.07)',
        floating: '0 20px 60px rgba(21, 17, 30, 0.10)',
        glass: '0 12px 40px rgba(20, 16, 30, 0.06)',
        'ai-panel': '0 22px 55px rgba(85, 64, 200, 0.09)',
      },
    },
  },
  plugins: [],
} satisfies Config;
