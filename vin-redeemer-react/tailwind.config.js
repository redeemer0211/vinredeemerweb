/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        void: "#090c12",
        panel: "#10151d",
        raised: "#1b2432",
        line: "#232c3a",
        lineb: "#34445c",
        cyan: { DEFAULT: "#35e6e0", dim: "#1c7a78" },
        mag: { DEFAULT: "#ff3d7f", dim: "#7a1f42" },
        gold: "#ffb703",
        txd: "#8695ab",
        txf: "#4d5a70",
      },
      fontFamily: {
        display: ['"Press Start 2P"', "monospace"],
        mono: ['"JetBrains Mono"', "monospace"],
        sans: ["Rajdhani", "sans-serif"],
      },
      boxShadow: {
        "glow-cyan": "0 0 12px rgba(53, 230, 224, 0.45)",
        "glow-mag": "0 0 14px rgba(255, 61, 127, 0.45)",
      },
      keyframes: {
        blink: { "50%": { opacity: 0 } },
      },
      animation: {
        blink: "blink 1s steps(1) infinite",
      },
    },
  },
  plugins: [],
};
