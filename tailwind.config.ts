import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#153243",
          foreground: "#ffffff",
        },
      },
      fontFamily: {
        sans: ["var(--font-open-sans)", "Open Sans", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};

export default config;
