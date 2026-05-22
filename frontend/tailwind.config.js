/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3A8F4D",
          50:  "#F0F6EE",
          100: "#DCEAD6",
          200: "#C9E4CD",
          300: "#9CCBA1",
          400: "#6BAF74",
          500: "#3A8F4D",
          600: "#2E7440",
          700: "#1F5C2C",
          800: "#163F1F",
          900: "#0E2614",
        },
        secondary: {
          DEFAULT: "#FFC847",
          50:  "#FFF7E1",
          100: "#FFEEC0",
          200: "#FFE39A",
          300: "#FFD66B",
          400: "#FFC847",
          500: "#F5B523",
          600: "#D9990A",
          700: "#A8740A",
          800: "#7A5409",
          900: "#4D3506",
        },
        accent: {
          DEFAULT: "#1F5C2C",
          50:  "#E8F2EA",
          500: "#1F5C2C",
          700: "#163F1F",
        },
        bg:      "#ECEFE6",
        surface: "#F4F6EE",
        paper:   "#FFFFFF",
        text: {
          DEFAULT: "#16241B",
          muted:   "#5C685D",
          subtle:  "#8A958A",
          invert:  "#FFFFFF",
        },
        border: {
          DEFAULT: "#D9DED1",
          strong:  "#B6BFA6",
        },
        map: {
          bg:    "#DDE3D2",
          roads: "#F4F6EE",
          water: "#C2D6BE",
        },
        success: {
          50:  "#EAF5EC",
          500: "#3A8F4D",
          700: "#1F5C2C",
        },
        warning: {
          50:  "#FFF6E0",
          500: "#E0A21B",
          700: "#8A5F0B",
        },
        danger: {
          50:  "#FCEBEA",
          500: "#C8442F",
          700: "#7E2417",
        },
      },
      fontFamily: {
        sans:    ["Space Grotesk", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Bricolage Grotesque", "Space Grotesk", "ui-sans-serif", "system-ui", "sans-serif"],
        mono:    ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-sm": ["32px", { lineHeight: "1.1", letterSpacing: "-0.025em", fontWeight: "700" }],
        "display":    ["44px", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "700" }],
        "display-lg": ["64px", { lineHeight: "1.0",  letterSpacing: "-0.035em", fontWeight: "700" }],
      },
      borderRadius: {
        button: "8px",
        card:   "16px",
        sheet:  "20px",
        pill:   "9999px",
      },
      boxShadow: {
        soft:        "0 1px 2px 0 rgba(22,36,27,0.04), 0 1px 3px 0 rgba(22,36,27,0.06)",
        "soft-lg":   "0 4px 8px -2px rgba(22,36,27,0.06), 0 8px 24px -4px rgba(22,36,27,0.08)",
        "soft-xl":   "0 8px 16px -4px rgba(22,36,27,0.08), 0 16px 40px -8px rgba(22,36,27,0.10)",
        sticker:    "2px 2px 0 0 rgba(22,36,27,0.10)",
        "ring-sage": "0 0 0 4px rgba(58,143,77,0.18)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #3A8F4D 0%, #2E7440 50%, #1F5C2C 100%)",
        "gradient-fresh":   "linear-gradient(135deg, #3A8F4D 0%, #FFC847 100%)",
        "gradient-soft":    "linear-gradient(180deg, #F4F6EE 0%, #ECEFE6 100%)",
      },
      keyframes: {
        "slide-up": {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "pulse-dot": {
          "0%, 100%": { transform: "scale(1)",   opacity: "1" },
          "50%":      { transform: "scale(1.4)", opacity: "0.6" },
        },
      },
      animation: {
        "slide-up":  "slide-up 0.35s ease-out both",
        "fade-in":   "fade-in 0.25s ease-out both",
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
