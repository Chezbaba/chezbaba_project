module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  safelist: [
    { pattern: /bi(-[a-z0-9-]+)+/ },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
