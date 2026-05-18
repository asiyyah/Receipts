/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        calm: {
          50: '#f8f7fa',
          100: '#f0eef5',
          200: '#e0dceb',
          300: '#c5bdd9',
          400: '#a499c0',
          500: '#8a7caa',
          600: '#756695',
          700: '#63547e',
          800: '#53476a',
          900: '#473d59',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
