/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      zIndex: {
        "-1": "-1"
      }
    },
    screens: {
      phone: { max: "780px" },
      ipad: { min: "781px", max: "1024px" },
      pc: { min: "1025px" }
    }
  },
  plugins: []
};
