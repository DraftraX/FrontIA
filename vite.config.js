import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', 
  plugins: [react()],
  optimizeDeps: {
    include: ['react-map-gl', 'buffer', 'crypto'],
  },
  define: {
    'process.env': {},
  },
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
      buffer: 'buffer',
    },
  },
});
