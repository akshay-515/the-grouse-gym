import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This allows the container to be accessible from your host machine (Windows)
    host: '0.0.0.0', 
    // This forces Vite to watch for file changes even in the Docker environment
    watch: {
      usePolling: true,
    },
  },
})