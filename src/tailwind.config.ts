import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Monaco', 'monospace'],
        'space-grotesk': ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        'inter': ['Inter', 'system-ui', 'sans-serif'],
        'jetbrains-mono': ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Analyst Design System - RGB CSS Variables
        bg: {
          950: 'rgb(var(--bg-950) / <alpha-value>)',
          900: 'rgb(var(--bg-900) / <alpha-value>)',
          850: 'rgb(var(--bg-850) / <alpha-value>)',
        },
        panel: {
          glass: 'rgba(var(--panel-glass), 0.82)',
        },
        border: 'rgb(var(--border-analyst) / <alpha-value>)',
        divider: 'rgb(var(--divider) / <alpha-value>)',
        text: {
          100: 'rgb(var(--text-100) / <alpha-value>)',
          300: 'rgb(var(--text-300) / <alpha-value>)',
          400: 'rgb(var(--text-400) / <alpha-value>)',
          600: 'rgb(var(--text-600) / <alpha-value>)',
        },
        accent: 'rgb(var(--accent-analyst) / <alpha-value>)',
        info: 'rgb(var(--info) / <alpha-value>)',
        warn: 'rgb(var(--warn) / <alpha-value>)',
        danger: 'rgb(var(--danger) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
      },
      borderRadius: {
        xl: '20px',
        '2xl': '32px',
      },
      boxShadow: {
        card: '0 8px 24px rgba(0,0,0,0.35)',
        modal: '0 16px 48px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
} satisfies Config;
