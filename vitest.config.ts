import { loadEnv } from 'vite'
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    env: loadEnv('test', process.cwd(), ''),
    testTimeout: 15000,
    exclude: [...configDefaults.exclude, 'tmp'],
  },
})
