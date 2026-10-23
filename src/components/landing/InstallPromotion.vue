<script setup>
// Detecta disponibilidad e instalación PWA, y usa instrucciones manuales cuando el navegador no ofrece prompt.
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const installPrompt = ref(null)
const isInstalled = ref(false)
const isPwaReady = ref(false)
const showHelp = ref(false)
const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)
const actionLabel = computed(() => installPrompt.value ? 'Install the app' : 'How to install')

function detectInstalled() {
  isInstalled.value = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true
}

function captureInstallPrompt(event) {
  event.preventDefault()
  isPwaReady.value = true
  installPrompt.value = event
}

function detectPwaSupport() {
  // La promoción requiere contexto seguro y un service worker activo.
  if (!window.isSecureContext || !('serviceWorker' in navigator)) return
  navigator.serviceWorker.ready.then(registration => {
    isPwaReady.value = Boolean(registration.active)
  }).catch(() => {})
}

function confirmInstalled() {
  isInstalled.value = true
  installPrompt.value = null
}

async function install() {
  if (!installPrompt.value) {
    showHelp.value = !showHelp.value
    return
  }

  const promptEvent = installPrompt.value
  // El navegador solo permite abrir el diálogo tras una acción explícita del usuario.
  installPrompt.value = null
  await promptEvent.prompt()
  const choice = await promptEvent.userChoice
  if (choice.outcome !== 'accepted') showHelp.value = true
}

onMounted(() => {
  detectInstalled()
  detectPwaSupport()
  window.addEventListener('beforeinstallprompt', captureInstallPrompt)
  window.addEventListener('appinstalled', confirmInstalled)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeinstallprompt', captureInstallPrompt)
  window.removeEventListener('appinstalled', confirmInstalled)
})
</script>

<template>
  <aside v-if="!isInstalled && isPwaReady" class="landing-install" aria-labelledby="landing-install-title">
    <div class="landing-container landing-install__inner">
      <div class="landing-install__copy">
        <p class="landing-eyebrow landing-eyebrow--light"><span></span>Take it with you</p>
        <h2 id="landing-install-title">Your design space,<br /><em>one tap away.</em></h2>
        <p class="landing-install__description">Install Design Crafter and open your design playground right from your home screen.</p>
        <p v-if="showHelp" class="landing-install__help" role="status">
          <template v-if="isIos">In Safari, tap Share, then “Add to Home Screen”.</template>
          <template v-else>Open your browser menu and choose “Install app” or “Add to Home Screen”.</template>
        </p>
      </div>
      <div class="landing-install__action">
        <button class="landing-install__button" type="button" @click="install">{{ actionLabel }} <span aria-hidden="true">↗</span></button>
        <small>Available on supported browsers</small>
      </div>
    </div>
    <div class="landing-install__orb landing-install__orb--one" aria-hidden="true"></div>
    <div class="landing-install__orb landing-install__orb--two" aria-hidden="true"></div>
  </aside>
</template>
