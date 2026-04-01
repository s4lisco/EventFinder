/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{ts,tsx,js,jsx}",
    "./src/components/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // The Urban Pulse Design System Colors
        primary: {
          DEFAULT: '#6200EE',
          50: '#F3E5FF',
          100: '#E1BEFF',
          200: '#CE93FF',
          300: '#BA68FF',
          400: '#AB47FF',
          500: '#6200EE',
          600: '#5600D6',
          700: '#4700B3',
          800: '#380091',
          900: '#1E005E',
        },
        secondary: {
          DEFAULT: '#AC8EFF',
          50: '#F5F0FF',
          100: '#EDE3FF',
          200: '#DDD0FF',
          300: '#C9B4FF',
          400: '#AC8EFF',
          500: '#9B6EFF',
          600: '#7C47EE',
          700: '#6030D6',
          800: '#4820B3',
          900: '#300E91',
        },
        surface: {
          DEFAULT: '#FDF3FF',
        },
        dark: {
          DEFAULT: '#1A161D',
        },
        border: {
          DEFAULT: '#E8D8FF',
        },
        text: {
          DEFAULT: '#1A161D',
          muted: '#6B5F75',
        },
        success: {
          50: '#E0F9FF',
          100: '#B3F0FF',
          200: '#80E6FF',
          300: '#4DDBFF',
          400: '#26D4FF',
          500: '#00D4FF',
          600: '#00BFEA',
          700: '#0099BF',
          800: '#007395',
          900: '#004D63',
        },
        warning: {
          DEFAULT: '#FFB800',
          50: '#FFF8E1',
          100: '#FFEDB3',
          200: '#FFE082',
          300: '#FFD54F',
          400: '#FFCA28',
          500: '#FFB800',
          600: '#F0A800',
          700: '#D49000',
          800: '#B87800',
          900: '#9C6200',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 8px 24px rgba(98, 0, 238, 0.08)',
        'soft-lg': '0 12px 32px rgba(98, 0, 238, 0.12)',
        'soft-xl': '0 16px 48px rgba(98, 0, 238, 0.16)',
        'purple': '0 8px 24px rgba(98, 0, 238, 0.24)',
      },
      borderRadius: {
        'card': '16px',
        'button': '12px',
        'pill': '9999px',
      },
      animation: {
        'fade-in': 'fadeIn 0.15s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
        'scale-in': 'scaleIn 0.12s ease-out',
        'modal': 'modal 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.98)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        modal: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};