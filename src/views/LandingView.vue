<script setup>
import { onBeforeUnmount, onMounted } from 'vue'
import CssExportShowcase from '../components/landing/CssExportShowcase.vue'
import FoundationsShowcase from '../components/landing/FoundationsShowcase.vue'
import LandingCTA from '../components/landing/LandingCTA.vue'
import LandingFooter from '../components/landing/LandingFooter.vue'
import LandingHeader from '../components/landing/LandingHeader.vue'
import LandingHero from '../components/landing/LandingHero.vue'
import LiveCardDemo from '../components/landing/LiveCardDemo.vue'

const emit = defineEmits(['navigate'])
let revealObserver

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
  <div class="landing" @click="handleNavigation">
    <a class="landing__skip-link" href="#main-content">Skip to content</a>
    <LandingHeader />
    <main id="main-content">
      <LandingHero />
      <FoundationsShowcase />
      <LiveCardDemo />
      <CssExportShowcase />
      <LandingCTA />
    </main>
    <LandingFooter />
  </div>
</template>
