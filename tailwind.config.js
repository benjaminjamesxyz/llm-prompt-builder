export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        surface2: 'var(--surface2)',
        text: 'var(--text)',
        textMuted: 'var(--text-muted)',
        primary: 'var(--primary)',
        primaryHover: 'var(--primary-hover)',
        border: 'var(--border)',
        success: 'var(--success)',
        accent: 'var(--accent)',
      }
    }
  },
  plugins: [],
}
