import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: '/system_cont/', // Cambia 'system_cont' por el nombre de tu repo si es diferente
  plugins: [vue()],
})
