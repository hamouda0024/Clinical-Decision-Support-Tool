import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/**
 * GitHub Pages serves project sites under /<repository>/. `npm run build:pages`
 * uses this base and emits a self-contained static bundle to dist/pages.
 */
const PAGES_BASE = '/Clinical-Decision-Support-Tool/';

export default defineConfig(({ mode }) => {
  const pages = mode === 'pages';

  return {
    root: path.join(projectRoot, 'client'),
    base: pages ? PAGES_BASE : '/',
    define: {
      __STATIC_MODE__: JSON.stringify(pages),
    },
    plugins: [react(), tailwindcss()],
    server: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: true,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:4000',
          changeOrigin: false,
        },
      },
    },
    preview: {
      host: '0.0.0.0',
      port: 4173,
    },
    build: {
      outDir: path.join(projectRoot, pages ? 'dist/pages' : 'dist/client'),
      emptyOutDir: true,
      sourcemap: false,
    },
  };
});
