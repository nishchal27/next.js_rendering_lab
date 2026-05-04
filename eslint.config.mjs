/*
  eslint.config.mjs

  Uses the Next.js Core Web Vitals and TypeScript rule sets so examples stay
  close to what developers would see in a production App Router project.
*/
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  {
    ignores: [".next/**", "node_modules/**", "out/**"]
  }
];

export default eslintConfig;
