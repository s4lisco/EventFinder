  /** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{ts,tsx,js,jsx}",
    "./src/components/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Regivo Design System Colors
        primary: {
          DEFAULT: '#2F6BFF',
          50: '#EFF4FF',
          100: '#DBE5FF',
          200: '#BFD2FF',
          300: '#93B4FF',
          400: '#5F8AFF',
          500: '#2F6BFF',
          600: '#1E4FFF',
          700: '#1741EB',
          800: '#1935BE',
          900: '#1A3195',
        },
        secondary: {
          DEFAULT: '#6A4CFF',
          50: '#F3F0FF',
          100: '#E9E4FF',
          200: '#D5CDFF',
          300: '#B8A7FF',
          400: '#9577FF',
          500: '#6A4CFF',
          600: '#5528FF',
          700: '#4719E8',
          800: '#3B15C3',
          900: '#30139F',
        },
        accent: {
          DEFAULT: '#FF4FD8',
          50: '#FFF0FB',
          100: '#FFE3F8',
          200: '#FFC6F1',
          300: '#FF9AE5',
          400: '#FF5DD6',
          500: '#FF4FD8',
          600: '#F01BB4',
          700: '#D10E95',
          800: '#AC0F7A',
          900: '#8E1166',
        },
        surface: {
          DEFAULT: '#F7F8FC',
        },
        border: {
          DEFAULT: '#E6E8F0',
        },
        text: {
          DEFAULT: '#12131A',
          muted: '#5B6072',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 8px 24px rgba(18, 19, 26, 0.08)',
        'soft-lg': '0 8px 24px rgba(18, 19, 26, 0.08)',
        'soft-xl': '0 16px 48px rgba(18, 19, 26, 0.12)',
      },
      borderRadius: {
        'card': '16px',
        'button': '20px',
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