<script setup>
// Resuelve la ruta actual y cambia entre landing y dashboard sin recargar la aplicación.
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import LandingView from './views/LandingView.vue'

const DashboardView = defineAsyncComponent(() => import('./views/DashboardView.vue'))
const currentPath = ref(window.location.pathname)
const normalizedPath = computed(() => currentPath.value.replace(/\/$/, '') || '/')
const isLanding = computed(() => normalizedPath.value === '/')

// Mantiene una navegación ligera con History API; popstate actualiza la vista al usar atrás/adelante.
function syncPath() {
  currentPath.value = window.location.pathname
  window.scrollTo({ top: 0, behavior: 'instant' })
}

function navigate(path) {
  if (window.location.pathname !== path) window.history.pushState({}, '', path)
  syncPath()
}

onMounted(() => window.addEventListener('popstate', syncPath))
onBeforeUnmount(() => window.removeEventListener('popstate', syncPath))
</script>

<template>
  <LandingView v-if="isLanding" @navigate="navigate" />
  <DashboardView v-else :current-path="currentPath" @navigate="navigate" />
</template>
