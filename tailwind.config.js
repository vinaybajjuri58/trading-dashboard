/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Page background
        canvas: '#0f0f0f',

        // Card palette (cream / warm)
        card:          '#f0ebe3',
        'card-alt':    '#e6e1d9',
        'card-hover':  '#ebe6de',
        'card-border': '#d8d3ca',
        'card-fg':     '#1c1917',
        'card-muted':  '#78716c',
        'card-dim':    '#a8a29e',

        // Sidebar
        'sb-hover':  '#1a1a1a',
        'sb-border': '#252525',
        'sb-text':   '#8a8a8a',

        // Accent (teal / emerald)
        accent:       '#0d7c66',
        'accent-dim': '#0a6b58',

        // Status
        positive: '#0d7c66',
        negative: '#c53030',
        warn:     '#d97706',

        // Market badges
        indian:  '#e67e22',
        forex:   '#2980b9',
        futures: '#8e44ad',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
