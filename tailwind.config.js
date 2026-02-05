/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // New theme: Navy + Teal + Safety Yellow + Soft White + Gray
        'brand-navy': '#01203F',
        'brand-navy-alt': '#013A6B',
        'brand-navy-light': '#02508A',
        'brand-teal': '#0EA5A3',
        'brand-yellow': '#FFD400',
        'brand-white': '#F7FAFC',
        'neutral-gray': '#1F2937',

        // Named variants for flexibility
        navy: {
          900: '#01203F',
          800: '#013A6B',
          700: '#02508A'
        },
        teal: {
          500: '#0EA5A3'
        },
        safety: {
          yellow: '#FFD400'
        },
        soft: {
          white: '#F7FAFC'
        },

        // Legacy/compat colors
        primary: {
          DEFAULT: '#01203F',
          600: '#013A6B',
          700: '#02508A'
        },
        secondary: {
          DEFAULT: '#7C3AED',
          500: '#7C3AED'
        },
        accent: '#F97316',
        'brand-orange': '#FB923C',
        success: '#22C55E',
        dark: '#1F2937',
        light: '#F8FAFC',
        info: '#0EA5A3',
        warning: '#FBBF24',
        danger: '#DC2626',
        muted: '#94A3B8'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 6px 18px rgba(12, 74, 110, 0.08)',
        float: '0 10px 30px rgba(12,74,110,0.08)'
      },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
          '100%': { transform: 'translateY(0px)' }
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        fadeInUp: 'fadeInUp .45s ease both'
      }
    },
  },
  plugins: [],
}