/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './templates/**/*.html',
    './**/templates/**/*.html',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf4ef',
          100: '#fae6db',
          200: '#f4ccb5',
          300: '#ecab85',
          400: '#e28452',
          500: '#d9662e',
          600: '#BD562A',
          700: '#9a4325',
          800: '#7d3724',
          900: '#672f21',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        logo: ['Fraunces', 'serif'],
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
