<script setup>
import { ref } from 'vue'

const menuOpen = ref(false)
const props = defineProps({ theme: { type: String, required: true } })
const emit = defineEmits(['theme-change'])
</script>

<template>
  <header class="landing-header">
    <div class="landing-header__inner">
      <a class="landing-brand" href="#main-content" aria-label="Design Crafter home" @click="menuOpen = false">
        <img :src="props.theme === 'dark' ? '/images/logo-design-crafter-dark.svg' : '/images/logo-design-crafter.svg'" alt="Design Crafter" />
      </a>
      <button
        class="landing-header__menu-button"
        type="button"
        :aria-expanded="menuOpen"
        aria-controls="landing-navigation"
        aria-label="Toggle navigation"
        @click="menuOpen = !menuOpen"
      >
        <span></span><span></span>
      </button>
      <nav id="landing-navigation" class="landing-header__navigation" :class="{ 'is-open': menuOpen }" aria-label="Landing navigation">
        <a href="#features" @click="menuOpen = false">Features</a>
        <a href="#how-it-works" @click="menuOpen = false">How it works</a>
        <a href="#about" @click="menuOpen = false">About</a>
        <div class="landing-theme-control" role="group" aria-label="Color theme">
          <button type="button" :aria-pressed="props.theme === 'light'" @click="emit('theme-change', 'light'); menuOpen = false">Light</button>
          <button type="button" :aria-pressed="props.theme === 'dark'" @click="emit('theme-change', 'dark'); menuOpen = false">Dark</button>
        </div>
        <a class="landing-link landing-link--dark landing-header__cta" href="/app" data-app-link @click="menuOpen = false">
          Open playground <span aria-hidden="true">↗</span>
        </a>
      </nav>
    </div>
  </header>
</template>
