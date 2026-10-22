<script setup>
import { computed } from 'vue'
import { Moon, Sun } from '@lucide/vue'

const props = defineProps({ theme: { type: String, required: true } })
const emit = defineEmits(['change'])
const label = computed(() => props.theme === 'dark' ? 'Dark' : 'Light')
</script>

<template>
  <button class="theme-control" type="button" role="switch" :aria-checked="theme === 'dark'" :aria-label="`Switch theme. Current mode: ${label}`" @click="emit('change', theme === 'dark' ? 'light' : 'dark')">
    <Sun v-if="theme === 'light'" :size="16" aria-hidden="true" />
    <Moon v-else :size="16" aria-hidden="true" />
    <span>{{ label }}</span>
  </button>
</template>
