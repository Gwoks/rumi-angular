/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'cream': {
          50: '#fefdf7',
          100: '#fefaf0',
          200: '#fef4d9',
          300: '#fdecb3',
          400: '#fce187',
          500: '#fcd97c',
          600: '#f2c755',
          700: '#e4b038',
          800: '#d19c2a',
          900: '#b8841f',
        },
        'sage': {
          50: '#f0f8f7',
          100: '#ddeee9',
          200: '#baddd4',
          300: '#8dc4b6',
          400: '#5ea497',
          500: '#4a8a7f',
          600: '#3a7067',
          700: '#2e8b83',
          800: '#26766e',
          900: '#1f625b',
        },
        'terracotta': {
          50: '#fef8f5',
          100: '#fdf0e8',
          200: '#fbdcc8',
          300: '#f8c19e',
          400: '#f49c6f',
          500: '#f0833f',
          600: '#e16728',
          700: '#c3511f',
          800: '#a0431d',
          900: '#82391b',
        }
      },
      fontFamily: {
        'bubbly': ['Comic Neue', 'cursive'],
        'clean': ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'organic': '47% 53% 70% 30% / 30% 40% 60% 70%',
        'blob': '60% 40% 30% 70% / 60% 30% 70% 40%',
      },
      backgroundImage: {
        'wavy': "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1000 100\"><path d=\"M0,50 Q250,0 500,50 T1000,50 L1000,100 L0,100 Z\" fill=\"%23f9edc8\"/></svg>')",
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}

