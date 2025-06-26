import { build } from 'esbuild'

await build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/index.js',
  format: 'esm',
  platform: 'node',
  target: 'es2022',
  sourcemap: true,
  minify: false,
  external: ['@deno/kv'],
  banner: {
    js: 'import { createRequire } from "module"; const require = createRequire(import.meta.url);'
  }
})