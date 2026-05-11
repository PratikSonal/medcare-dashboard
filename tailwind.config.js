/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary':    'var(--bg-primary)',
        'bg-secondary':  'var(--bg-secondary)',
        'bg-tertiary':   'var(--bg-tertiary)',
        'bg-card':       'var(--bg-card)',
        'border-primary':'var(--border-primary)',
        'accent-blue':   'var(--accent-blue)',
        'accent-cyan':   'var(--accent-cyan)',
        'accent-purple': 'var(--accent-purple)',
        'accent-yellow': 'var(--accent-yellow)',
        'accent-red':    'var(--accent-red)',
        'text-primary':  'var(--text-primary)',
        'text-secondary':'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        '10': '10px',
        '12': '12px',
        '14': '14px',
        '16': '16px',
        '20': '20px',
        '999': '999px',
      },
      spacing: {
        '18': '4.5rem',
      },
    },
  },
  plugins: [],
};
