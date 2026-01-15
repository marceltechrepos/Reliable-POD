/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: '#3b6d92',
        tiger: '#f05a28',
        hoverTiger: '#f74002',
        dimGray: '#747474',
        silver: '#bfbfbf'
      },
    },
  },
  plugins: [],
}
