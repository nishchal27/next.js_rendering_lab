/*
  tailwind.config.ts

  Tailwind scans app, component, and lib files because teaching copy and class
  names are spread across route config and reusable UI components.
*/
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        // Shared soft shadow used by cards that should feel inspectable, not decorative.
        soft: "0 16px 40px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
