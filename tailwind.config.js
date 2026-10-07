/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070C1B',
          900: '#0B132B',
          800: '#1C2541',
          700: '#233055',
          600: '#3A506B',
        },
        gold: {
          300: '#FCE7AC',
          400: '#F3D068',
          500: '#D4AF37',
          600: '#AA881E',
          700: '#7F6412',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        heading: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 25px rgba(212, 175, 55, 0.25)',
        'glow-blue': '0 0 25px rgba(42, 111, 219, 0.25)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
