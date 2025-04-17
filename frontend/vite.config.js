import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://chathaven-zvsp.onrender.com',
        changeOrigin: true,
        secure: true,
      },
      '/socket.io': {
        target: 'https://chathaven-zvsp.onrender.com',
        ws: true,
        changeOrigin: true,
        secure: true,
      }
    }
  }
});
