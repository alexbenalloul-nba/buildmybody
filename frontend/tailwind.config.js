export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fafafa',
          100: '#f4f4f5',
          400: '#a1a1aa',
          500: '#ffffff',
          600: '#3f3f46',
          700: '#27272a',
          800: '#52525b',
          900: '#09090b',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
