import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Fondos Neón (Referencia)
        'bg-base':     '#070A12',
        'bg-surface':  '#0B0F1A',
        'bg-elevated': '#111827',
        // Colores primarios (neón)
        'neon-blue':   '#00E5FF',
        'electric':    '#0052FF',
        'neon-purple': '#9D4EDD',
        // Semánticos y Estados
        'status-waiting':     '#00E5FF',
        'status-diagnosis':   '#0052FF',
        'status-parts':       '#9D4EDD',
        'status-pending':     '#F59E0B',
        'status-parts-ready': '#6366F1',
        'status-approved':    '#10B981',
        'status-maintenance': '#0052FF',
        'status-delivered':   '#6B7280',
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
      },
      boxShadow: {
        'neon-blue':   '0 0 12px rgba(0, 229, 255, 0.4), 0 0 30px rgba(0, 229, 255, 0.1)',
        'neon-purple': '0 0 12px rgba(157, 78, 221, 0.4), 0 0 30px rgba(157, 78, 221, 0.1)',
        'neon-red':    '0 0 12px rgba(239, 68, 68, 0.4), 0 0 30px rgba(239, 68, 68, 0.1)',
        'neon-green':  '0 0 12px rgba(16, 185, 129, 0.4), 0 0 30px rgba(16, 185, 129, 0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(239, 68, 68, 0.3)' },
          '50%':      { boxShadow: '0 0 20px rgba(239, 68, 68, 0.6)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideIn: {
          from: { transform: 'translateY(-8px)', opacity: '0' },
          to:   { transform: 'translateY(0)',    opacity: '1' },
        },
        slideOut: {
          from: { transform: 'translateY(0)',    opacity: '1' },
          to:   { transform: 'translateY(8px)',  opacity: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'fade-in':    'fadeIn 150ms ease-out',
        'slide-in':   'slideIn 200ms ease-out',
        'slide-out':  'slideOut 200ms ease-in',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
