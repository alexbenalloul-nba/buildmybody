import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy API calls to the local Express backend during development
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
