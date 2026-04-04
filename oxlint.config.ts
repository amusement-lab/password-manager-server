import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: ['typescript'],
  categories: {
    correctness: 'error',
    suspicious: 'warn',
  },
  env: {
    node: true,
  },
  rules: {
    'no-console': 'warn',
    'typescript/no-unused-vars': 'error',
    'typescript/no-explicit-any': 'warn',
  },
  ignorePatterns: ['build/', 'node_modules/', 'tmp/'],
  overrides: [
    {
      files: ['tests/**/*.ts'],
      plugins: ['typescript', 'vitest'],
      rules: {
        'vitest/no-disabled-tests': 'warn',
        'vitest/no-focused-tests': 'error',
      },
    },
  ],
})
