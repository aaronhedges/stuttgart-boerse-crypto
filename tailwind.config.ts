import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--color-primary) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["Open Sans", "ui-sans-serif", "system-ui"],
      },
    },
  },
};

export default config;
