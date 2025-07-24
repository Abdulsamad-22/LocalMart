/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Adjust if using other file types
  ],
  theme: {
    extend: {}, // Add customizations here later
  },
  plugins: [], // Add plugins like `@tailwindcss/forms` if needed
};
