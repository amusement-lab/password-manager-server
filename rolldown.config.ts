import { defineConfig } from 'rolldown'

// Keep local imports bundled. Paths that start with `.`, `/`, or `file:` are
// treated as this project's source files, so Rolldown includes them in the
// build output instead of leaving them for runtime resolution.
// Those are all “this project’s files,” so the function returns `false` for
// them, meaning “do not mark as external.”

// Bare imports like `express`, `pg`, or `node:fs` are treated as external.
// That keeps third-party packages out of the bundle and lets Node load them
// from `node_modules` when the built app runs.
// Those are not local paths, so the function returns `true`, meaning “treat
// this as external.”
const isExternalPackage = (id: string) => {
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
