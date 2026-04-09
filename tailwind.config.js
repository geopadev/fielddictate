/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Red-500, Emerald-600, Slate-50, Slate-900 are native to Tailwind 
        // and mapped exactly as per the AGENTS.md instructions.
      }
    },
  },
  plugins: [],
}
