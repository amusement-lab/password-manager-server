import { defineConfig } from 'rolldown'

const isExternalPackage = (id) => {
  return !id.startsWith('.') && !id.startsWith('/') && !id.startsWith('file:')
}

export default defineConfig({
  input: 'src/index.ts',
  platform: 'node',
  tsconfig: false,
  external: isExternalPackage,
  resolve: {
    extensionAlias: {
      '.js': ['.ts', '.js'],
      '.mjs': ['.mts', '.mjs'],
      '.cjs': ['.cts', '.cjs'],
    },
  },
  transform: {
    target: 'es2023',
    typescript: {
      rewriteImportExtensions: 'rewrite',
    },
  },
  output: {
    dir: 'build',
    format: 'esm',
    sourcemap: true,
    preserveModules: true,
    preserveModulesRoot: 'src',
  },
})