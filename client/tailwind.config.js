/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b0e12",
        carbon: "#12161c",
        mist: "#e6eef8",
        neon: "#5ce1e6",
        sunrise: "#f4b860"
      },
      // boxShadow: {
      //   glow: "0 0 40px rgba(92, 225, 230, 0.15)"
      // },
      fontFamily: {
        display: ["Space Grotesk", "ui-sans-serif", "system-ui"],
        body: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
}
