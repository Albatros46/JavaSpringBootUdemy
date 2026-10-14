import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
      // /api isteklerini Spring Boot'a yönlendirir.
      // Docker'daki backend: 8080, IDE'den çalışan backend: 8081 (.env.local ile değiştir)
      proxy: {
        '/api': env.API_PROXY_TARGET ?? 'http://localhost:8080',
      },
    },
  }
})
