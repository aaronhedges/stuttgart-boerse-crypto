import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--color-primary) / <alpha-value>)",
      },
    },
  },
};

export default config;
