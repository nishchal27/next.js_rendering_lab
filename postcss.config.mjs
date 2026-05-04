/*
  postcss.config.mjs

  Standard Tailwind + Autoprefixer pipeline. The visual lessons live in React
  components; this file only enables the CSS tooling they depend on.
*/
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};

export default config;
