<script setup>
// Gestiona el tema persistente, la navegación interna y las animaciones de entrada respetando movimiento reducido.
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import CssExportShowcase from '../components/landing/CssExportShowcase.vue'
import FoundationsShowcase from '../components/landing/FoundationsShowcase.vue'
import LandingCTA from '../components/landing/LandingCTA.vue'
import LandingFooter from '../components/landing/LandingFooter.vue'
import LandingHeader from '../components/landing/LandingHeader.vue'
import LandingHero from '../components/landing/LandingHero.vue'
import InstallPromotion from '../components/landing/InstallPromotion.vue'
import LiveCardDemo from '../components/landing/LiveCardDemo.vue'

const emit = defineEmits(['navigate'])
let revealObserver
const theme = ref(localStorage.getItem('design-crafter-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))

watch(theme, value => {
  localStorage.setItem('design-crafter-theme', value)
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', value === 'dark' ? '#111113' : '#fafaf9')
}, { immediate: true })

// Intercepta solo enlaces internos ordinarios; combinaciones de teclas conservan el comportamiento del navegador.
function handleNavigation(event) {
  const link = event.target.closest?.('a[data-app-link]')
  if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  emit('navigate', link.getAttribute('href'))
}

onMounted(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const elements = document.querySelectorAll('[data-reveal]')

  document.querySelector('.landing')?.classList.add('is-motion-ready')

  if (reducedMotion || !('IntersectionObserver' in window)) {
    // Sin animación solicitada o sin soporte, el contenido queda visible desde el inicio.
    elements.forEach(element => element.classList.add('is-visible'))
    return
  }

  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('is-visible')
      revealObserver.unobserve(entry.target)
    })
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 })

  elements.forEach(element => revealObserver.observe(element))
})

onBeforeUnmount(() => revealObserver?.disconnect())
</script>

<template>
  <div class="landing" :class="{ 'dc-theme--dark': theme === 'dark' }" :data-theme="theme" @click="handleNavigation">
    <a class="landing__skip-link" href="#main-content">Skip to content</a>
    <LandingHeader :theme="theme" @theme-change="theme = $event" />
    <main id="main-content">
      <LandingHero :theme="theme" />
      <InstallPromotion />
      <FoundationsShowcase />
      <LiveCardDemo />
      <CssExportShowcase />
      <LandingCTA />
    </main>
    <LandingFooter />
  </div>
</template>
