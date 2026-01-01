import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'prism-core': ['prismjs'],
          'yaml': ['js-yaml']
        }
      }
    }
  },
  server: {
    port: 3000
  }
});
