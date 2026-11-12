/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkBg: '#0B0D10',
        cardBg: '#161920',
        cardBorder: '#262A34',
        brandYellow: {
          DEFAULT: '#F5B800',
          hover: '#E0A700',
          light: '#FFFBEB',
          glow: 'rgba(245, 184, 0, 0.35)'
        },
        neonGreen: {
          DEFAULT: '#10B981',
          hover: '#059669',
          light: '#ECFDF5',
          glow: 'rgba(16, 185, 129, 0.35)'
        },
        demandRed: {
          DEFAULT: '#EF4444',
          hover: '#DC2626',
          light: '#FEF2F2',
          glow: 'rgba(239, 68, 68, 0.35)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'bounce-subtle': 'bounce 2s infinite',
      }
    },
  },
  plugins: [],
}
