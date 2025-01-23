const { Config } = require('tailwindcss'); // Import type if needed for IDE hints

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Match all Angular HTML and TypeScript files
  ],
  theme: {
    extend: {
      colors: {
        'dark-900': '#343a40', // Custom color from the Next.js config
      },
    },
  },
  plugins: [],
};
