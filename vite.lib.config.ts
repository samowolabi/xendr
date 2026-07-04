import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { fileURLToPath, URL } from 'node:url'

// Library build for xendr.
// JS + types only. The stylesheet is compiled separately by the Tailwind CLI
// (see the `build:css` script), so Tailwind is never a runtime dependency.
export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  // Don't copy public/ (favicon, fonts, icons) into the package.
  publicDir: false,
  plugins: [
    react(),
    // Per-file declarations (no API Extractor, it doesn't support TS 6 yet).
    // Aliases are rewritten to relative paths in the emitted .d.ts.
    dts({
      tsconfigPath: './tsconfig.app.json',
      entryRoot: fileURLToPath(new URL('./src', import.meta.url)),
      include: [
        'src/index.ts',
        'src/components/widget/**',
        'src/components/**',
        'src/lib/**',
        'src/types/**',
        'src/app/pages/Landing/**',
        'src/app/embedConfig.ts',
      ],
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
})
