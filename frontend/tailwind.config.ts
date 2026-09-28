import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#F6F3EF',
          subtle: '#EEEAE5',
        },
        surface: {
          solid: '#FFFFFF',
          glass: 'rgba(255, 255, 255, 0.65)',
          'glass-secondary': 'rgba(255, 255, 255, 0.45)',
        },
        ink: {
          primary: '#161616',
          secondary: '#68656A',
          subtle: '#8F8B92',
          faint: '#D4D0CE',
        },
        hairline: {
          DEFAULT: 'rgba(20, 20, 20, 0.07)',
          strong: 'rgba(20, 20, 20, 0.12)',
          glass: 'rgba(255, 255, 255, 0.65)',
        },
        brand: {
          DEFAULT: '#695CFF',
          soft: '#EEEAFE',
          hover: '#5749F5',
        },
        coral: {
          DEFAULT: '#F25A5A',
          soft: '#FEF0F0',
          hover: '#E04848',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        btn: '8px',
        input: '11px',
        card: '16px',
        panel: '22px',
        modal: '24px',
      },
      boxShadow: {
        'glass-primary': '0 12px 40px rgba(20, 20, 30, 0.07)',
        'glass-secondary': '0 4px 20px rgba(20, 20, 30, 0.03)',
        'card-subtle': '0 1px 3px rgba(20, 20, 30, 0.03), 0 4px 12px -2px rgba(20, 20, 30, 0.03)',
        'card-hover': '0 12px 32px -4px rgba(20, 20, 30, 0.08)',
        'dropdown': '0 16px 36px -4px rgba(20, 20, 30, 0.12)',
      },
    },
  },
  plugins: [],
} satisfies Config;
