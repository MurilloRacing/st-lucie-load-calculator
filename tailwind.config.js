/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'grid-cols-7',
    'min-w-[1024px]',
    'overflow-x-auto',
    'inline-block',
    'text-center',
    'text-right',
    'items-center',
    'gap-2',
    'p-2',
    'w-full',
    'px-4',
    'space-y-6',
    'mb-4',
    'flex',
    'justify-between',
    'form-checkbox',
    'text-sm',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
