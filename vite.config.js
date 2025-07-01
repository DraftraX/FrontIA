// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["react-map-gl"],
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
optimizeDeps: {
  include: ['buffer', 'crypto'],
},


})
