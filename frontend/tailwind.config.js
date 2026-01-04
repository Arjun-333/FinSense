/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#6366F1", // Indigo 500
        secondary: "#ec4899", // Pink 500
        background: "#0f172a", // Slate 900 (Dark mode base)
        surface: "#1e293b", // Slate 800
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
