import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/aereus-ornare/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    minify: true,
  },
})
