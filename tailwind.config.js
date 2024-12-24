/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6965db',
        'primary-hover': '#5753d0',
        'primary-bg': 'white',
        'secondary-bg': '#f0efff',
        'selected-bg': '#e0dfff',
        'primary-text': '#27272c',
        'secondary-text': '#b8b8b8',
        highlight: '#030064',
        border: '#e7e6f7',
        shadow: 'rgba(0, 0, 0, 0.1)',
        'hover-bg': '#e5e5fb',
        'panel-bg': '#e7e7ee',
      },
    },
  },
  plugins: [],
}

