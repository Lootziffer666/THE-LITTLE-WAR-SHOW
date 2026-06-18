import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The Little War Show — Theater (WebGPU/TSL).
// `base: './'` keeps the production bundle portable for any static host.
// `target: 'esnext'` is required: three/webgpu and TSL ship modern syntax
// (top-level await, class fields) that must not be down-levelled.
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    // Guarantee a single three instance so `instanceof` checks across
    // three / three/webgpu / drei never split into two module copies.
    dedupe: ['three'],
  },
  build: {
    target: 'esnext',
    sourcemap: false,
    chunkSizeWarningLimit: 4000,
  },
  optimizeDeps: {
    // The WebGPU build is large and self-contained; let esbuild handle it
    // without aggressive pre-bundling that can mangle the /webgpu subpath.
    exclude: ['three'],
  },
})
