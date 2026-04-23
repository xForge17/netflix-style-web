import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/netflix-style-web/',
  server: {
    port: 4173,
  },
})
