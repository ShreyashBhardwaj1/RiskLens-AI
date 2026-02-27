/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#020617",
        foreground: "#f8fafc",
        primary: "#3b82f6",
        secondary: "#1e293b",
        accent: "#f59e0b",
        card: "#0f172a",
        risk: {
          low: "#22c55e",
          medium: "#f59e0b",
          high: "#ef4444",
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
