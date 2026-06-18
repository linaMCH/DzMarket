/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FBF8F3',
          100: '#F4EBD8',
          300: '#D6BCA0',
          500: '#C2A278',
          700: '#8F6B43'
        }
      }
    }
  },
  plugins: []
}
