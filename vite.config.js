import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/daart-billing-prototype/',
  server: {
    port: 3000
  }
})
