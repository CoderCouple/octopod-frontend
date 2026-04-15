import { FlatCompat } from "@eslint/eslintrc";
import checkFilePlugin from "eslint-plugin-check-file";
import nPlugin from "eslint-plugin-n";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ignores: ["**/node_modules/**", "middleware.ts"],
    plugins: {
      "check-file": checkFilePlugin,
      n: nPlugin,
    },
    rules: {
      "prefer-arrow-callback": ["error"],
      "prefer-template": ["error"],
      "@typescript-eslint/no-explicit-any": ["off"],
      "n/no-process-env": ["error"],
      "@typescript-eslint/no-empty-object-type": ["warn"],
      "@typescript-eslint/no-unused-vars": ["warn"],
      "react/no-unescaped-entities": ["off"],
      "prefer-const": "off",
    },
  },
];

export default eslintConfig;
