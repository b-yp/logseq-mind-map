/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,vue,css}'],
  theme: {
    extend: {
    },
  },
  daisyui: {
    themes: false,
  },
  plugins: [daisyui],
};
