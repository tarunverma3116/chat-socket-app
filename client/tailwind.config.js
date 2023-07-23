/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
  theme: {
    fontFamily: {
      ...defaultTheme.fontFamily,
      sans: ["Poppins", "sans-serif"],
    },
    fontWeight: {
      hairline: 100,
      thin: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#FF3F02",
          secondary: "#d926a9",
          accent: "#F1F1F1",
          neutral: "#2a323c",
          info: "#3abff8",
          success: "#36d399",
          warning: "#fbbd23",
          error: "#f87272",
        },
      },
    ],
  },
};
