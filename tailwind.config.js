/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}","./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#FFC107",
        secondary: "#28A745",
        accent: "#FD7E14",
        danger: "#DC3545",
        warning: "#FFDA44",
        success: "#28A745",
        textPrimary: "#343A40",
        textSecondary: "#6C757D",
        highlight : "#fbbf24",
        textBlue:"#60a5fa",
        background: "#FFF",
      },
    },
  },
  plugins: [],
}

