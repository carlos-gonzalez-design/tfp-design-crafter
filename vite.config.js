import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// Configuración mínima de Vite: habilita los SFC de Vue y rutas de recursos relativas para el paquete offline.
export default defineConfig({
  base: './',
  plugins: [vue()],
  server: {
  open: true,
  },
})
