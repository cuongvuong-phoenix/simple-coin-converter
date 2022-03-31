module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    container: {
      padding: '2rem',
    },
    extend: {
      colors: {
        bg: {
          default: '#f3f4f6',
          darker: '#d1d5db',
          darkest: '#6b7280',
        },
        fg: {
          default: '#1f2937',
        },
        primary: {
          default: '#2563eb',
          lighter: '#3b82f6',
        },
      },
    },
  },
  plugins: [],
};
