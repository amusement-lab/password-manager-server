import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["typescript"],
  categories: {
    correctness: "error",
    suspicious: "warn",
  },
  env: {
    node: true,
    es2022: true,
  },
  rules: {
    "no-console": "warn",
    "no-unused-vars": "error",
    "typescript/no-unused-vars": "error",
    "typescript/no-explicit-any": "warn",
  },
  ignorePatterns: ["build/", "node_modules/", "tmp/"],
  overrides: [
    {
      files: ["tests/**/*.ts"],
      plugins: ["vitest"],
      rules: {
        "vitest/no-disabled-tests": "warn",
        "vitest/no-focused-tests": "error",
      },
    },
  ],
});