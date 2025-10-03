/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-purple': {
          900: '#0f0529',
          800: '#1a0a2e',
          700: '#24143a',
        },
        'vibrant-cyan': '#00f5ff',
        'vibrant-pink': '#ff00ff',
        'vibrant-orange': '#ff6b00',
        'vibrant-yellow': '#ffeb3b',
      },
    },
  },
  plugins: [],
}
