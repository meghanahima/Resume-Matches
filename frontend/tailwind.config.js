/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#646cff", // Example custom color
        //   secondary: '#ff4081', // Example custom color
        //   dark: '#242424', // Example custom color
        //   light: '#f5f5f5', // Example custom color
      },
      animation: {
        "progress-bar": "progress 3s linear",
      },
      keyframes: {
        progress: {
          "0%": { width: "100%" },
          "100%": { width: "0%" },
        },
      },
    },
  },
  variants: {
    extend: {
      textColor: ["focus-within", "peer-focus"],
      backgroundColor: ["focus-within", "peer-focus"],
      inset: ["focus-within", "peer-focus"],
    },
  },
  plugins: [],
};
