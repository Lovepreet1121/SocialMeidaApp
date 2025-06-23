// social-media-frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Your backend server address
        changeOrigin: true, // Changes the origin of the host header to the target URL
        // rewrite: (path) => path.replace(/^\/api/, ''), // No rewrite needed if backend routes start with /api
      },
    },
  },
});