<script setup>
import { Settings } from '@lucide/vue'
import { FOUNDATION_SECTIONS } from '../../utils/foundationConfig.js'

defineProps({
  activeFoundation: { type: String, default: null },
})

const emit = defineEmits(['select', 'settings'])
</script>

<template>
  <aside class="foundation-panel" aria-label="Design foundations">
    <div class="foundation-panel__heading">
      <p class="eyebrow">Design system</p>
      <h2 class="foundation-panel__title">Foundations</h2>
    </div>
    <nav class="foundation-nav" aria-label="Foundations">
      <button
        class="foundation-nav__item foundation-nav__item--home"
        :class="{ 'foundation-nav__item--active': activeFoundation === null }"
        type="button"
        :aria-pressed="activeFoundation === null"
        @click="emit('select', null)"
      >Home</button>
      <button
        v-for="section in FOUNDATION_SECTIONS"
        :key="section.id"
        class="foundation-nav__item"
        :class="[`foundation-nav__item--${section.id}`, { 'foundation-nav__item--active': activeFoundation === section.id }]"
        type="button"
        :aria-pressed="activeFoundation === section.id"
        @click="emit('select', section.id)"
      >{{ section.label }}</button>
    </nav>
    <div class="foundation-panel__actions" aria-label="Global actions">
      <button class="foundation-action" type="button" @click="emit('settings')"><Settings :size="16" aria-hidden="true" /><span>Settings</span></button>
    </div>
  </aside>
</template>
