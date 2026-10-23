import { createApp } from 'vue'
import './styles/main.css'
import App from './App.vue'

// Monta la aplicación; el soporte offline se registra solo en producción y tras cargar la página.
createApp(App).mount('#app')

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(error => {
      console.error('Design Crafter could not register its offline support.', error)
    })
  })
}
