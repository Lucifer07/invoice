/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#27106D',
        secondary: '#4A2CB8',
        accent: '#6B46FF',
        success: '#10B981',
      }
    },
  },
  plugins: [],
}
