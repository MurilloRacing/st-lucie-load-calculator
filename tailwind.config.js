/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'grid-cols-7',
    'border',
    'border-red-500',
    'text-center',
    'text-right',
    'items-center',
    'gap-2',
    'p-2',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
