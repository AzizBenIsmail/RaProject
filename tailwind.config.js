/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        nexus: {
          ink: '#101a2b',
          blue: '#2865dc',
          cyan: '#16b8c5',
        },
      },
    },
  },
  plugins: [],
};
