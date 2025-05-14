/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    'border-red-500',
    'border',
    'grid',
    'grid-cols-7',
    'gap-2',
    'items-center',
    'text-center',
    'text-right'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
