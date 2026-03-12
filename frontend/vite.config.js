import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite Configuration
 * ──────────────────
 * - React plugin for JSX transform + HMR
 * - Dev server on port 5173
 * - Proxy: all /api/* requests → Express on port 5000
 *   (avoids CORS during development)
 */
export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    proxy: {
      '/api': {
        target:       'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
