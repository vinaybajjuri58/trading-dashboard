/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas:  '#0d1117',
        surface: '#161b22',
        overlay: '#1c2128',
        divider: '#30363d',
        subtle:  '#8b949e',
        muted:   '#6e7681',
        positive:'#3fb950',
        negative:'#f85149',
        accent:  '#58a6ff',
        warn:    '#d29922',
        indian:  '#ff9f43',
        forex:   '#54a0ff',
        futures: '#a371f7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
